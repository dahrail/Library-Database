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

// Register for an event - completely rewritten to ensure no RegistrationDate references
const registerForEvent = async (req, res) => {
  try {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const registrationData = JSON.parse(body);
        console.log("Received registration data:", registrationData);
        
        const { UserID, EventID } = registrationData;
        
        // Validate required fields
        if (!UserID || !EventID) {
          console.error("Missing required fields:", registrationData);
          return sendJsonResponse(res, 400, {
            success: false,
            error: "UserID and EventID are required"
          });
        }
        
        // First check if the user is already registered for this event
        const checkQuery = "SELECT * FROM event_attendee WHERE UserID = ? AND EventID = ?";
        
        pool.query(checkQuery, [UserID, EventID], (checkErr, checkResults) => {
          if (checkErr) {
            console.error("Error checking existing registration:", checkErr);
            return sendJsonResponse(res, 500, {
              success: false,
              error: "Database error while checking registration"
            });
          }
          
          if (checkResults && checkResults.length > 0) {
            return sendJsonResponse(res, 409, {
              success: false,
              error: "You are already registered for this event"
            });
          }
          
          // Check if event has reached maximum attendees
          const eventQuery = `
            SELECT e.MaxAttendees, COUNT(ea.EventAttendeeID) as CurrentAttendees
            FROM event e
            LEFT JOIN event_attendee ea ON e.EventID = ea.EventID
            WHERE e.EventID = ?
            GROUP BY e.EventID, e.MaxAttendees
          `;
          
          pool.query(eventQuery, [EventID], (eventErr, eventResults) => {
            if (eventErr) {
              console.error("Error checking event capacity:", eventErr);
              return sendJsonResponse(res, 500, {
                success: false,
                error: "Database error while checking event capacity"
              });
            }
            
            if (!eventResults || eventResults.length === 0) {
              return sendJsonResponse(res, 404, {
                success: false,
                error: "Event not found"
              });
            }
            
            const { MaxAttendees, CurrentAttendees } = eventResults[0];
            
            if (CurrentAttendees >= MaxAttendees) {
              return sendJsonResponse(res, 409, {
                success: false,
                error: "This event has reached maximum capacity"
              });
            }
            
            // Very explicit query with only the exact columns that exist in the table
            // No string interpolation, no variables in the SQL, just direct hard-coded column names
            const finalQuery = "INSERT INTO event_attendee (UserID, EventID, CheckedIn) VALUES (?, ?, 0)";
            
            console.log("Final SQL query to execute:", finalQuery);
            console.log("With parameter values:", [UserID, EventID]);
            
            pool.query(finalQuery, [UserID, EventID], (insertErr, insertResults) => {
              if (insertErr) {
                console.error("Error registering for event:", insertErr);
                console.error("SQL Error details:", insertErr.sqlMessage);
                console.error("SQL State:", insertErr.sqlState);
                console.error("SQL Query:", insertErr.sql);
                
                return sendJsonResponse(res, 500, {
                  success: false,
                  error: "Failed to register for event: " + insertErr.message
                });
              }
              
              console.log("Registration successful, ID:", insertResults.insertId);
              sendJsonResponse(res, 201, {
                success: true,
                registrationId: insertResults.insertId,
                message: "Successfully registered for event"
              });
            });
          });
        });
        
      } catch (err) {
        console.error("Error parsing request data:", err);
        sendJsonResponse(res, 400, {
          success: false,
          error: "Invalid request data: " + err.message
        });
      }
    });
  } catch (error) {
    console.error("Error in registerForEvent:", error);
    sendJsonResponse(res, 500, {
      success: false,
      error: "Server error: " + error.message
    });
  }
};

// Fix getEventAttendees to handle eventId parameter correctly
const getEventAttendees = (req, res, eventId) => {
  // If eventId was passed directly as parameter, use it, otherwise try to get from req.params
  const id = eventId || (req.params ? req.params.eventId : null);
  
  if (!id) {
    console.error("Missing event ID in getEventAttendees");
    return sendJsonResponse(res, 400, {
      success: false,
      error: "Event ID is required"
    });
  }
  
  console.log("Getting attendees for event ID:", id);
  
  // Updated query to remove references to the non-existent RegistrationDate column
  const query = `
    SELECT ea.EventAttendeeID, ea.UserID, ea.CheckedIn,
           u.FirstName, u.LastName, u.Email
    FROM event_attendee ea
    JOIN user u ON ea.UserID = u.UserID
    WHERE ea.EventID = ?
    ORDER BY ea.EventAttendeeID ASC
  `;
  
  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching event attendees:", err);
      return sendJsonResponse(res, 500, {
        success: false,
        error: "Failed to fetch attendees: " + err.message
      });
    }
    
    console.log(`Found ${results ? results.length : 0} attendees for event ${id}`);
    
    sendJsonResponse(res, 200, {
      success: true,
      attendees: results || []
    });
  });
};

