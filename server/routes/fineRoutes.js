const pool = require('../config/db');
const { sendJsonResponse } = require('../utils/requestUtils');

// Get fines for a specific user
const getUserFines = (req, res, userId) => {
  console.log(`Fetching fines for user ID: ${userId}`);
  
  const query = `
    SELECT 
      L.ItemType, 
      B.Title, 
      B.Author, 
      L.BorrowedAt, 
      L.DueAT, 
      F.Amount, 
      F.PaymentStatus AS Status
    FROM LOAN AS L
    JOIN BOOK AS B ON L.ItemID = B.BookID
    JOIN FINE AS F ON L.LoanID = F.LoanID
    WHERE L.UserID = ?
  `;

  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching fines for user:', err);
      sendJsonResponse(res, 500, { success: false, error: 'Failed to fetch fines' });
      return;
    }

    console.log(`Retrieved ${results.length} fines for user ${userId}`);
    sendJsonResponse(res, 200, { success: true, fines: results });
  });
};

module.exports = {
  getUserFines
};
