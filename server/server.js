const http = require("http");
const { releaseExpiredReservations } = require("./routes/roomRoutes");
const handleRequest = require("./routes/index");

// Import the sendEmail function
const sendEmail = require("../sendEmail");

// Import the email notification service
const { startEmailNotificationService } = require("./emailNotificationService");

const server = http.createServer(async (req, res) => {
  // Log the incoming request
  const { method, url } = req;
  console.log(`${method} ${url}`);
  
  // No need to duplicate routes here - let routes/index.js handle everything
  // Process the request with our main handler
  await handleRequest(req, res);
});

// Example of how you might use it in the server
// You can add this to the appropriate route handlers
/*
app.post('/api/some-route', async (req, res) => {
  try {
    // Your route logic here
    
    // Send an email notification
    await sendEmail(
      'recipient@example.com',
      'Subject of the email',
      'Body text of the email'
    );
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
*/

// Schedule the task to run every minute
setInterval(() => {
  releaseExpiredReservations();
}, 60 * 1000); // Run every 60 seconds

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  
  // Start the email notification service when the server starts
  const emailService = startEmailNotificationService();
  
  // Optionally, set up graceful shutdown to stop the email service
  process.on("SIGINT", () => {
    console.log("Shutting down server...");
    emailService.stop();
    process.exit();
  });
});
