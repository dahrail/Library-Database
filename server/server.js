const http = require("http");
const { releaseExpiredReservations } = require("./routes/roomRoutes");
const handleRequest = require("./routes/index");

const server = http.createServer(async (req, res) => {
  // Log the incoming request
  const { method, url } = req;
  console.log(`${method} ${url}`);
  
  // No need to duplicate routes here - let routes/index.js handle everything
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
