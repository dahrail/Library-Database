const pool = require("../config/db");
const { sendJsonResponse } = require("../utils/requestUtils");

const getDataReport = (req, res) => {
  const query = `
    SELECT 
      U.UserID, U.FirstName, U.LastName, 
      B.BookID, B.Title, B.Author, 
      L.LoanID, L.BorrowedAt, L.DueAT 
    FROM USER AS U
    LEFT JOIN LOAN AS L ON U.UserID = L.UserID
    LEFT JOIN BOOK AS B ON L.ItemID = B.BookID
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data report:", err);
      sendJsonResponse(res, 500, {
        success: false,
        error: "Failed to fetch data report",
      });
      return;
    }

    sendJsonResponse(res, 200, { success: true, data: results });
  });
};

const getFineReport = (req, res) => {
  console.log("Fetching fine report");

  const query = `
    SELECT 
      U.FirstName, 
      U.LastName, 
      B.Title, 
      B.Author, 
      DATE_FORMAT(L.BorrowedAt, '%Y-%m-%d %H:%i:%s') AS BorrowedAt, 
      DATE_FORMAT(L.DueAT, '%Y-%m-%d %H:%i:%s') AS DueAt, 
      F.Amount, 
      F.PaymentStatus AS Status
    FROM FINE AS F
    JOIN LOAN AS L ON F.LoanID = L.LoanID
    JOIN USER AS U ON L.UserID = U.UserID
    JOIN BOOK AS B ON L.ItemID = B.BookID
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error executing fine report query:", err);
      sendJsonResponse(res, 500, {
        success: false,
        error: "Failed to fetch fine report",
      });
      return;
    }

    console.log(`Fine report generated with ${results.length} records`);
    sendJsonResponse(res, 200, { success: true, data: results });
  });
};

module.exports = {
  getDataReport,
  getFineReport,
};