// Fix checkInForEvent to properly validate inputs and handle errors
const checkInForEvent = async (req, res) => {
  try {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const checkInData = JSON.parse(body);
        console.log("Received check-in data:", checkInData);
        
        const { UserID, EventID } = checkInData;
        
        if (!UserID || !EventID) {
          console.error("Missing required fields for check-in:", checkInData);
          return sendJsonResponse(res, 400, {
            success: false,
            error: "UserID and EventID are required"
          });
        }
        
        // First check if the user is registered for this event
        const checkQuery = "SELECT * FROM event_attendee WHERE UserID = ? AND EventID = ?";
        console.log(`Checking registration for UserID=${UserID}, EventID=${EventID}`);
        
        pool.query(checkQuery, [UserID, EventID], (checkErr, checkResults) => {
          if (checkErr) {
            console.error("Error checking registration for check-in:", checkErr);
            return sendJsonResponse(res, 500, {
              success: false,
              error: "Database error while checking registration"
            });
          }
          
          if (!checkResults || checkResults.length === 0) {
            console.log(`User ${UserID} not registered for event ${EventID}`);
            return sendJsonResponse(res, 404, {
              success: false,
              error: "You need to register for this event before checking in"
            });
          }
          
          console.log("Registration found:", checkResults[0]);
          
          // Check if already checked in
          if (checkResults[0].CheckedIn === 1) {
            console.log(`User ${UserID} already checked in for event ${EventID}`);
            return sendJsonResponse(res, 409, {
              success: false,
              error: "You have already checked in for this event"
            });
          }
          
          // Update the check-in status
          const updateQuery = `
            UPDATE event_attendee 
            SET CheckedIn = 1 
            WHERE UserID = ? AND EventID = ?
          `;
          
          console.log(`Executing update query: ${updateQuery} with params [${UserID}, ${EventID}]`);
          
          pool.query(updateQuery, [UserID, EventID], (updateErr, updateResults) => {
            if (updateErr) {
              console.error("Error updating check-in status:", updateErr);
              return sendJsonResponse(res, 500, {
                success: false,
                error: "Failed to check in: " + updateErr.message
              });
            }
            
            console.log("Update results:", JSON.stringify(updateResults));
            
            if (updateResults.affectedRows === 0) {
              console.error(`No rows affected when updating check-in for UserID=${UserID}, EventID=${EventID}`);
              return sendJsonResponse(res, 404, {
                success: false,
                error: "Failed to update check-in status"
              });
            }
            
            console.log(`Check-in successful: User ${UserID} at event ${EventID}`);
            sendJsonResponse(res, 200, {
              success: true,
              message: "Successfully checked in to event"
            });
          });
        });
        
      } catch (err) {
        console.error("Error parsing check-in data:", err);
        sendJsonResponse(res, 400, {
          success: false,
          error: "Invalid request data: " + err.message
        });
      }
    });
  } catch (error) {
    console.error("Error in checkInForEvent:", error);
    sendJsonResponse(res, 500, {
      success: false,
      error: "Server error: " + error.message
    });
  }
};

// Fix the getEventAttendeeCount function to correctly handle parameters
const getEventAttendeeCount = (req, res, eventId) => {
  // If eventId was passed directly as parameter, use it, otherwise try to get from req.params
  const id = eventId || (req.params ? req.params.eventId : null);
  
  if (!id) {
    console.error("Missing event ID in getEventAttendeeCount");
    return sendJsonResponse(res, 400, {
      success: false,
      error: "Event ID is required"
    });
  }
  
  console.log("Getting attendee count for event ID:", id);
  
  const query = `
    SELECT 
      COUNT(CASE WHEN CheckedIn = 1 THEN 1 END) as CheckedInCount,
      COUNT(*) as TotalRegistrations
    FROM event_attendee
    WHERE EventID = ?
  `;
  
  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching event attendee count:", err);
      return sendJsonResponse(res, 500, {
        success: false,
        error: "Failed to fetch attendee count: " + err.message
      });
    }
    
    const counts = results[0] || { CheckedInCount: 0, TotalRegistrations: 0 };
    console.log(`Attendee counts for event ${id}:`, counts);
    
    sendJsonResponse(res, 200, {
      success: true,
      ...counts
    });
  });
};

