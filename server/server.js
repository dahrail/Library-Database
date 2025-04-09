const http = require("http");
const { setCorsHeaders } = require("./utils/requestUtils");
const handleRequest = require("./routes/index");
const {
  releaseExpiredReservations,
  updateRoom,
} = require("./routes/roomRoutes");
const eventRoutes = require("./routes/eventRoutes");

// Create the HTTP server with the new request handler
const server = http.createServer(async (req, res) => {
  // Set CORS headers
  setCorsHeaders(res);

  // Handle OPTIONS requests for CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const { method, url: path } = req;

  if (method === "POST" && path === "/api/updateRoom") {
    return await updateRoom(req, res);
  }

  // Set up event routes with more explicit error handling
  if (method === "GET" && path === "/api/events") {
    console.log("Routing to getAllEvents");
    return await eventRoutes.getAllEvents(req, res);
  }
  if (method === "POST" && path === "/api/events") {
    console.log("Routing to addEvent");
    return await eventRoutes.addEvent(req, res);
  }
  if (method === "POST" && path === "/api/events/register") {
    console.log("Routing to registerForEvent");
    return await eventRoutes.registerForEvent(req, res);
  }
  if (method === "POST" && path === "/api/events/checkin") {
    console.log("Routing to checkInForEvent");
    return await eventRoutes.checkInForEvent(req, res);
  }
  if (method === "GET" && path.startsWith("/api/events/") && path.endsWith("/attendees")) {
    const eventId = path.split("/")[3];
    console.log("Routing to getEventAttendees for event:", eventId);
    return await eventRoutes.getEventAttendees(req, res, eventId);
  }
  if (method === "GET" && path.startsWith("/api/events/") && path.endsWith("/count")) {
    const eventId = path.split("/")[3];
    console.log("Routing to getEventAttendeeCount for event:", eventId);
    return await eventRoutes.getEventAttendeeCount(req, res, eventId);
  }
  if (method === "PUT" && path.startsWith("/api/events/")) {
    const eventId = path.split("/")[3];
    console.log("Routing to updateEvent for event:", eventId);
    return await eventRoutes.updateEvent(req, res, eventId);
  }
  if (method === "DELETE" && path.startsWith("/api/events/")) {
    const eventId = path.split("/")[3];
    console.log("Routing to deleteEvent for event:", eventId);
    return await eventRoutes.deleteEvent(req, res, eventId);
  }

  // Process the request with our main handler
  await handleRequest(req, res);
});

// Schedule the task to run every minute
setInterval(() => {
  releaseExpiredReservations();
}, 60 * 1000); // Run every 60 seconds

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
