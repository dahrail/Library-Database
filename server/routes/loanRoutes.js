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
    WHEN L.ItemType = 'book' THEN B.Title
    WHEN L.ItemType = 'media' THEN M.Title
    WHEN L.ItemType = 'device' THEN D.Model
    ELSE 'Unknown'
  END AS Title,
  CASE 
    WHEN L.ItemType = 'book' THEN B.Author
    WHEN L.ItemType = 'media' THEN M.Author
    WHEN L.ItemType = 'device' THEN D.Brand
    ELSE 'Unknown'
  END AS AuthorOrBrand,
  L.BorrowedAt,
  L.DueAT,
  L.ReturnedAt
FROM LOAN AS L
LEFT JOIN USER AS U ON L.UserID = U.UserID
LEFT JOIN BOOK AS B ON L.ItemID = B.BookID
LEFT JOIN MEDIA AS M ON L.ItemID = M.MediaID
LEFT JOIN DEVICE AS D ON L.ItemID = D.DeviceID
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
const borrowBook = async (req, res) => {
  try {
    const { BookID, UserID, Role } = await parseRequestBody(req);
    
    // Check if the user has loaned the book and not returned it
    const activeLoanQuery = `
      SELECT * FROM LOAN 
      WHERE UserID = ? AND ItemID = ? AND ItemType = 'Book' AND ReturnedAt IS NULL
    `;
    const [activeLoan] = await pool.promise().query(activeLoanQuery, [UserID, BookID]);

    if (activeLoan.length > 0) {
      return sendJsonResponse(res, 400, { success: false, error: "You have borrowed this item. You can only borrow this item once." });
    }

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
    const borrowLimit = Role === "Student" ? 2 : 3;

    // Check if the user meet the borrow limit
    const activeLoansQuery = `
      SELECT COUNT(*) AS activeLoans
      FROM LOAN
      WHERE UserID = ? AND ItemType = 'Book' AND ReturnedAt IS NULL
    `;
    const [activeLoans] = await pool.promise().query(activeLoansQuery, [UserID]);

    // If the number of active loans exceeds the borrow limit, reject the request
    if (activeLoans[0].activeLoans >= borrowLimit) {
      return sendJsonResponse(res, 400, { success: false, error: `You can only borrow up to ${borrowLimit} book at a time.` });
    }

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
    console.error("Error in borrowBook:", error);
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

// Route to handle borrowing a media item
const borrowMedia = async (req, res) => {
  try {
    const { UserID, ItemID } = await parseRequestBody(req);
    // Start a transaction using a connection from the pool
    const connection = await pool.promise().getConnection();

    // Check if the user has loaned the media and not returned it
    const activeLoanQuery = `
      SELECT * FROM LOAN 
      WHERE UserID = ? AND ItemID = ? AND ItemType = 'Media' AND ReturnedAt IS NULL
    `;
    const [activeLoan] = await pool.promise().query(activeLoanQuery, [UserID, ItemID]);

    if (activeLoan.length > 0) {
      return sendJsonResponse(res, 400, { success: false, error: "You have borrowed this item. You can only borrow this item once." });
    }

    try {
      await connection.beginTransaction();

      const roleQuery = `SELECT Role FROM USER WHERE UserID = ?`;
      const [user] = await connection.query(roleQuery, [UserID]);
      const role = user[0]?.Role || "Student";
      const loanPeriod = role === "Student" ? 7 : 14;
      const borrowLimit = Role === "Student" ? 2 : 3;

    // Check if the user meet the borrow limit
    const activeLoansQuery = `
      SELECT COUNT(*) AS activeLoans
      FROM LOAN
      WHERE UserID = ? AND ItemType = 'Media' AND ReturnedAt IS NULL
    `;
    const [activeLoans] = await pool.promise().query(activeLoansQuery, [UserID]);

    // If the number of active loans exceeds the borrow limit, reject the request
    if (activeLoans[0].activeLoans >= borrowLimit) {
      return sendJsonResponse(res, 400, { success: false, error: `You can only borrow up to ${borrowLimit} media at a time.` });
    }

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

// DEVICE SESSION
const borrowDevice = async (req, res) => {
  try {
    const { UserID, DeviceID } = await parseRequestBody(req);

    // Check if the user has loaned the device and not returned it
    const activeLoanQuery = `
      SELECT * FROM LOAN 
      WHERE UserID = ? AND ItemID = ? AND ItemType = 'Device' AND ReturnedAt IS NULL
    `;
    const [activeLoan] = await pool.promise().query(activeLoanQuery, [UserID, DeviceID]);

    if (activeLoan.length > 0) {
      return sendJsonResponse(res, 400, { success: false, error: "You have borrowed this item. You can only borrow this item once." });
    }

    // Check if the device is available
    const checkQuery = "SELECT AvailableCopies FROM DEVICE_INVENTORY WHERE DeviceID = ?";
    const [rows] = await pool.promise().query(checkQuery, [DeviceID]);

    if (rows.length === 0 || rows[0].AvailableCopies == 0) {
      return sendJsonResponse(res, 400, { success: false, error: "Device is not available for borrowing." });
    }

    // Determine loan period based on user role
    const roleQuery = `SELECT Role FROM USER WHERE UserID = ?`;
    const [user] = await pool.promise().query(roleQuery, [UserID]);
    const role = user[0]?.Role || "Student";
    const loanPeriod = role === "Student" ? 7 : 14;
    const borrowLimit = Role === "Student" ? 2 : 3;

    // Chekc if the user meet the borrow limit
    const activeLoansQuery = `
      SELECT COUNT(*) AS activeLoans
      FROM LOAN
      WHERE UserID = ? AND ItemType = 'Device' AND ReturnedAt IS NULL
    `;
    const [activeLoans] = await pool.promise().query(activeLoansQuery, [UserID]);

    // If the number of active loans exceeds the borrow limit, reject the request
    if (activeLoans[0].activeLoans >= borrowLimit) {
      return sendJsonResponse(res, 400, { success: false, error: `You can only borrow up to ${borrowLimit} devices at a time.` });
    }

    // Update inventory
    const updateQuery = "UPDATE DEVICE_INVENTORY SET AvailableCopies = AvailableCopies - 1 WHERE DeviceID = ?";
    await pool.promise().query(updateQuery, [DeviceID]);

    // Add entry to Loan table
    const loanQuery = `
      INSERT INTO LOAN (UserID, ItemType, ItemID, BorrowedAt, DueAt)
      VALUES (?, 'Device', ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY))
    `;
    await pool.promise().query(loanQuery, [UserID, DeviceID,loanPeriod]);

    sendJsonResponse(res, 200, { success: true });
  } catch (error) {
    console.error("Error borrowing device:", error);
    sendJsonResponse(res, 500, { success: false, error: "Internal server error" });
  }
};

module.exports = {
  getUserLoans,
  confirmReturn,
  borrowBook,
  borrowMedia,
  borrowDevice,
};
