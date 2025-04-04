const http = require('http');
const { setCorsHeaders } = require('./utils/requestUtils');
const handleRequest = require('./routes/index');

// Create the HTTP server with the new request handler
const server = http.createServer(async (req, res) => {
  // Set CORS headers
  setCorsHeaders(res);

  // Handle OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Process the request with our main handler
  await handleRequest(req, res);
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

