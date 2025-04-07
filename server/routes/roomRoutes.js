const pool = require("../config/db");
const { parseRequestBody, sendJsonResponse } = require("../utils/requestUtils");

pool.query("SELECT 1", (err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Database connected successfully");
  }
});

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

const addRoom = async (req, res) => {
  try {
    const { RoomNumber, RoomName, Capacity, Notes } = await parseRequestBody(
      req
    );
    console.log("Request body:", { RoomNumber, RoomName, Capacity, Notes }); // Debugging log
    const query = `
      INSERT INTO ROOMS (RoomNumber, RoomName, Capacity, Notes)
      VALUES (?, ?, ?, ?)
    `;
    pool.query(query, [RoomNumber, RoomName, Capacity, Notes], (err) => {
      if (err) {
        console.error("Error adding room:", err); // Debugging log
        sendJsonResponse(res, 500, {
          success: false,
          error: "Failed to add room",
        });
        return;
      }
      sendJsonResponse(res, 200, { success: true });
    });
  } catch (error) {
    console.error("Error in addRoom:", error); // Debugging log
    sendJsonResponse(res, 500, { success: false, error: "Server error" });
  }
};

// Borrow a room
const borrowRoom = async (req, res) => {
  try {
    const { RoomID, UserID, Duration } = await parseRequestBody(req);
    console.log("Borrowing room:", { RoomID, UserID, Duration }); // Debugging log

    // Check if the room is available
    const checkQuery = `
      SELECT * FROM ROOMS WHERE RoomID = ? AND IsAvailable = 1
    `;
    pool.query(checkQuery, [RoomID], (err, results) => {
      console.log("Check query results:", results); // Debugging log
      if (err || results.length === 0) {
        console.error("Room is not available or error occurred:", err);
        sendJsonResponse(res, 400, {
          success: false,
          error: "Room is not available",
        });
        return;
      }

      // Mark the room as reserved
      const reserveQuery = `
        UPDATE ROOMS SET IsAvailable = 0 WHERE RoomID = ?
      `;
      pool.query(reserveQuery, [RoomID], (err) => {
        if (err) {
          console.error("Error reserving room:", err);
          sendJsonResponse(res, 500, {
            success: false,
            error: "Failed to reserve room",
          });
          return;
        }

        // Insert a record into the ROOM_BORROWINGS table
        const borrowQuery = `
          INSERT INTO ROOM_BORROWINGS (RoomID, UserID, StartTime, EndTime)
          VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? HOUR))
        `;
        pool.query(borrowQuery, [RoomID, UserID, Duration], (err) => {
          if (err) {
            console.error("Error creating borrow record:", err);
            sendJsonResponse(res, 500, {
              success: false,
              error: "Failed to borrow room",
            });
            return;
          }

          sendJsonResponse(res, 200, { success: true });
        });
      });
    });
  } catch (error) {
    console.error("Error in borrowRoom:", error);
    sendJsonResponse(res, 500, { success: false, error: "Server error" });
  }
};

// Reserve a room
const reserveRoom = async (req, res) => {
  try {
    // Parse the request body
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      const { RoomID, UserID, Duration } = JSON.parse(body);

      if (!RoomID || !UserID || !Duration) {
        console.error("Missing required fields in request body:", {
          RoomID,
          UserID,
          Duration,
        });
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ success: false, error: "Invalid request body" })
        );
        return;
      }

      console.log("Reserving room:", { RoomID, UserID, Duration });

      // Check if the room is available
      const checkQuery = `
        SELECT * FROM ROOMS WHERE RoomID = ? AND IsAvailable = 1
      `;
      pool.query(checkQuery, [RoomID], (err, results) => {
        console.log("Check query results:", results); // Debugging log
        if (err || results.length === 0) {
          console.error("Room is not available or error occurred:", err);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ success: false, error: "Room is not available" })
          );
          return;
        }

        // Mark the room as reserved
        const reserveQuery = `
          UPDATE ROOMS SET IsAvailable = 0 WHERE RoomID = ?
        `;
        pool.query(reserveQuery, [RoomID], (err) => {
          if (err) {
            console.error("Error reserving room:", err);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                success: false,
                error: "Failed to reserve room",
              })
            );
            return;
          }

          // Insert a record into the ROOM_RESERVATIONS table
          const reservationQuery = `
            INSERT INTO ROOM_RESERVATIONS (RoomID, UserID, StartAT, EndAT)
            VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? MINUTE))
          `;
          pool.query(reservationQuery, [RoomID, UserID, Duration], (err) => {
            if (err) {
              console.error("Error creating reservation record:", err);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  success: false,
                  error: "Failed to reserve room",
                })
              );
              return;
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true }));
          });
        });
      });
    });
  } catch (error) {
    console.error("Error in reserveRoom:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Server error" }));
  }
};

const releaseExpiredReservations = () => {
  const releaseQuery = `
    UPDATE ROOMS
    SET IsAvailable = 1
    WHERE RoomID IN (
      SELECT RoomID
      FROM ROOM_RESERVATIONS
      WHERE EndAT <= NOW()
    )
  `;

  const deleteQuery = `
    DELETE FROM ROOM_RESERVATIONS
    WHERE EndAT <= NOW()
  `;

  pool.query(releaseQuery, (err, results) => {
    if (err) {
      console.error("Error releasing expired reservations:", err);
    } else {
      console.log("Expired reservations released:", results.affectedRows);
    }
  });

  pool.query(deleteQuery, (err, results) => {
    if (err) {
      console.error("Error deleting expired reservations:", err);
    } else {
      console.log("Expired reservations deleted:", results.affectedRows);
    }
  });
};

module.exports = {
  getRooms,
  addRoom,
  borrowRoom,
  reserveRoom,
  releaseExpiredReservations,
};
