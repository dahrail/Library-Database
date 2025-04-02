const pool = require('../config/db');
const { parseRequestBody, sendJsonResponse } = require('../utils/requestUtils');

// Get holds for a specific user
const getUserHolds = (req, res, userId) => {
  console.log(`Fetching holds for user ID: ${userId}`);
  
  const query = `
    SELECT 
      U.FirstName, 
      U.LastName, 
      CASE 
        WHEN H.ItemType = 'Book' THEN B.Title
        WHEN H.ItemType = 'Media' THEN M.Title
        ELSE 'Unknown'
      END AS Title,
      CASE 
        WHEN H.ItemType = 'Book' THEN B.Author
        WHEN H.ItemType = 'Media' THEN M.Author
        ELSE 'Unknown'
      END AS Author,
      DATE_FORMAT(CONVERT_TZ(H.RequestAT, '+00:00', @@session.time_zone), '%Y-%m-%dT%H:%i:%sZ') AS RequestAT, 
      H.HoldStatus,
      H.ItemType
    FROM USER AS U
    JOIN HOLD AS H ON U.UserID = H.UserID
    LEFT JOIN BOOK AS B ON H.ItemID = B.BookID AND H.ItemType = 'Book'
    LEFT JOIN MEDIA AS M ON H.ItemID = M.MediaID AND H.ItemType = 'Media'
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
const confirmHold = async (req, res) => {
  try {
    const { UserID, ItemType, ItemID } = await parseRequestBody(req);
    console.log(`Placing hold for item ID: ${ItemID}, user ID: ${UserID}, item type: ${ItemType}`);
    
    const query = `
      INSERT INTO HOLD (UserID, ItemType, ItemID, RequestAT, HoldStatus)
      VALUES (?, ?, ?, NOW(), 'Pending')
    `;

    pool.query(query, [UserID, ItemType, ItemID], (err, results) => {
      if (err) {
        console.error('Error inserting hold:', err);
        sendJsonResponse(res, 500, { success: false, error: 'Failed to place hold' });
        return;
      }
      
      console.log('Hold placed successfully for item ID:', ItemID);
      sendJsonResponse(res, 200, { success: true });
    });
  } catch (error) {
    console.error('Error in confirmHold:', error);
    sendJsonResponse(res, 500, { success: false, error: "Server error" });
  }
};

module.exports = {
  getUserHolds,
  confirmHold
};
