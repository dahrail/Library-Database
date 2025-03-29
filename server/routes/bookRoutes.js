const pool = require("../config/db");
const { parseRequestBody, sendJsonResponse } = require("../utils/requestUtils");

// Get all books
const getAllBooks = (req, res) => {
  console.log("Fetching all books");

  pool.query(
    "SELECT B.BookID, B.Title, B.Author, B.Genre, B.PublicationYear, I.AvailableCopies FROM BOOK AS B, BOOK_INVENTORY AS I WHERE B.BookID = I.BookID",
    (err, results) => {
      if (err) {
        console.error("Error executing books query:", err);
        sendJsonResponse(res, 500, { error: "Internal server error" });
        return;
      }

      const books = results.map((book) => ({
        bookID: book.BookID,
        title: book.Title,
        author: book.Author,
        genre: book.Genre,
        year: book.PublicationYear,
        copies: book.AvailableCopies,
        isLoaned: false, // Default values for non-logged in users
        userHasHold: false,
        otherUserHasHold: false,
      }));

      console.log(`Sending ${books.length} books to frontend`);
      sendJsonResponse(res, 200, books);
    }
  );
};

// Get books for a specific user
const getUserBooks = (req, res, userId) => {
  console.log(`Fetching books for user ID: ${userId}`);

  const query = `
    SELECT 
      B.BookID, 
      B.Title, 
      B.Author, 
      B.Genre, 
      B.PublicationYear, 
      I.AvailableCopies,
      CASE 
        WHEN EXISTS (
          SELECT 1 
          FROM LOAN AS L 
          WHERE L.ItemID = B.BookID 
            AND L.ItemType = 'Book' 
            AND L.ReturnedAt IS NULL
        ) THEN 1
        ELSE 0
      END AS isLoaned,
      CASE 
        WHEN EXISTS (
          SELECT 1 
          FROM HOLD AS H 
          WHERE H.ItemID = B.BookID 
            AND H.ItemType = 'Book' 
            AND H.HoldStatus = 'Active'
            AND H.UserID = ?
        ) THEN 1
        ELSE 0
      END AS UserHasHold,
      CASE 
        WHEN EXISTS (
          SELECT 1 
          FROM HOLD AS H 
          WHERE H.ItemID = B.BookID 
            AND H.ItemType = 'Book' 
            AND H.HoldStatus = 'Active'
            AND H.UserID != ?
        ) THEN 1
        ELSE 0
      END AS OtherUserHasHold
    FROM BOOK AS B
    LEFT JOIN BOOK_INVENTORY AS I ON B.BookID = I.BookID
  `;

  pool.query(query, [userId, userId], (err, results) => {
    if (err) {
      console.error("Error fetching books for user:", err);
      sendJsonResponse(res, 500, { error: "Internal server error" });
      return;
    }

    const books = results.map((book) => ({
      bookID: book.BookID,
      title: book.Title,
      author: book.Author,
      genre: book.Genre,
      year: book.PublicationYear,
      copies: book.AvailableCopies,
      isLoaned: book.isLoaned === 1,
      userHasHold: book.UserHasHold === 1,
      otherUserHasHold: book.OtherUserHasHold === 1,
    }));

    console.log(`Sending ${books.length} books for user ${userId}`);
    sendJsonResponse(res, 200, books);
  });
};

// Add a new book
const addBook = async (req, res) => {
  try {
    const bookData = await parseRequestBody(req);
    console.log("Adding new book:", bookData.Title);

    const {
      Title,
      Author,
      Genre,
      PublicationYear,
      Publisher,
      Language,
      Format,
      ISBN,
      TotalCopies,
      AvailableCopies,
      ShelfLocation,
    } = bookData;

    const query =
      "INSERT INTO BOOK (Title, Author, Genre, PublicationYear, Publisher, Language, Format, ISBN) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    pool.query(
      query,
      [
        Title,
        Author,
        Genre,
        PublicationYear,
        Publisher,
        Language,
        Format,
        ISBN,
      ],
      (err, results) => {
        if (err) {
          console.error("Error adding book:", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({ success: false, error: "Database error" })
          );
        }

        const BookID = results.insertId;
        const inventoryQuery =
          "INSERT INTO BOOK_INVENTORY (BookID, TotalCopies, AvailableCopies, ShelfLocation) VALUES (?, ?, ?, ?)";
        pool.query(
          inventoryQuery,
          [BookID, TotalCopies, AvailableCopies, ShelfLocation],
          (err, inventoryResults) => {
            if (err) {
              console.error("Error updating inventory:", err);
              res.writeHead(500, { "Content-Type": "application/json" });
              return res.end(
                JSON.stringify({
                  success: false,
                  error: "Failed to update inventory",
                })
              );
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, BookID }));
          }
        );
      }
    );
  } catch (error) {
    console.error("Error in addBook:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Server error" }));
  }
};

