const url = require('url');
const { sendJsonResponse } = require('../utils/requestUtils');
const authRoutes = require('./authRoutes');
const bookRoutes = require('./bookRoutes');
const loanRoutes = require('./loanRoutes');
const holdRoutes = require('./holdRoutes');
const fineRoutes = require('./fineRoutes');
const reportRoutes = require('./reportRoutes');

// Main request handler
const handleRequest = async (req, res) => {
  // Parse the URL and get the pathname
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  
  console.log(`Processing ${method} request for ${path}`);
  
  try {
    // AUTH ROUTES
    if (method === 'POST' && path === '/api/login') {
      return await authRoutes.login(req, res);
    }
    
    if (method === 'POST' && path === '/api/register') {
      return await authRoutes.register(req, res);
    }
    
    if (method === 'GET' && path === '/api') {
      return authRoutes.getAllUsers(req, res);
    }
    
    // BOOK ROUTES
    if (method === 'GET' && path === '/api/books') {
      return bookRoutes.getAllBooks(req, res);
    }
    
    if (method === 'GET' && path.match(/^\/api\/books\/\d+$/)) {
      const userId = path.split('/').pop();
      return bookRoutes.getUserBooks(req, res, userId);
    }
    
    if (method === 'POST' && path === '/api/addBook') {
      return await bookRoutes.addBook(req, res);
    }
    
    // LOAN ROUTES
    if (method === 'GET' && path.match(/^\/api\/loans\/\d+$/)) {
      const userId = path.split('/').pop();
      return loanRoutes.getUserLoans(req, res, userId);
    }
    
    if (method === 'POST' && path === '/api/confirmLoan') {
      return await loanRoutes.confirmLoan(req, res);
    }
    
    if (method === 'POST' && path === '/api/confirmReturn') {
      return await loanRoutes.confirmReturn(req, res);
    }
    
    // HOLD ROUTES
    if (method === 'GET' && path.match(/^\/api\/holds\/\d+$/)) {
      const userId = path.split('/').pop();
      return holdRoutes.getUserHolds(req, res, userId);
    }
    
    if (method === 'POST' && path === '/api/confirmHold') {
      return await holdRoutes.confirmHold(req, res);
    }
    
    // FINE ROUTES
    if (method === 'GET' && path.match(/^\/api\/fines\/\d+$/)) {
      const userId = path.split('/').pop();
      return fineRoutes.getUserFines(req, res, userId);
    }
    
    // REPORT ROUTES
    if (method === 'GET' && path === '/api/dataReport') {
      return reportRoutes.getDataReport(req, res);
    }
    
    if (method === 'GET' && path === '/api/fineReport') {
      return reportRoutes.getFineReport(req, res);
    }
    
    // If we reach here, no route was matched
    console.log('No route matched for:', path);
    sendJsonResponse(res, 404, { error: 'Not found' });
    
  } catch (error) {
    console.error('Error handling request:', error);
    sendJsonResponse(res, 500, { error: 'Internal server error' });
  }
};

module.exports = handleRequest;
