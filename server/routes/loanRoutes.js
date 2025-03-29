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
      B.Title, 
      B.Author, 
      L.BorrowedAt, 
      L.DueAT, 
      L.ReturnedAt
    FROM LOAN AS L
    JOIN USER AS U ON L.UserID = U.UserID
    JOIN BOOK AS B ON L.ItemID = B.BookID
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

    const incrementCopiesQuery = `
      UPDATE BOOK_INVENTORY
      SET AvailableCopies = AvailableCopies + 1
      WHERE BookID = (
        SELECT ItemID FROM LOAN WHERE LoanID = ? AND ItemType = 'Book'
      )
    `;

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

        // Update the loan's ReturnedAt field
        connection.query(updateLoanQuery, [LoanID], (err, results) => {
          if (err || results.affectedRows === 0) {
            console.error("Error updating loan or no rows affected:", err);
            connection.rollback(() => connection.release());
            sendJsonResponse(res, 404, {
              success: false,
              error: "Loan not found or already returned",
            });
            return;
          }

          // Increment AvailableCopies in BOOK_INVENTORY
          connection.query(incrementCopiesQuery, [LoanID], (err, results) => {
            if (err || results.affectedRows === 0) {
              console.error(
                "Error incrementing AvailableCopies or no rows affected:",
                err
              );
              connection.rollback(() => connection.release());
              sendJsonResponse(res, 500, {
                success: false,
                error: "Failed to update book inventory",
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

              console.log(
                "Loan return confirmed successfully for LoanID:",
                LoanID
              );
              connection.release();
              sendJsonResponse(res, 200, { success: true });
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

module.exports = {
  getUserLoans,
  confirmLoan,
  confirmReturn,
};
