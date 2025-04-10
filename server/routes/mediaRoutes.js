const pool = require("../config/db");
const { sendJsonResponse, parseRequestBody } = require("../utils/requestUtils");

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

const addMedia = async (req, res) => {
  try {
    const mediaData = await parseRequestBody(req); // Correctly parse the request body
    console.log("Adding new media:", mediaData);

    const {
      Type,
      Title,
      Author,
      Genre,
      PublicationYear,
      Language,
      TotalCopies,
      AvailableCopies,
    } = mediaData;

    const query =
      "INSERT INTO MEDIA (Type,Title, Author, Genre, PublicationYear, Language) VALUES (?, ?, ?, ?, ?, ?)";
    pool.query(
      query,
      [Type,Title, Author, Genre, PublicationYear, Language],
      (err, results) => {
        if (err) {
          console.error("Error adding media:", err);
          sendJsonResponse(res, 500, { success: false, error: "Database error" });
          return;
        }

        const MediaID = results.insertId;
        const inventoryQuery =
          "INSERT INTO MEDIA_INVENTORY (MediaID, TotalCopies, AvailableCopies) VALUES (?, ?, ?)";
        pool.query(
          inventoryQuery,
          [MediaID, TotalCopies, AvailableCopies],
          (err) => {
            if (err) {
              console.error("Error updating inventory:", err);
              sendJsonResponse(res, 500, { success: false, error: "Failed to update inventory" });
              return;
            }
            sendJsonResponse(res, 200, { success: true, MediaID });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error in addMedia:", error);
    sendJsonResponse(res, 500, { success: false, error: "Server error" });
  }
};

module.exports = {
  getAllMedia,
  addMedia,
};
