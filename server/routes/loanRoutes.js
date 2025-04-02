const pool = require("../config/db");
const { parseRequestBody, sendJsonResponse } = require("../utils/requestUtils");

// Get loans for a specific user
const getUserLoans = (req, res, userId) => {
  console.log(`Fetching loans for user ID: ${userId}`);

  const query = `
    SELECT 
      L.LoanID, 
      U.FirstName, 
      U.LastName, 
      L.ItemType,
      CASE 
        WHEN L.ItemType = 'Book' THEN B.Title
        WHEN L.ItemType = 'Media' THEN M.Title
        ELSE 'Unknown'
      END AS Title,
      CASE 
        WHEN L.ItemType = 'Book' THEN B.Author
        WHEN L.ItemType = 'Media' THEN M.Author
        ELSE 'Unknown'
      END AS Author,
      L.BorrowedAt, 
      L.DueAt, 
      L.ReturnedAt
    FROM LOAN L
    JOIN USER U ON L.UserID = U.UserID
    LEFT JOIN BOOK B ON (L.ItemType = 'Book' AND L.ItemID = B.BookID)
    LEFT JOIN MEDIA M ON (L.ItemType = 'Media' AND L.ItemID = M.MediaID)
    WHERE L.UserID = ?
  `;

  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching loans for user:", err);
      sendJsonResponse(res, 500, {
        success: false,
        error: "Failed to fetch loans",
      });
      return;
    }

    console.log(`Retrieved ${results.length} loans for user ${userId}`);
    sendJsonResponse(res, 200, { success: true, loans: results });
  });
};

// Confirm a loan
const confirmLoan = async (req, res) => {
  try {
    const { BookID, UserID, Role } = await parseRequestBody(req);
    console.log(
      `Confirming loan for book ID: ${BookID}, user ID: ${UserID}, role: ${Role}`
    );

    const decrementQuery = `
      UPDATE BOOK_INVENTORY
      SET AvailableCopies = AvailableCopies - 1
      WHERE BookID = ? AND AvailableCopies > 0
    `;

    const insertLoanQuery = `
      INSERT INTO LOAN (UserID, ItemType, ItemID, BorrowedAt, DueAT)
      VALUES (?, 'Book', ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY))
    `;

    // Determine the loan period based on the user's role
    const loanPeriod = Role === "Student" ? 7 : 14;

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting database connection:", err);
        sendJsonResponse(res, 500, {
          success: false,
          error: "Database connection error",
        });
        return;
      }

      connection.beginTransaction((err) => {
        if (err) {
          console.error("Error starting transaction:", err);
          connection.release();
          sendJsonResponse(res, 500, {
            success: false,
            error: "Transaction error",
          });
          return;
        }

        // Decrement AvailableCopies
        connection.query(decrementQuery, [BookID], (err, results) => {
          if (err || results.affectedRows === 0) {
            console.error(
              "Error decrementing AvailableCopies or no rows affected:",
              err
            );
            connection.rollback(() => connection.release());
            sendJsonResponse(res, 400, {
              success: false,
              error: "No available copies to loan",
            });
            return;
          }

          // Insert into LOAN table
          connection.query(
            insertLoanQuery,
            [UserID, BookID, loanPeriod],
            (err, results) => {
              if (err) {
                console.error("Error inserting into LOAN table:", err);
                connection.rollback(() => connection.release());
                sendJsonResponse(res, 500, {
                  success: false,
                  error: "Failed to create loan record",
                });
                return;
              }

              // Commit the transaction
              connection.commit((err) => {
                if (err) {
                  console.error("Error committing transaction:", err);
                  connection.rollback(() => connection.release());
                  sendJsonResponse(res, 500, {
                    success: false,
                    error: "Transaction commit error",
                  });
                  return;
                }

                connection.release();
                console.log("Loan confirmed successfully for book ID:", BookID);
                sendJsonResponse(res, 200, { success: true });
              });
            }
          );
        });
      });
    });
  } catch (error) {
    console.error("Error in confirmLoan:", error);
    sendJsonResponse(res, 500, { success: false, error: "Server error" });
  }
};

