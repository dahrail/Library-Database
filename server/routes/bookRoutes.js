const pool = require('../config/db');
const { parseRequestBody, sendJsonResponse } = require('../utils/requestUtils');

// Get all books
const getAllBooks = (req, res) => {
  console.log('Fetching all books');
  
  pool.query(
    'SELECT B.BookID, B.Title, B.Author, B.Genre, B.PublicationYear, I.AvailableCopies FROM BOOK AS B, BOOK_INVENTORY AS I WHERE B.BookID = I.BookID',
    (err, results) => {
      if (err) {
        console.error("Error executing books query:", err);
        sendJsonResponse(res, 500, { error: "Internal server error" });
        return;
      }
      
      const books = results.map(book => ({
        bookID: book.BookID,
        title: book.Title,
        author: book.Author,
        genre: book.Genre,
        year: book.PublicationYear,
        copies: book.AvailableCopies
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
      console.error('Error fetching books for user:', err);
      sendJsonResponse(res, 500, { error: 'Internal server error' });
      return;
    }

    const books = results.map(book => ({
      bookID: book.BookID,
      title: book.Title,
      author: book.Author,
      genre: book.Genre,
      year: book.PublicationYear,
      copies: book.AvailableCopies,
      userHasHold: book.UserHasHold === 1,
      otherUserHasHold: book.OtherUserHasHold === 1
    }));

    console.log(`Sending ${books.length} books for user ${userId}`);
    sendJsonResponse(res, 200, books);
  });
};

// Add a new book
const addBook = async (req, res) => {
  try {
    const bookData = await parseRequestBody(req);
    console.log('Adding new book:', bookData.Title);
    
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
      ShelfLocation
    } = bookData;

    // Insert into BOOK table
    const bookQuery = `
      INSERT INTO BOOK (Title, Author, Genre, PublicationYear, Publisher, Language, Format, ISBN)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Insert into BOOK_INVENTORY table
    const inventoryQuery = `
      INSERT INTO BOOK_INVENTORY (BookID, TotalCopies, AvailableCopies, ShelfLocation)
      VALUES (LAST_INSERT_ID(), ?, ?, ?)
    `;

    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting database connection:', err);
        sendJsonResponse(res, 500, { success: false, error: 'Database connection error' });
        return;
      }

      connection.beginTransaction((err) => {
        if (err) {
          console.error('Error starting transaction:', err);
          connection.release();
          sendJsonResponse(res, 500, { success: false, error: 'Transaction error' });
          return;
        }

        // Insert into BOOK table
        connection.query(
          bookQuery,
          [Title, Author, Genre, PublicationYear, Publisher, Language, Format, ISBN],
          (err, bookResults) => {
            if (err) {
              console.error('Error inserting book:', err);
              connection.rollback(() => connection.release());
              sendJsonResponse(res, 500, { success: false, error: 'Failed to add book' });
              return;
            }

            // Insert into BOOK_INVENTORY table
            connection.query(
              inventoryQuery,
              [TotalCopies, AvailableCopies, ShelfLocation],
              (err, inventoryResults) => {
                if (err) {
                  console.error('Error inserting book inventory:', err);
                  connection.rollback(() => connection.release());
                  sendJsonResponse(res, 500, { success: false, error: 'Failed to add book inventory' });
                  return;
                }

                // Commit the transaction
                connection.commit((err) => {
                  if (err) {
                    console.error('Error committing transaction:', err);
                    connection.rollback(() => connection.release());
                    sendJsonResponse(res, 500, { success: false, error: 'Transaction commit error' });
                    return;
                  }

                  connection.release();
                  console.log('Book added successfully:', Title);
                  sendJsonResponse(res, 200, { success: true });
                });
              }
            );
          }
        );
      });
    });
  } catch (error) {
    console.error('Error in addBook:', error);
    sendJsonResponse(res, 500, { success: false, error: "Server error" });
  }
};

module.exports = {
  getAllBooks,
  getUserBooks,
  addBook
};
