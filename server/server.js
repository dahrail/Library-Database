const http = require("http");
const { setCorsHeaders } = require("./utils/requestUtils");
const handleRequest = require("./routes/index");
const {
  releaseExpiredReservations,
  updateRoom,
} = require("./routes/roomRoutes");

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
