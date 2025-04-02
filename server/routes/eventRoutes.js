const pool = require("../config/db");
const { sendJsonResponse } = require("../utils/requestUtils");

// Get all events
const getAllEvents = (req, res) => {
  console.log("Fetching all events");
  
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
    
    const roomQuery = "SELECT RoomID, RoomNumber, RoomName FROM room";
    pool.query(roomQuery, (roomErr, roomResults) => {
      if (roomErr) {
        console.error("Warning: Could not fetch room data:", roomErr);
      }
      
      const roomLookup = {};
      if (roomResults && roomResults.length > 0) {
        roomResults.forEach(room => {
          const roomId = String(room.RoomID);
          roomLookup[roomId] = room.RoomNumber || room.RoomName || `Room ${roomId}`;
        });
      }
      
      const userQuery = "SELECT UserID, FirstName, LastName FROM user";
      pool.query(userQuery, (userErr, userResults) => {
        if (userErr) {
          console.error("Warning: Could not fetch user data:", userErr);
        }
        
        const userLookup = {};
        if (userResults) {
          userResults.forEach(user => {
            userLookup[user.UserID] = {
              FirstName: user.FirstName,
              LastName: user.LastName
            };
          });
        }
        
        const enrichedEvents = eventResults.map(event => {
          const roomId = String(event.RoomID);
          const roomNumber = roomLookup[roomId];
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
        
        return sendJsonResponse(res, 200, { 
          success: true, 
          events: enrichedEvents 
        });
      });
    });
  });
};

// Get single event by ID
const getEventById = (req, res) => {
  const eventId = req.params.id;
  if (!eventId) {
    return sendJsonResponse(res, 400, { success: false, error: "Event ID is required" });
  }
  
  const query = `
    SELECT 
      e.EventID, 
      e.EventName, 
      e.StartAt,
      e.EndAt,
      e.MaxAttendees,
      e.RoomID,
      e.UserID,
      r.RoomNumber,
      r.RoomName
    FROM event e
    LEFT JOIN room r ON e.RoomID = r.RoomID
    WHERE e.EventID = ?
  `;
  
  pool.query(query, [eventId], (err, results) => {
    if (err) {
      console.error("Error fetching event:", err);
      return sendJsonResponse(res, 500, { success: false, error: "Failed to fetch event" });
    }
    
    if (results.length === 0) {
      return sendJsonResponse(res, 404, { success: false, error: "Event not found" });
    }
    
    sendJsonResponse(res, 200, { success: true, event: results[0] });
  });
};

// Get event attendees with improved stats
const getEventAttendees = (req, res) => {
  const eventId = req.params.id;
  if (!eventId) {
    return sendJsonResponse(res, 400, { success: false, error: "Event ID is required" });
  }
  
  const attendeeQuery = `
    SELECT 
      ea.EventID,
      ea.UserID,
      ea.CheckedIn,
      ea.CheckInTime,
      u.FirstName,
      u.LastName,
      u.Email
    FROM event_attendee ea
    JOIN user u ON ea.UserID = u.UserID
    WHERE ea.EventID = ?
    ORDER BY ea.CheckedIn DESC, u.LastName, u.FirstName
  `;
  
  const statsQuery = `
    SELECT 
      COUNT(*) as TotalRegistered,
      SUM(CASE WHEN CheckedIn = 1 THEN 1 ELSE 0 END) as TotalCheckedIn
    FROM event_attendee
    WHERE EventID = ?
  `;
  
  pool.query(attendeeQuery, [eventId], (err, attendees) => {
    if (err) {
      console.error("Error fetching attendees:", err);
      return sendJsonResponse(res, 500, { success: false, error: "Failed to fetch attendees" });
    }
    
    pool.query(statsQuery, [eventId], (err, stats) => {
      if (err) {
        console.error("Error fetching attendance stats:", err);
        return sendJsonResponse(res, 500, { success: false, error: "Failed to fetch attendance stats" });
      }
      
      const attendanceStats = stats[0] || { TotalRegistered: 0, TotalCheckedIn: 0 };
      
      // Calculate percentage
      if (attendanceStats.TotalRegistered > 0) {
        attendanceStats.AttendanceRate = Math.round((attendanceStats.TotalCheckedIn / attendanceStats.TotalRegistered) * 100);
      } else {
        attendanceStats.AttendanceRate = 0;
      }
      
      sendJsonResponse(res, 200, { 
        success: true, 
        attendees: attendees, 
        stats: attendanceStats 
      });
    });
  });
};

