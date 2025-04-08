const url = require("url");
const { sendJsonResponse } = require("../utils/requestUtils");
const authRoutes = require("./authRoutes");
const bookRoutes = require("./bookRoutes");
const loanRoutes = require("./loanRoutes");
const holdRoutes = require("./holdRoutes");
const fineRoutes = require("./fineRoutes");
const reportRoutes = require("./reportRoutes");
const roomRoutes = require("./roomRoutes");
const eventRoutes = require("./eventRoutes");
const deviceRoutes = require("./deviceRoutes");
const mediaRoutes = require("./mediaRoutes");

const parseRequestBody = async (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
};

// Main request handler
const handleRequest = async (req, res) => {
  // Parse the URL and get the pathname
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`Processing ${method} request for ${path}`);

  try {
    // AUTH ROUTES
    if (method === "POST" && path === "/api/login") {
      return await authRoutes.login(req, res);
    }

    if (method === "POST" && path === "/api/register") {
      return await authRoutes.register(req, res);
    }

    if (method === "GET" && path === "/api") {
      return authRoutes.getAllUsers(req, res);
    }

    // BOOK ROUTES
    if (method === "GET" && path === "/api/books") {
      return bookRoutes.getAllBooks(req, res);
    }

    if (method === "GET" && path.match(/^\/api\/books\/\d+$/)) {
      const userId = path.split("/").pop();
      return bookRoutes.getUserBooks(req, res, userId);
    }

    if (method === "POST" && path === "/api/addBook") {
      return await bookRoutes.addBook(req, res);
    }

    if (method === "DELETE" && path === "/api/deleteBook") {
      return await bookRoutes.deleteBook(req, res);
    }

    if (method === "PUT" && path === "/api/updateBook") {
      return await bookRoutes.updateBook(req, res);
    }

    // MEDIA ROUTES
    if (method === "GET" && path === "/api/media") {
      return mediaRoutes.getAllMedia(req, res);
    }

    // DEVICE ROUTES
    if (method === "GET" && path === "/api/device") {
      return await deviceRoutes.getAllDevice(req, res);
    }

    if (method === "POST" && path === "/api/addDevice") {
      return await deviceRoutes.addDevice(req, res);
    }

    if (method === "POST" && path === "/api/returnDevice") {
      return await deviceRoutes.returnDevice(req, res);
    }

    // LOAN ROUTES
    if (method === "GET" && path.match(/^\/api\/loans\/\d+$/)) {
      const userId = path.split("/").pop();
      return loanRoutes.getUserLoans(req, res, userId);
    }

    if (method === "POST" && path === "/api/borrowBook") {
      return await loanRoutes.borrowBook(req, res);
    }

    if (method === "POST" && path === "/api/confirmReturn") {
      return await loanRoutes.confirmReturn(req, res);
    }
    if (method === "POST" && path === "/api/borrowDevice") {
      return await loanRoutes.borrowDevice(req, res);
    }

    if (method === "POST" && path === "/api/borrowMedia") {
      return await loanRoutes.borrowMedia(req, res);
    }

    // HOLD ROUTES
    if (method === "GET" && path.match(/^\/api\/holds\/\d+$/)) {
      const userId = path.split("/").pop();
      return holdRoutes.getUserHolds(req, res, userId);
    }

    if (method === "POST" && path === "/api/holdBook") {
      return await holdRoutes.holdBook(req, res);
    }

    if (method === "POST" && path === "/api/holdDevice") {
      return await holdRoutes.holdDevice(req, res);
    }

    if (method === "POST" && path === "/api/holdMedia") {
      return await holdRoutes.holdMedia(req, res);
    }

    // FINE ROUTES
    if (method === "GET" && path.match(/^\/api\/fines\/\d+$/)) {
      const userId = path.split("/").pop();
      return fineRoutes.getUserFines(req, res, userId);
    }

    // REPORT ROUTES
    if (method === "GET" && path === "/api/dataReport") {
      return reportRoutes.getDataReport(req, res);
    }

    if (method === "GET" && path === "/api/fineReport") {
      return reportRoutes.getFineReport(req, res);
    }

    // ROOM ROUTES
    if (method === "GET" && path === "/api/rooms") {
      return roomRoutes.getRooms(req, res);
    }

    if (method === "POST" && path === "/api/addRoom") {
      return await roomRoutes.addRoom(req, res);
    }

    if (method === "POST" && path === "/api/bookRoom") {
      return await roomRoutes.bookRoom(req, res);
    }

    if (method === "POST" && path === "/api/reserveRoom") {
      return await roomRoutes.reserveRoom(req, res);
    }

    if (method === "POST" && path === "/api/cancelReservation") {
      return roomRoutes.cancelReservation(req, res);
    }

    if (method === "POST" && path === "/api/updateRoom") {
      return await roomRoutes.updateRoom(req, res);
    }

    // EVENT ROUTES
    if (method === "GET" && path.match(/^\/api\/events\/?$/)) {
      return eventRoutes.getAllEvents(req, res);
    }

    if (method === "POST" && path === "/api/events") {
      return await eventRoutes.addEvent(req, res);
    }

    if (method === "POST" && path === "/api/events/register") {
      return await eventRoutes.registerForEvent(req, res);
    }

    // If we reach here, no route was matched
    console.log("No route matched for:", path);
    sendJsonResponse(res, 404, { error: "Not found" });
  } catch (error) {
    console.error("Error handling request:", error);
    sendJsonResponse(res, 500, { error: "Internal server error" });
  }
};

module.exports = handleRequest;