// Fix the deleteEvent function to properly delete an event
const deleteEvent = async (req, res, eventId) => {
  // If eventId was passed directly as parameter, use it, otherwise try to get from req.params
  const id = eventId || (req.params ? req.params.eventId : null);
  
  if (!id) {
    console.error("Missing event ID in deleteEvent");
    return sendJsonResponse(res, 400, {
      success: false,
      error: "Event ID is required"
    });
  }
  
  console.log("Deleting event ID:", id);
  
  try {
    // Check if event exists first
    const checkQuery = "SELECT EventID FROM event WHERE EventID = ?";
    
    pool.query(checkQuery, [id], (checkErr, checkResults) => {
      if (checkErr) {
        console.error("Error checking event existence:", checkErr);
        return sendJsonResponse(res, 500, {
          success: false,
          error: "Database error while checking event: " + checkErr.message
        });
      }
      
      if (!checkResults || checkResults.length === 0) {
        console.log(`Event ${id} not found for deletion`);
        return sendJsonResponse(res, 404, {
          success: false,
          error: "Event not found"
        });
      }
      
      // Delete the event (attendees will be deleted automatically due to CASCADE)
      const deleteQuery = "DELETE FROM event WHERE EventID = ?";
      
      pool.query(deleteQuery, [id], (deleteErr, deleteResults) => {
        if (deleteErr) {
          console.error("Error deleting event:", deleteErr);
          return sendJsonResponse(res, 500, {
            success: false,
            error: "Failed to delete event: " + deleteErr.message
          });
        }
        
        console.log(`Event ${id} deleted successfully`);
        sendJsonResponse(res, 200, {
          success: true,
          message: "Event deleted successfully"
        });
      });
    });
  } catch (error) {
    console.error("Error in deleteEvent:", error);
    sendJsonResponse(res, 500, {
      success: false,
      error: "Server error: " + error.message
    });
  }
};

// Fix the updateEvent function to properly handle parameters
const updateEvent = async (req, res, eventId) => {
  // If eventId was passed directly as parameter, use it, otherwise try to get from req.params
  const id = eventId || (req.params ? req.params.eventId : null);
  
  if (!id) {
    console.error("Missing event ID in updateEvent");
    return sendJsonResponse(res, 400, {
      success: false,
      error: "Event ID is required"
    });
  }
  
  console.log("Updating event ID:", id);
  
  try {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const eventData = JSON.parse(body);
        console.log("Received update data for event:", eventData);
        
        // Check if event exists
        const checkQuery = "SELECT EventID FROM event WHERE EventID = ?";
        
        pool.query(checkQuery, [id], (checkErr, checkResults) => {
          if (checkErr) {
            console.error("Error checking event existence for update:", checkErr);
            return sendJsonResponse(res, 500, {
              success: false,
              error: "Database error while checking event: " + checkErr.message
            });
          }
          
          if (!checkResults || checkResults.length === 0) {
            console.log(`Event ${id} not found for update`);
            return sendJsonResponse(res, 404, {
              success: false,
              error: "Event not found"
            });
          }
          
          // Event exists, proceed with update
          const query = `
            UPDATE event 
            SET EventName = ?, RoomID = ?, StartAt = ?, EndAt = ?, 
                MaxAttendees = ?, Category = ?, Description = ?
            WHERE EventID = ?
          `;
          
          pool.query(
            query,
            [
              eventData.EventName, 
              eventData.RoomID, 
              eventData.StartAt, 
              eventData.EndAt, 
              eventData.MaxAttendees,
              eventData.Category || null,
              eventData.Description || null,
              id
            ],
            (updateErr, updateResults) => {
              if (updateErr) {
                console.error("Error updating event:", updateErr);
                return sendJsonResponse(res, 500, {
                  success: false,
                  error: "Failed to update event: " + updateErr.message
                });
              }
              
              console.log(`Event ${id} updated successfully`);
              sendJsonResponse(res, 200, {
                success: true,
                message: "Event updated successfully"
              });
            }
          );
        });
      } catch (err) {
        console.error("Error parsing update data:", err);
        sendJsonResponse(res, 400, {
          success: false,
          error: "Invalid request data: " + err.message
        });
      }
    });
  } catch (error) {
    console.error("Error in updateEvent:", error);
    sendJsonResponse(res, 500, {
      success: false,
      error: "Server error: " + error.message
    });
  }
};

module.exports = {
  getAllEvents,
  addEvent,
  registerForEvent,
  getEventAttendees,
  checkInForEvent,
  getEventAttendeeCount,
  updateEvent,
  deleteEvent
};