// Get user's registered events
const getUserRegistrations = (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return sendJsonResponse(res, 400, { success: false, error: "User ID is required" });
  }
  
  const query = `
    SELECT 
      EventID,
      UserID,
      CheckedIn
    FROM event_attendee
    WHERE UserID = ?
  `;
  
  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user registrations:", err);
      return sendJsonResponse(res, 500, { success: false, error: "Failed to fetch registrations" });
    }
    
    sendJsonResponse(res, 200, { success: true, registrations: results });
  });
};

// Get attendance stats for events - improved to include percentages
const getAttendanceStats = (req, res) => {
  const eventIds = req.query.eventIds;
  
  if (!eventIds) {
    return sendJsonResponse(res, 400, { success: false, error: "Event IDs are required" });
  }
  
  const eventIdArray = eventIds.split(',');
  
  const query = `
    SELECT 
      e.EventID,
      COUNT(ea.UserID) as RegisteredCount,
      SUM(CASE WHEN ea.CheckedIn = 1 THEN 1 ELSE 0 END) as CheckedInCount
    FROM event e
    LEFT JOIN event_attendee ea ON e.EventID = ea.EventID
    WHERE e.EventID IN (?)
    GROUP BY e.EventID
  `;
  
  pool.query(query, [eventIdArray], (err, results) => {
    if (err) {
      console.error("Error fetching attendance stats:", err);
      return sendJsonResponse(res, 500, { success: false, error: "Failed to fetch stats" });
    }
    
    const completeStats = eventIdArray.map(id => {
      const existingStat = results.find(stat => stat.EventID == id);
      
      if (existingStat) {
        // Add attendance percentage
        if (existingStat.RegisteredCount > 0) {
          existingStat.AttendanceRate = Math.round((existingStat.CheckedInCount / existingStat.RegisteredCount) * 100);
        } else {
          existingStat.AttendanceRate = 0;
        }
        return existingStat;
      }
      
      return {
        EventID: id,
        RegisteredCount: 0,
        CheckedInCount: 0,
        AttendanceRate: 0
      };
    });
    
    sendJsonResponse(res, 200, { success: true, stats: completeStats });
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
        
        if (!UserID || !EventName || !RoomID || !StartAt || !EndAt || !MaxAttendees) {
          console.error("Missing required fields:", eventData);
          return sendJsonResponse(res, 400, {
            success: false,
            error: "All fields are required"
          });
        }
        
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
          error: "Invalid request data"
        });
      }
    });
  } catch (error) {
    console.error("Error in addEvent:", error);
    sendJsonResponse(res, 500, {
      success: false,
      error: "Server error"
    });
  }
};

