const pool = require("../config/db");
const { sendJsonResponse } = require("../utils/requestUtils");

// Get all events
const getAllEvents = (req, res) => {
  console.log("Fetching all events");
  
  // Try an extremely simple approach first - just get the events without any JOINs
  const simpleEventQuery = `
    SELECT 
      EventID, 
      EventName, 
      StartAt,
      EndAt,
      MaxAttendees,
      RoomID,
      UserID
    FROM event
    ORDER BY StartAt ASC
  `;

  // Add this right after the simpleEventQuery to debug database state
  pool.query("SELECT e.EventID, e.RoomID, r.RoomID AS FoundRoomID, r.RoomNumber FROM event e LEFT JOIN room r ON e.RoomID = r.RoomID", (debugErr, debugResults) => {
    if (debugErr) {
      console.error("Debug query error:", debugErr);
    } else {
      console.log("Debug query results:", JSON.stringify(debugResults, null, 2));
    }
  });
  
  pool.query(simpleEventQuery, (err, eventResults) => {
    if (err) {
      console.error("Error fetching basic events:", err);
      return sendJsonResponse(res, 500, { 
        success: false, 
        error: "Failed to fetch events: " + err.message 
      });
    }
    
    if (!eventResults || eventResults.length === 0) {
      console.log("No events found in database");
      return sendJsonResponse(res, 200, { 
        success: true, 
        events: []
      });
    }
    
    console.log(`Found ${eventResults.length} events, enriching with additional data...`);
    
    // After getting events, fetch room info
    const roomQuery = "SELECT RoomID, RoomNumber, RoomName FROM room";
    pool.query(roomQuery, (roomErr, roomResults) => {
      // If room query fails, still return events without room info
      if (roomErr) {
        console.error("Warning: Could not fetch room data:", roomErr);
      } else {
        console.log("Room data retrieved:", roomResults);
      }
      
      // Create room lookup with better type handling
      const roomLookup = {};
      if (roomResults && roomResults.length > 0) {
        console.log("Processing room data...");
        roomResults.forEach(room => {
          // Convert to string to ensure consistency in lookup
          const roomId = String(room.RoomID);
          roomLookup[roomId] = room.RoomNumber || room.RoomName || `Room ${roomId}`;
          console.log(`Added room to lookup: ID ${roomId} -> ${roomLookup[roomId]}`);
        });
      } else {
        console.log("No room data found or empty result set");
      }
      
      // Fetch user info
      const userQuery = "SELECT UserID, FirstName, LastName FROM user";
      pool.query(userQuery, (userErr, userResults) => {
        // If user query fails, still return events without user info
        if (userErr) {
          console.error("Warning: Could not fetch user data:", userErr);
        }
        
        // Create user lookup
        const userLookup = {};
        if (userResults) {
          userResults.forEach(user => {
            userLookup[user.UserID] = {
              FirstName: user.FirstName,
              LastName: user.LastName
            };
          });
        }
        
        // Combine all data
        const enrichedEvents = eventResults.map(event => {
          // Convert to string for lookup to handle type differences
          const roomId = String(event.RoomID);
          console.log(`Looking up room for event ${event.EventID}, RoomID: ${roomId}`);
          const roomNumber = roomLookup[roomId];
          
          if (!roomNumber) {
            console.log(`Room not found for ID ${roomId} (event: ${event.EventName})`);
          }
          
          const user = userLookup[event.UserID] || {};
          
          return {
            ...event,
            RoomNumber: roomNumber || `Room ${event.RoomID}`,
            FirstName: user.FirstName || 'Unknown',
            LastName: user.LastName || 'User',
            Organizer: (user.FirstName && user.LastName) 
              ? `${user.FirstName} ${user.LastName}` 
              : 'Unknown Organizer'
          };
        });
        
        console.log("Successfully enriched events data");
        return sendJsonResponse(res, 200, { 
          success: true, 
          events: enrichedEvents 
        });
      });
    });
  });
};

// Add a new event
const addEvent = async (req, res) => {
  try {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const eventData = JSON.parse(body);
        console.log("Received event data:", eventData);
        
        const { UserID, EventName, RoomID, StartAt, EndAt, MaxAttendees } = eventData;
        
        // Validate required fields
        if (!UserID || !EventName || !RoomID || !StartAt || !EndAt || !MaxAttendees) {
          console.error("Missing required fields:", eventData);
          return sendJsonResponse(res, 400, {
            success: false,
            error: "All fields are required"
          });
        }
        
        // Lowercase 'event' to match your database table name
        const query = `
          INSERT INTO event (UserID, EventName, RoomID, StartAt, EndAt, MaxAttendees)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        pool.query(
          query,
          [UserID, EventName, RoomID, StartAt, EndAt, MaxAttendees],
          (err, results) => {
            if (err) {
              console.error("Error adding event:", err);
              return sendJsonResponse(res, 500, {
                success: false,
                error: "Failed to add event: " + err.message
              });
            }
            
            console.log("Event added successfully, ID:", results.insertId);
            sendJsonResponse(res, 201, {
              success: true,
              eventId: results.insertId,
              message: "Event added successfully"
            });
          }
        );
      } catch (err) {
        console.error("Error parsing request data:", err);
        sendJsonResponse(res, 400, {
          success: false,
          error: "Invalid request data: " + err.message
        });
      }
    });
  } catch (error) {
    console.error("Error in addEvent:", error);
    sendJsonResponse(res, 500, {
      success: false,
      error: "Server error: " + error.message
    });
  }
};

// Register for an event
const registerForEvent = async (req, res) => {
  // This will be implemented later
  sendJsonResponse(res, 200, { 
    success: true, 
    message: "Registration feature coming soon" 
  });
};

module.exports = {
  getAllEvents,
  addEvent,
  registerForEvent
};