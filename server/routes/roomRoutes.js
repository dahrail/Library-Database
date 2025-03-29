const pool = require("../config/db");
const { parseRequestBody, sendJsonResponse } = require("../utils/requestUtils");
const roomRoutes = require("./roomRoutes");

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
    const { RoomID, UserID, Duration } = await parseRequestBody(req);
    console.log("Reserving room:", { RoomID, UserID, Duration });

    const checkQuery = `
      SELECT * FROM ROOMS WHERE RoomID = ? AND IsAvailable = 1
    `;
    pool.query(checkQuery, [RoomID], (err, results) => {
      if (err || results.length === 0) {
        console.error("Room is not available or error occurred:", err);
        sendJsonResponse(res, 400, {
          success: false,
          error: "Room is not available",
        });
        return;
      }

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

        const reservationQuery = `
          INSERT INTO ROOM_RESERVATIONS (RoomID, UserID, StartTime, EndTime)
          VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL ? MINUTE))
        `;
        pool.query(reservationQuery, [RoomID, UserID, Duration], (err) => {
          if (err) {
            console.error("Error creating reservation record:", err);
            sendJsonResponse(res, 500, {
              success: false,
              error: "Failed to reserve room",
            });
            return;
          }

          setTimeout(() => {
            const releaseQuery = `
              UPDATE ROOMS SET IsAvailable = 1 WHERE RoomID = ?
            `;
            pool.query(releaseQuery, [RoomID], (err) => {
              if (err) {
                console.error("Error releasing room:", err);
              } else {
                console.log(`Room ${RoomID} is now available.`);
              }
            });
          }, Duration * 60 * 1000);

          sendJsonResponse(res, 200, { success: true });
        });
      });
    });
  } catch (error) {
    console.error("Error in reserveRoom:", error);
    sendJsonResponse(res, 500, { success: false, error: "Server error" });
  }
};

// Handle reserve room
const handleReserveRoom = async (RoomID) => {
  try {
    const duration = userData?.Role === "Faculty" ? 180 : 90; // Faculty: 3 hours, Others: 1.5 hours
    console.log("Reserving room with data:", {
      RoomID,
      UserID: userData.UserID,
      Duration: duration,
    });
    const response = await fetch("/api/reserveRoom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        RoomID,
        UserID: userData.UserID,
        Duration: duration,
      }),
    });
    const data = await response.json();
    console.log("Response data:", data); // Debugging log
    if (data.success) {
      alert("Room reserved successfully!");

      // Refresh the room list
      const updatedRooms = await fetch("/api/rooms").then((res) => res.json());
      setRooms(updatedRooms.rooms);
    } else {
      alert("Failed to reserve room: " + data.error);
    }
  } catch (error) {
    console.error("Error reserving room:", error);
    alert("An error occurred while reserving the room.");
  }
};

// Update the button to call handleReserveRoom with the specific RoomID
{
  rooms.map((room) => (
    <div key={room.RoomID}>
      <p>
        {room.RoomName} (Capacity: {room.Capacity})
      </p>
      <p>Status: {room.IsAvailable ? "Available" : "Reserved"}</p>
      {room.IsAvailable && (
        <button onClick={() => handleReserveRoom(room.RoomID)}>
          Reserve Room
        </button>
      )}
    </div>
  ));
}

module.exports = { getRooms, addRoom, reserveRoom };
