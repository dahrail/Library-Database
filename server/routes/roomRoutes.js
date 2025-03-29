const pool = require("../config/db");
const { parseRequestBody, sendJsonResponse } = require("../utils/requestUtils");
const roomRoutes = require("./roomRoutes");

// Fetch all rooms
const getRooms = (req, res) => {
  pool.query("SELECT * FROM ROOMS", (err, results) => {
    if (err) {
      console.error("Error fetching rooms:", err);
      sendJsonResponse(res, 500, {
        success: false,
        error: "Failed to fetch rooms",
      });
      return;
    }
    sendJsonResponse(res, 200, { success: true, rooms: results });
  });
};

module.exports = { getRooms };
