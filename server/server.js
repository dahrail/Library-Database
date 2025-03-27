const http = require('http');
const url = require('url');
const { createPool } = require('mysql');

// Database connection
const pool = createPool({
  host: "team7library.mysql.database.azure.com",
  user: "Team7Admin",
  password: "Admin123uma",
  database: "librarynew",
  connectionLimit: 5,
  ssl: {
    rejectUnauthorized: true // Ensures SSL is used
  }
});

// Helper function to parse JSON request body
const parseRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    req.on('end', () => {
      try {
        if (body.length) {
          const parsedBody = JSON.parse(Buffer.concat(body).toString());
          resolve(parsedBody);
        } else {
          resolve({});
        }
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', (err) => {
      reject(err);
    });
  });
};

// Helper function to send a JSON response
const sendJsonResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

// CORS headers middleware
const setCorsHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

// Completely redesigned and simplified route matching system
const handleRequest = async (req, res) => {
  // Parse the URL and get the pathname
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  
  console.log(`Processing ${method} request for ${path}`);
  
  // Handle specific routes directly with better logging
  try {
    // LOGIN
    if (method === 'POST' && path === '/api/login') {
      const body = await parseRequestBody(req);
      console.log('Login attempt for email:', body.email);
      
      pool.query(
        'SELECT UserID, FirstName, Role FROM USER WHERE Email = ? AND Password = ?',
        [body.email, body.password],
        (err, results) => {
          if (err) {
            console.error("Error in login query:", err);
            sendJsonResponse(res, 500, { success: false, error: "Internal server error" });
            return;
          }

          if (results.length > 0) {
            const user = results[0];
            console.log('Login successful for user:', user.FirstName);
            sendJsonResponse(res, 200, { success: true, user });
          } else {
            console.log('Login failed: Invalid credentials');
            sendJsonResponse(res, 200, { success: false, error: "Invalid email or password" });
          }
        }
      );
      return;
    }
    
    // REGISTER
    if (method === 'POST' && path === '/api/register') {
      const { Username, Password, FirstName, LastName, Email, PhoneNumber, Role } = await parseRequestBody(req);
      console.log('Registration attempt for:', Email);
      
      const query = `
        INSERT INTO USER (Username, Password, FirstName, LastName, Email, PhoneNumber, Role, AccountCreateAt, AccountStatus)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 'Active')
      `;

      pool.query(
        query,
        [Username, Password, FirstName, LastName, Email, PhoneNumber, Role],
        (err, results) => {
          if (err) {
            console.error('Error registering user:', err);
            sendJsonResponse(res, 500, { success: false, error: 'Failed to register user' });
            return;
          }

          console.log('User registered successfully:', Email);
          sendJsonResponse(res, 200, { success: true });
        }
      );
      return;
    }
    
    // GET ALL USERS
    if (method === 'GET' && path === '/api') {
      console.log('Fetching all users');
      
      pool.query('SELECT * FROM USER', (err, result) => {
        if (err) {
          console.error("Error executing query:", err);
          sendJsonResponse(res, 500, { error: "Error executing query" });
          return;
        }
        
        console.log('User data fetched successfully');
        sendJsonResponse(res, 200, result);
      });
      return;
    }
    
    // GET ALL BOOKS
    if (method === 'GET' && path === '/api/books') {
      console.log('Fetching all books');
      
      pool.query(
        'SELECT B.BookID, B.Title, B.Author, B.Genre, B.PublicationYear, I.AvailableCopies FROM BOOK AS B, BOOK_INVENTORY AS I WHERE B.BookID = I.BookID',
        (err, results) => {
          if (err) {
            console.error("Error executing books query:", err);
            sendJsonResponse(res, 500, { error: "Internal server error" });
            return;
          }
          
          const books = results.map(book => ({
            bookID: book.BookID,
            title: book.Title,
            author: book.Author,
            genre: book.Genre,
            year: book.PublicationYear,
            copies: book.AvailableCopies
          }));
          
          console.log(`Sending ${books.length} books to frontend`);
          sendJsonResponse(res, 200, books);
        }
      );
      return;
    }
    
    // GET BOOKS FOR SPECIFIC USER
    if (method === 'GET' && path.match(/^\/api\/books\/\d+$/)) {
      const userId = path.split('/').pop();
      console.log(`Fetching books for user ID: ${userId}`);
      
      const query = `
        SELECT 
          B.BookID, 
          B.Title, 
          B.Author, 
          B.Genre, 
          B.PublicationYear, 
          I.AvailableCopies,
          CASE 
            WHEN EXISTS (
              SELECT 1 
              FROM HOLD AS H 
              WHERE H.ItemID = B.BookID 
                AND H.ItemType = 'Book' 
                AND H.HoldStatus = 'Active'
                AND H.UserID = ?
            ) THEN 1
            ELSE 0
          END AS UserHasHold,
          CASE 
            WHEN EXISTS (
              SELECT 1 
              FROM HOLD AS H 
              WHERE H.ItemID = B.BookID 
                AND H.ItemType = 'Book' 
                AND H.HoldStatus = 'Active'
                AND H.UserID != ?
            ) THEN 1
            ELSE 0
          END AS OtherUserHasHold
        FROM BOOK AS B
        LEFT JOIN BOOK_INVENTORY AS I ON B.BookID = I.BookID
      `;

      pool.query(query, [userId, userId], (err, results) => {
        if (err) {
          console.error('Error fetching books for user:', err);
          sendJsonResponse(res, 500, { error: 'Internal server error' });
          return;
        }

        const books = results.map(book => ({
          bookID: book.BookID,
          title: book.Title,
          author: book.Author,
          genre: book.Genre,
          year: book.PublicationYear,
          copies: book.AvailableCopies,
          userHasHold: book.UserHasHold === 1,
          otherUserHasHold: book.OtherUserHasHold === 1
        }));

        console.log(`Sending ${books.length} books for user ${userId}`);
        sendJsonResponse(res, 200, books);
      });
      return;
    }
    
    // GET LOANS FOR SPECIFIC USER
    if (method === 'GET' && path.match(/^\/api\/loans\/\d+$/)) {
      const userId = path.split('/').pop();
      console.log(`Fetching loans for user ID: ${userId}`);
      
      const query = `
        SELECT 
          L.LoanID, 
          U.FirstName, 
          U.LastName, 
          L.ItemType, 
          B.Title, 
          B.Author, 
          L.BorrowedAt, 
          L.DueAT, 
          L.ReturnedAt
        FROM LOAN AS L
        JOIN USER AS U ON L.UserID = U.UserID
        JOIN BOOK AS B ON L.ItemID = B.BookID
        WHERE L.UserID = ?
      `;

      pool.query(query, [userId], (err, results) => {
        if (err) {
          console.error('Error fetching loans for user:', err);
          sendJsonResponse(res, 500, { success: false, error: 'Failed to fetch loans' });
          return;
        }

        console.log(`Retrieved ${results.length} loans for user ${userId}`);
        sendJsonResponse(res, 200, { success: true, loans: results });
      });
      return;
    }
    
    // GET HOLDS FOR SPECIFIC USER
    if (method === 'GET' && path.match(/^\/api\/holds\/\d+$/)) {
      const userId = path.split('/').pop();
      console.log(`Fetching holds for user ID: ${userId}`);
      
      const query = `
        SELECT 
          U.FirstName, 
          U.LastName, 
          B.Title, 
          B.Author, 
          DATE_FORMAT(CONVERT_TZ(H.RequestAT, '+00:00', @@session.time_zone), '%Y-%m-%dT%H:%i:%sZ') AS RequestAT, 
          H.HoldStatus
        FROM USER AS U
        JOIN HOLD AS H ON U.UserID = H.UserID
        JOIN BOOK AS B ON H.ItemID = B.BookID
        WHERE U.UserID = ? AND H.HoldStatus IN ('Pending', 'Active')
      `;

      pool.query(query, [userId], (err, results) => {
        if (err) {
          console.error('Error fetching holds for user:', err);
          sendJsonResponse(res, 500, { success: false, error: 'Failed to fetch holds' });
          return;
        }

        console.log(`Retrieved ${results.length} holds for user ${userId}`);
        sendJsonResponse(res, 200, { success: true, holds: results });
      });
      return;
    }
    
    // GET FINES FOR SPECIFIC USER
    if (method === 'GET' && path.match(/^\/api\/fines\/\d+$/)) {
      const userId = path.split('/').pop();
      console.log(`Fetching fines for user ID: ${userId}`);
      
      const query = `
        SELECT 
          L.ItemType, 
          B.Title, 
          B.Author, 
          L.BorrowedAt, 
          L.DueAT, 
          F.Amount, 
          F.PaymentStatus AS Status
        FROM LOAN AS L
        JOIN BOOK AS B ON L.ItemID = B.BookID
        JOIN FINE AS F ON L.LoanID = F.LoanID
        WHERE L.UserID = ?
      `;

      pool.query(query, [userId], (err, results) => {
        if (err) {
          console.error('Error fetching fines for user:', err);
          sendJsonResponse(res, 500, { success: false, error: 'Failed to fetch fines' });
          return;
        }

        console.log(`Retrieved ${results.length} fines for user ${userId}`);
        sendJsonResponse(res, 200, { success: true, fines: results });
      });
      return;
    }
    
    // DATA REPORT
    if (method === 'GET' && path === '/api/dataReport') {
      console.log('Fetching data report');
      
      const query = 'SELECT * FROM USER';

      pool.query(query, (err, results) => {
        if (err) {
          console.error('Error executing data report query:', err);
          sendJsonResponse(res, 500, { success: false, error: 'Failed to fetch data report' });
          return;
        }

        console.log(`Data report generated with ${results.length} records`);
        sendJsonResponse(res, 200, { success: true, data: results });
      });
      return;
    }
    
    // FINE REPORT
    if (method === 'GET' && path === '/api/fineReport') {
      console.log('Fetching fine report');
      
      const query = `
        SELECT 
          U.FirstName, 
          U.LastName, 
          B.Title, 
          B.Author, 
          DATE_FORMAT(L.BorrowedAt, '%Y-%m-%d %H:%i:%s') AS BorrowedAt, 
          DATE_FORMAT(L.DueAT, '%Y-%m-%d %H:%i:%s') AS DueAt, 
          F.Amount, 
          F.PaymentStatus AS Status
        FROM FINE AS F
        JOIN LOAN AS L ON F.LoanID = L.LoanID
        JOIN USER AS U ON L.UserID = U.UserID
        JOIN BOOK AS B ON L.ItemID = B.BookID
      `;

      pool.query(query, (err, results) => {
        if (err) {
          console.error('Error executing fine report query:', err);
          sendJsonResponse(res, 500, { success: false, error: 'Failed to fetch fine report' });
          return;
        }

        console.log(`Fine report generated with ${results.length} records`);
        sendJsonResponse(res, 200, { success: true, data: results });
      });
      return;
    }
    
    // ADD BOOK
    if (method === 'POST' && path === '/api/addBook') {
      const bookData = await parseRequestBody(req);
      console.log('Adding new book:', bookData.Title);
      
      // Rest of the add book handler remains the same
      // ...existing add book code...
      
      const {
        Title,
        Author,
        Genre,
        PublicationYear,
        Publisher,
        Language,
        Format,
        ISBN,
        TotalCopies,
        AvailableCopies,
        ShelfLocation
      } = bookData;

      // Insert into BOOK table
      const bookQuery = `
        INSERT INTO BOOK (Title, Author, Genre, PublicationYear, Publisher, Language, Format, ISBN)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Insert into BOOK_INVENTORY table
      const inventoryQuery = `
        INSERT INTO BOOK_INVENTORY (BookID, TotalCopies, AvailableCopies, ShelfLocation)
        VALUES (LAST_INSERT_ID(), ?, ?, ?)
      `;

      pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting database connection:', err);
          sendJsonResponse(res, 500, { success: false, error: 'Database connection error' });
          return;
        }

        connection.beginTransaction((err) => {
          if (err) {
            console.error('Error starting transaction:', err);
            connection.release();
            sendJsonResponse(res, 500, { success: false, error: 'Transaction error' });
            return;
          }

          // Insert into BOOK table
          connection.query(
            bookQuery,
            [Title, Author, Genre, PublicationYear, Publisher, Language, Format, ISBN],
            (err, bookResults) => {
              if (err) {
                console.error('Error inserting book:', err);
                connection.rollback(() => connection.release());
                sendJsonResponse(res, 500, { success: false, error: 'Failed to add book' });
                return;
              }

              // Insert into BOOK_INVENTORY table
              connection.query(
                inventoryQuery,
                [TotalCopies, AvailableCopies, ShelfLocation],
                (err, inventoryResults) => {
                  if (err) {
                    console.error('Error inserting book inventory:', err);
                    connection.rollback(() => connection.release());
                    sendJsonResponse(res, 500, { success: false, error: 'Failed to add book inventory' });
                    return;
                  }

                  // Commit the transaction
                  connection.commit((err) => {
                    if (err) {
                      console.error('Error committing transaction:', err);
                      connection.rollback(() => connection.release());
                      sendJsonResponse(res, 500, { success: false, error: 'Transaction commit error' });
                      return;
                    }

                    connection.release();
                    console.log('Book added successfully:', Title);
                    sendJsonResponse(res, 200, { success: true });
                  });
                }
              );
            }
          );
        });
      });
      return;
    }
    
    // CONFIRM LOAN
    if (method === 'POST' && path === '/api/confirmLoan') {
      const { BookID, UserID, Role } = await parseRequestBody(req);
      console.log(`Confirming loan for book ID: ${BookID}, user ID: ${UserID}, role: ${Role}`);
      
      // Rest of the confirm loan handler remains the same
      // ...existing confirm loan code...
      
      const decrementQuery = `
        UPDATE BOOK_INVENTORY
        SET AvailableCopies = AvailableCopies - 1
        WHERE BookID = ? AND AvailableCopies > 0
      `;

      const insertLoanQuery = `
        INSERT INTO LOAN (UserID, ItemType, ItemID, BorrowedAt, DueAT)
        VALUES (?, 'Book', ?, NOW(), DATE_ADD(NOW(), INTERVAL ? DAY))
      `;

      // Determine the loan period based on the user's role
      const loanPeriod = Role === 'Student' ? 7 : 14;

      // Start a transaction
      pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting database connection:', err);
          sendJsonResponse(res, 500, { success: false, error: 'Database connection error' });
          return;
        }

        connection.beginTransaction((err) => {
          if (err) {
            console.error('Error starting transaction:', err);
            connection.release();
            sendJsonResponse(res, 500, { success: false, error: 'Transaction error' });
            return;
          }

          // Decrement AvailableCopies
          connection.query(decrementQuery, [BookID], (err, results) => {
            if (err || results.affectedRows === 0) {
              console.error('Error decrementing AvailableCopies or no rows affected:', err);
              connection.rollback(() => connection.release());
              sendJsonResponse(res, 400, { success: false, error: 'No available copies to loan' });
              return;
            }

            // Insert into LOAN table
            connection.query(insertLoanQuery, [UserID, BookID, loanPeriod], (err, results) => {
              if (err) {
                console.error('Error inserting into LOAN table:', err);
                connection.rollback(() => connection.release());
                sendJsonResponse(res, 500, { success: false, error: 'Failed to create loan record' });
                return;
              }

              // Commit the transaction
              connection.commit((err) => {
                if (err) {
                  console.error('Error committing transaction:', err);
                  connection.rollback(() => connection.release());
                  sendJsonResponse(res, 500, { success: false, error: 'Transaction commit error' });
                  return;
                }

                connection.release();
                console.log('Loan confirmed successfully for book ID:', BookID);
                sendJsonResponse(res, 200, { success: true });
              });
            });
          });
        });
      });
      return;
    }
    
    // CONFIRM HOLD
    if (method === 'POST' && path === '/api/confirmHold') {
      const { UserID, ItemType, ItemID } = await parseRequestBody(req);
      console.log(`Placing hold for item ID: ${ItemID}, user ID: ${UserID}, item type: ${ItemType}`);
      
      const query = `
        INSERT INTO HOLD (UserID, ItemType, ItemID, RequestAT, HoldStatus)
        VALUES (?, ?, ?, NOW(), 'Pending')
      `;

      pool.query(query, [UserID, ItemType, ItemID], (err, results) => {
        if (err) {
          console.error('Error inserting hold:', err);
          sendJsonResponse(res, 500, { success: false, error: 'Failed to place hold' });
          return;
        }

        console.log('Hold placed successfully for item ID:', ItemID);
        sendJsonResponse(res, 200, { success: true });
      });
      return;
    }
    
    // CONFIRM RETURN
    if (method === 'POST' && path === '/api/confirmReturn') {
      const { LoanID } = await parseRequestBody(req);
      console.log(`Confirming return for loan ID: ${LoanID}`);
      
      // Rest of the confirm return handler remains the same
      // ...existing confirm return code...
      
      // Query to update the loan's ReturnedAt field
      const updateLoanQuery = `
        UPDATE LOAN
        SET ReturnedAt = NOW() 
        WHERE LoanID = ?
      `;

      // Query to increment AvailableCopies in BOOK_INVENTORY
      const incrementCopiesQuery = `
        UPDATE BOOK_INVENTORY
        SET AvailableCopies = AvailableCopies + 1
        WHERE BookID = (
          SELECT ItemID FROM LOAN WHERE LoanID = ? AND ItemType = 'Book'
        )
      `;

      // Execute both queries in sequence
      pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting database connection:', err);
          sendJsonResponse(res, 500, { success: false, error: 'Database connection error' });
          return;
        }

        connection.beginTransaction((err) => {
          if (err) {
            console.error('Error starting transaction:', err);
            connection.release();
            sendJsonResponse(res, 500, { success: false, error: 'Transaction error' });
            return;
          }

          // Update the loan's ReturnedAt field
          connection.query(updateLoanQuery, [LoanID], (err, results) => {
            if (err || results.affectedRows === 0) {
              console.error('Error updating loan or no rows affected:', err);
              connection.rollback(() => connection.release());
              sendJsonResponse(res, 404, { success: false, error: 'Loan not found or already returned' });
              return;
            }

            // Increment AvailableCopies in BOOK_INVENTORY
            connection.query(incrementCopiesQuery, [LoanID], (err, results) => {
              if (err || results.affectedRows === 0) {
                console.error('Error incrementing AvailableCopies or no rows affected:', err);
                connection.rollback(() => connection.release());
                sendJsonResponse(res, 500, { success: false, error: 'Failed to update book inventory' });
                return;
              }

              // Commit the transaction
              connection.commit((err) => {
                if (err) {
                  console.error('Error committing transaction:', err);
                  connection.rollback(() => connection.release());
                  sendJsonResponse(res, 500, { success: false, error: 'Transaction commit error' });
                  return;
                }

                console.log('Loan return confirmed successfully for loan ID:', LoanID);
                connection.release();
                sendJsonResponse(res, 200, { success: true });
              });
            });
          });
        });
      });
      return;
    }
    
    // If we reach here, no route was matched
    console.log('No route matched for:', path);
    sendJsonResponse(res, 404, { error: 'Not found' });
    
  } catch (error) {
    console.error('Error handling request:', error);
    sendJsonResponse(res, 500, { error: 'Internal server error' });
  }
};

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

  // Process the request with our new handler
  await handleRequest(req, res);
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