// Register for an event
const registerForEvent = async (req, res) => {
  try {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const { UserID, EventID } = JSON.parse(body);
        
        if (!UserID || !EventID) {
          return sendJsonResponse(res, 400, {
            success: false,
            error: "User ID and Event ID are required"
          });
        }
        
        const checkQuery = `
          SELECT * FROM event_attendee
          WHERE UserID = ? AND EventID = ?
        `;
        
        pool.query(checkQuery, [UserID, EventID], (err, results) => {
          if (err) {
            console.error("Error checking registration:", err);
            return sendJsonResponse(res, 500, {
              success: false,
              error: "Failed to check existing registration"
            });
          }
          
          if (results.length > 0) {
            return sendJsonResponse(res, 400, {
              success: false,
              error: "You are already registered for this event"
            });
          }
          
          const capacityQuery = `
            SELECT 
              e.MaxAttendees,
              COUNT(ea.UserID) as CurrentRegistrations
            FROM event e
            LEFT JOIN event_attendee ea ON e.EventID = ea.EventID
            WHERE e.EventID = ?
            GROUP BY e.EventID
          `;
          
          pool.query(capacityQuery, [EventID], (err, results) => {
            if (err) {
              console.error("Error checking event capacity:", err);
              return sendJsonResponse(res, 500, {
                success: false,
                error: "Failed to check event capacity"
              });
            }
            
            const { MaxAttendees, CurrentRegistrations } = results[0];
            
            if (CurrentRegistrations >= MaxAttendees) {
              return sendJsonResponse(res, 400, {
                success: false,
                error: "This event has reached its maximum capacity"
              });
            }
            
            const registerQuery = `
              INSERT INTO event_attendee (EventID, UserID, CheckedIn)
              VALUES (?, ?, 0)
            `;
            
            pool.query(registerQuery, [EventID, UserID], (err, result) => {
              if (err) {
                console.error("Error registering for event:", err);
                return sendJsonResponse(res, 500, {
                  success: false,
                  error: "Failed to register for event"
                });
              }
              
              sendJsonResponse(res, 201, {
                success: true,
                message: "Successfully registered for event"
              });
            });
          });
        });
      } catch (err) {
        console.error("Error parsing request data:", err);
        sendJsonResponse(res, 400, {
          success: false,
          error: "Invalid request data"
        });
      }
    });
  } catch (error) {
    console.error("Error in registerForEvent:", error);
    sendJsonResponse(res, 500, {
      success: false,
      error: "Server error"
    });
  }
};

// User self check-in to an event - updated with timestamps
const checkInToEvent = async (req, res) => {
  try {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const { UserID, EventID, CheckInTime } = JSON.parse(body);
        
        if (!UserID || !EventID) {
          return sendJsonResponse(res, 400, {
            success: false,
            error: "User ID and Event ID are required"
          });
        }
        
        const checkQuery = `
          SELECT * FROM event_attendee
          WHERE UserID = ? AND EventID = ?
        `;
        
        pool.query(checkQuery, [UserID, EventID], (err, results) => {
          if (err) {
            console.error("Error checking registration:", err);
            return sendJsonResponse(res, 500, {
              success: false,
              error: "Failed to check registration"
            });
          }
          
          if (results.length === 0) {
            return sendJsonResponse(res, 400, {
              success: false,
              error: "You are not registered for this event"
            });
          }
          
          if (results[0].CheckedIn) {
            return sendJsonResponse(res, 400, {
              success: false,
              error: "You have already checked in to this event"
            });
          }
          
          const eventQuery = `
            SELECT * FROM event
            WHERE EventID = ? AND NOW() BETWEEN StartAt AND EndAt
          `;
          
          pool.query(eventQuery, [EventID], (err, results) => {
            if (err) {
              console.error("Error checking event timing:", err);
              return sendJsonResponse(res, 500, {
                success: false,
                error: "Failed to check event timing"
              });
            }
            
            if (results.length === 0) {
              return sendJsonResponse(res, 400, {
                success: false,
                error: "You can only check in during the event"
              });
            }
            
            // Use the provided check-in time or default to server time
            const timestamp = CheckInTime || new Date().toISOString();
            
            const checkInQuery = `
              UPDATE event_attendee
              SET CheckedIn = 1, CheckInTime = ?
              WHERE UserID = ? AND EventID = ?
            `;
            
            pool.query(checkInQuery, [timestamp, UserID, EventID], (err, result) => {
              if (err) {
                console.error("Error checking in:", err);
                return sendJsonResponse(res, 500, {
                  success: false,
                  error: "Failed to check in to event"
                });
              }
              
              // Get updated attendance stats
              const statsQuery = `
                SELECT 
                  COUNT(*) as TotalRegistered,
                  SUM(CASE WHEN CheckedIn = 1 THEN 1 ELSE 0 END) as TotalCheckedIn
                FROM event_attendee
                WHERE EventID = ?
              `;
              
              pool.query(statsQuery, [EventID], (statsErr, statsResults) => {
                const stats = statsErr ? null : statsResults[0];
                
                sendJsonResponse(res, 200, {
                  success: true,
                  message: "Successfully checked in to event",
                  stats: stats
                });
              });
            });
          });
        });
      } catch (err) {
        console.error("Error parsing request data:", err);
        sendJsonResponse(res, 400, {
          success: false,
          error: "Invalid request data"
        });
      }
    });
  } catch (error) {
    console.error("Error in checkInToEvent:", error);
    sendJsonResponse(res, 500, {
      success: false,
      error: "Server error"
    });
  }
};