//Delete book
const deleteBook = async (req, res) => {
  try {
    const { BookID } = await parseRequestBody(req);
    pool.query(
      "DELETE FROM BOOK_INVENTORY WHERE BookId = ?",
      [BookID],
      (err) => {
        if (err) {
          console.error("Error delete inventory", err);
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({ success: false, error: "Database error" })
          );
        }
        pool.query("DELETE FROM BOOK WHERE BookID = ?", [BookID], (err) => {
          if (err) {
            console.error("Error deleting book", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(
              JSON.stringify({ success: false, error: "Failed to delete book" })
            );
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              success: true,
              message: "Book deleted successfully",
            })
          );
        });
      }
    );
  } catch (error) {
    // If there's an error during the parsing or any other part
    console.error("Error in deleteBook:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Server error" }));
  }
};

//updateBook
const updateBook = async (req, res) => {
  try {
    const bookData = await parseRequestBody(req);
    console.log("Updating book:", bookData.BookID);

    const {
      BookID,
      Title,
      Author,
      Genre,
      PublicationYear,
      Publisher,
      Language,
      Format,
      ISBN,
      TotalCopies,
      AvailableCopies,
      ShelfLocation,
    } = bookData;

    // Initialize an array for the dynamic set of update fields and their values
    let updateFields = [];
    let queryParams = [];

    // Add fields to update only if the user provided new values
    if (Title) {
      updateFields.push("Title = ?");
      queryParams.push(Title);
    }
    if (Author) {
      updateFields.push("Author = ?");
      queryParams.push(Author);
    }
    if (Genre) {
      updateFields.push("Genre = ?");
      queryParams.push(Genre);
    }
    if (PublicationYear) {
      updateFields.push("PublicationYear = ?");
      queryParams.push(PublicationYear);
    }
    if (Publisher) {
      updateFields.push("Publisher = ?");
      queryParams.push(Publisher);
    }
    if (Language) {
      updateFields.push("Language = ?");
      queryParams.push(Language);
    }
    if (Format) {
      updateFields.push("Format = ?");
      queryParams.push(Format);
    }
    if (ISBN) {
      updateFields.push("ISBN = ?");
      queryParams.push(ISBN);
    }

    // Construct the dynamic update query for the book details
    const updateQuery = `UPDATE BOOK SET ${updateFields.join(
      ", "
    )} WHERE BookID = ?`;
    queryParams.push(BookID); // Always include the BookID to target the correct book

    pool.query(updateQuery, queryParams, (err, results) => {
      if (err) {
        console.error("Error updating book:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ success: false, error: "Database error" })
        );
      }

      // If there are inventory updates, handle them similarly
      let inventoryUpdateFields = [];
      let inventoryQueryParams = [];

      if (TotalCopies !== undefined) {
        inventoryUpdateFields.push("TotalCopies = ?");
        inventoryQueryParams.push(TotalCopies);
      }
      if (AvailableCopies !== undefined) {
        inventoryUpdateFields.push("AvailableCopies = ?");
        inventoryQueryParams.push(AvailableCopies);
      }
      if (ShelfLocation) {
        inventoryUpdateFields.push("ShelfLocation = ?");
        inventoryQueryParams.push(ShelfLocation);
      }

      if (inventoryUpdateFields.length > 0) {
        const inventoryQuery = `UPDATE BOOK_INVENTORY SET ${inventoryUpdateFields.join(
          ", "
        )} WHERE BookID = ?`;
        inventoryQueryParams.push(BookID);

        pool.query(
          inventoryQuery,
          inventoryQueryParams,
          (err, inventoryResults) => {
            if (err) {
              console.error("Error updating inventory:", err);
              res.writeHead(500, { "Content-Type": "application/json" });
              return res.end(
                JSON.stringify({
                  success: false,
                  error: "Failed to update inventory",
                })
              );
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true }));
          }
        );
      } else {
        // If no inventory update is needed, send a success response
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      }
    });
  } catch (error) {
    console.error("Error in updateBook:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Server error" }));
  }
};

module.exports = {
  getAllBooks,
  getUserBooks,
  addBook,
  deleteBook,
  updateBook,
};
