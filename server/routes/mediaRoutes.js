const pool = require("../config/db");
const { sendJsonResponse } = require("../utils/requestUtils");

// Get all media items with inventory information
const getAllMedia = (req, res) => {
  console.log("Fetching all media items");

  const query = `
    SELECT 
      M.MediaID, 
      M.Title, 
      M.Author, 
      M.Genre, 
      M.PublicationYear,
      M.Type,  
      I.TotalCopies, 
      I.AvailableCopies
    FROM MEDIA AS M
    JOIN MEDIA_INVENTORY AS I ON M.MediaID = I.MediaID
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error executing media query:", err);
      sendJsonResponse(res, 500, { success: false, error: "Internal server error" });
      return;
    }

    console.log(`Sending ${results.length} media items to frontend`);
    sendJsonResponse(res, 200, { success: true, media: results });
  });
};

module.exports = {
  getAllMedia,
};