// Confirm a return
const confirmReturn = async (req, res) => {
  try {
    const { LoanID } = await parseRequestBody(req);
    console.log(`Confirming return for LoanID: ${LoanID}`); // Debugging line

    const updateLoanQuery = `
      UPDATE LOAN
      SET ReturnedAt = NOW() 
      WHERE LoanID = ?
    `;

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting database connection:", err);
        sendJsonResponse(res, 500, { success: false, error: "Database connection error" });
        return;
      }

      connection.beginTransaction((err) => {
        if (err) {
          console.error("Error starting transaction:", err);
          connection.release();
          sendJsonResponse(res, 500, { success: false, error: "Transaction error" });
          return;
        }

        // Update the loan's ReturnedAt field
        connection.query(updateLoanQuery, [LoanID], (err, results) => {
          if (err || results.affectedRows === 0) {
            console.error("Error updating loan or no rows affected:", err);
            connection.rollback(() => connection.release());
            sendJsonResponse(res, 404, { success: false, error: "Loan not found or already returned" });
            return;
          }

          // Fetch the loan's ItemType and ItemID
          connection.query("SELECT ItemType, ItemID FROM LOAN WHERE LoanID = ?", [LoanID], (err, loanResults) => {
            if (err || loanResults.length === 0) {
              console.error("Error fetching loan details:", err);
              connection.rollback(() => connection.release());
              sendJsonResponse(res, 500, { success: false, error: "Failed to fetch loan details" });
              return;
            }
            
            const { ItemType, ItemID } = loanResults[0];
            let updateInventoryQuery = "";
            if (ItemType === "Book") {
              updateInventoryQuery = `
                UPDATE BOOK_INVENTORY
                SET AvailableCopies = AvailableCopies + 1
                WHERE BookID = ?
              `;
            } else if (ItemType === "Media") {
              updateInventoryQuery = `
                UPDATE MEDIA_INVENTORY
                SET AvailableCopies = AvailableCopies + 1
                WHERE MediaID = ?
              `;
            } else {
              console.error("Unknown ItemType:", ItemType);
              connection.rollback(() => connection.release());
              sendJsonResponse(res, 500, { success: false, error: "Unknown item type" });
              return;
            }

            // Update the inventory accordingly
            connection.query(updateInventoryQuery, [ItemID], (err, results) => {
              if (err || results.affectedRows === 0) {
                console.error("Error incrementing AvailableCopies or no rows affected:", err);
                connection.rollback(() => connection.release());
                sendJsonResponse(res, 500, { success: false, error: "Failed to update inventory" });
                return;
              }

              // Commit the transaction
              connection.commit((err) => {
                if (err) {
                  console.error("Error committing transaction:", err);
                  connection.rollback(() => connection.release());
                  sendJsonResponse(res, 500, { success: false, error: "Transaction commit error" });
                  return;
                }
                console.log("Loan return confirmed successfully for LoanID:", LoanID);
                connection.release();
                sendJsonResponse(res, 200, { success: true });
              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Error in confirmReturn:", error);
    sendJsonResponse(res, 500, { success: false, error: "Server error" });
  }
};

// Route to handle borrowing a media item
const borrowMedia = async (req, res) => {
  try {
    const { UserID, ItemID } = await parseRequestBody(req);
    // Start a transaction using a connection from the pool
    const connection = await pool.promise().getConnection();
    try {
      await connection.beginTransaction();

      // Decrement AvailableCopies in MEDIA_INVENTORY for the borrowed media item
      const updateQuery = `
        UPDATE MEDIA_INVENTORY
        SET AvailableCopies = AvailableCopies - 1
        WHERE MediaID = ? AND AvailableCopies > 0
      `;
      const [updateResult] = await connection.query(updateQuery, [ItemID]);
      console.log("Media inventory update result:", updateResult); // <-- added logging
      if (updateResult.affectedRows === 0) {
        await connection.rollback();
        connection.release();
        return sendJsonResponse(res, 400, { success: false, error: "No available copies for media item." });
      }

      // Determine loan period based on user role
      const roleQuery = `SELECT Role FROM USER WHERE UserID = ?`;
      const [user] = await connection.query(roleQuery, [UserID]);
      const role = user[0]?.Role || "Student";
      const loanPeriod = role === "Student" ? 7 : 14;

      // Insert loan record with ItemType always 'Media'
      const insertQuery = `
        INSERT INTO LOAN (UserID, ItemType, ItemID, BorrowedAt, DueAt)
        VALUES (?, 'Media', ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY))
      `;
      const [loanResult] = await connection.query(insertQuery, [UserID, ItemID, loanPeriod]);
      if (loanResult.affectedRows === 0) {
        await connection.rollback();
        connection.release();
        return sendJsonResponse(res, 400, { success: false, error: "Failed to borrow media item." });
      }

      await connection.commit();
      connection.release();
      sendJsonResponse(res, 200, { success: true });
    } catch (transError) {
      await connection.rollback();
      connection.release();
      console.error("Transaction error borrowing media item:", transError);
      sendJsonResponse(res, 500, { success: false, error: "Internal server error." });
    }
  } catch (error) {
    console.error("Error borrowing media item:", error);
    sendJsonResponse(res, 500, { success: false, error: "Internal server error." });
  }
};

module.exports = {
  getUserLoans,
  confirmLoan,
  confirmReturn,
  borrowMedia,
};
