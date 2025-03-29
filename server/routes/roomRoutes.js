const pool = require("../config/db");
const { parseRequestBody, sendJsonResponse } = require("../utils/requestUtils");

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

// Add a new room
const addRoom = async (req, res) => {
  try {
    const { RoomNumber, RoomName, Capacity, Notes } = await parseRequestBody(
      req
    );
    const query = `
      INSERT INTO ROOMS (RoomNumber, RoomName, Capacity, Notes)
      VALUES (?, ?, ?, ?)
    `;
    pool.query(query, [RoomNumber, RoomName, Capacity, Notes], (err) => {
      if (err) {
        console.error("Error adding room:", err);
        sendJsonResponse(res, 500, {
          success: false,
          error: "Failed to add room",
        });
        return;
      }
      sendJsonResponse(res, 200, { success: true });
    });
  } catch (error) {
    console.error("Error in addRoom:", error);
    sendJsonResponse(res, 500, { success: false, error: "Server error" });
  }
};

// Book a room
const bookRoom = async (req, res) => {
  try {
    const { RoomID, UserID, Duration } = await parseRequestBody(req);
    const query = `
      INSERT INTO ROOM_BOOKINGS (RoomID, UserID, StartTime, EndTime)
      VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? HOUR))
    `;
    pool.query(query, [RoomID, UserID, Duration], (err) => {
      if (err) {
        console.error("Error booking room:", err);
        sendJsonResponse(res, 500, {
          success: false,
          error: "Failed to book room",
        });
        return;
      }
      sendJsonResponse(res, 200, { success: true });
    });
  } catch (error) {
    console.error("Error in bookRoom:", error);
    sendJsonResponse(res, 500, { success: false, error: "Server error" });
  }
};

module.exports = { getRooms, addRoom, bookRoom };
