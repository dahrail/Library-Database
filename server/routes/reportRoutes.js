const pool = require('../config/db');
const { sendJsonResponse } = require('../utils/requestUtils');

// Get data report
const getDataReport = (req, res) => {
  console.log('Fetching data report');
  
  const query = 'SELECT * FROM USER';

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing data report query:', err);
      sendJsonResponse(res, 500, { success: false, error: 'Failed to fetch data report' });
      return;
    }

    console.log(`Data report generated with ${results.length} records`);
    sendJsonResponse(res, 200, { success: true, data: results });
  });
};

// Get fine report
const getFineReport = (req, res) => {
  console.log('Fetching fine report');
  
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
      console.error('Error executing fine report query:', err);
      sendJsonResponse(res, 500, { success: false, error: 'Failed to fetch fine report' });
      return;
    }

    console.log(`Fine report generated with ${results.length} records`);
    sendJsonResponse(res, 200, { success: true, data: results });
  });
};

module.exports = {
  getDataReport,
  getFineReport
};