// Admin check-in for a user - updated with timestamps
const adminCheckIn = async (req, res) => {
  try {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const { UserID, EventID, AdminID, CheckInTime } = JSON.parse(body);
        
        if (!UserID || !EventID || !AdminID) {
          return sendJsonResponse(res, 400, {
            success: false,
            error: "User ID, Event ID, and Admin ID are required"
          });
        }
        
        const adminQuery = `
          SELECT Role FROM user WHERE UserID = ? AND (Role = 'Admin' OR Role = 'Faculty')
        `;
        
        pool.query(adminQuery, [AdminID], (err, results) => {
          if (err) {
            console.error("Error checking admin permissions:", err);
            return sendJsonResponse(res, 500, {
              success: false,
              error: "Failed to verify admin permissions"
            });
          }
          
          if (results.length === 0) {
            return sendJsonResponse(res, 403, {
              success: false,
              error: "You don't have permission to check in users"
            });
          }
          
          const checkQuery = `
            SELECT * FROM event_attendee
            WHERE UserID = ? AND EventID = ?
          `;
          
          pool.query(checkQuery, [UserID, EventID], (err, results) => {
            if (err) {
              console.error("Error checking registration:", err);
              return sendJsonResponse(res, 500, {
                success: false,
                error: "Failed to check registration"
              });
            }
            
            if (results.length === 0) {
              return sendJsonResponse(res, 400, {
                success: false,
                error: "User is not registered for this event"
              });
            }
            
            if (results[0].CheckedIn) {
              return sendJsonResponse(res, 400, {
                success: false,
                error: "User has already checked in to this event"
              });
            }
            
            // Use the provided check-in time or default to server time
            const timestamp = CheckInTime || new Date().toISOString();
            
            const checkInQuery = `
              UPDATE event_attendee
              SET CheckedIn = 1, CheckInTime = ?
              WHERE UserID = ? AND EventID = ?
            `;
            
            pool.query(checkInQuery, [timestamp, UserID, EventID], (err, result) => {
              if (err) {
                console.error("Error checking in user:", err);
                return sendJsonResponse(res, 500, {
                  success: false,
                  error: "Failed to check in user"
                });
              }
              
              // Get updated attendance stats
              const statsQuery = `
                SELECT 
                  COUNT(*) as TotalRegistered,
                  SUM(CASE WHEN CheckedIn = 1 THEN 1 ELSE 0 END) as TotalCheckedIn
                FROM event_attendee
                WHERE EventID = ?
              `;
              
              pool.query(statsQuery, [EventID], (statsErr, statsResults) => {
                const stats = statsErr ? null : statsResults[0];
                
                sendJsonResponse(res, 200, {
                  success: true,
                  message: "Successfully checked in user",
                  stats: stats
                });
              });
            });
          });
        });
      } catch (err) {
        console.error("Error parsing request data:", err);
        sendJsonResponse(res, 400, {
          success: false,
          error: "Invalid request data"
        });
      }
    });
  } catch (error) {
    console.error("Error in adminCheckIn:", error);
    sendJsonResponse(res, 500, {
      success: false,
      error: "Server error"
    });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  getEventAttendees,
  getUserRegistrations,
  getAttendanceStats,
  addEvent,
  registerForEvent,
  checkInToEvent,
  adminCheckIn
};