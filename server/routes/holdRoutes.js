const pool = require('../config/db');
const { parseRequestBody, sendJsonResponse } = require('../utils/requestUtils');

// Get holds for a specific user
const getUserHolds = (req, res, userId) => {
  console.log(`Fetching holds for user ID: ${userId}`);
  
  const query = `
    SELECT 
      U.FirstName, 
      U.LastName, 
      B.Title, 
      B.Author, 
      DATE_FORMAT(CONVERT_TZ(H.RequestAT, '+00:00', @@session.time_zone), '%Y-%m-%dT%H:%i:%sZ') AS RequestAT, 
      H.HoldStatus
    FROM USER AS U
    JOIN HOLD AS H ON U.UserID = H.UserID
    JOIN BOOK AS B ON H.ItemID = B.BookID
    WHERE U.UserID = ? AND H.HoldStatus IN ('Pending', 'Active')
  `;

  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching holds for user:', err);
      sendJsonResponse(res, 500, { success: false, error: 'Failed to fetch holds' });
      return;
    }

    console.log(`Retrieved ${results.length} holds for user ${userId}`);
    sendJsonResponse(res, 200, { success: true, holds: results });
  });
};

// Place a hold
const holdBook = async (req, res) => {
  try {
    const { UserID, BookID } = await parseRequestBody(req);
    console.log(`Placing hold for book ID: ${BookID}, user ID: ${UserID}`);
    
    // Add entry to Hold table
    const holdQuery = `
      INSERT INTO HOLD (UserID, ItemType, ItemID, RequestAt, HoldStatus)
      VALUES (?, 'Book', ?, NOW(), 'Pending')
    `;
    await pool.promise().query(holdQuery, [UserID, BookID]);

    sendJsonResponse(res, 200, { success: true });
  } catch (error) {
    console.error("Error placing hold on book:", error);
    sendJsonResponse(res, 500, { success: false, error: "Internal server error" });
  }
};


// MEDIA SESSION
const holdMedia = async (req, res) => {
  try {
    const { UserID, MediaID } = await parseRequestBody(req);
    console.log(`Placing hold for media ID: ${MediaID}, user ID: ${UserID}`);
    
    // Add entry to Hold table
    const holdQuery = `
      INSERT INTO HOLD (UserID, ItemType, ItemID, RequestAt, HoldStatus)
      VALUES (?, 'Media', ?, NOW(), 'Pending')
    `;
    await pool.promise().query(holdQuery, [UserID, MediaID]);

    sendJsonResponse(res, 200, { success: true });
  } catch (error) {
    console.error("Error placing hold on media:", error);
    sendJsonResponse(res, 500, { success: false, error: "Internal server error" });
  }
};

// DEVICE SESSION
const holdDevice = async (req, res) => {
  try {
    const { UserID, DeviceID } = await parseRequestBody(req);

    // Add entry to Hold table
    const holdQuery = `
      INSERT INTO HOLD (UserID, ItemType, ItemID, RequestAt, HoldStatus)
      VALUES (?, 'Device', ?, NOW(), 'Pending')
    `;
    await pool.promise().query(holdQuery, [UserID, DeviceID]);

    sendJsonResponse(res, 200, { success: true });
  } catch (error) {
    console.error("Error placing hold on device:", error);
    sendJsonResponse(res, 500, { success: false, error: "Internal server error" });
  }
};

module.exports = {
  getUserHolds,
  holdBook,
  holdDevice,
  holdMedia,
};
