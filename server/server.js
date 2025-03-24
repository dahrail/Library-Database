const express = require('express');
const cors = require('cors');
const app = express();
const { createPool } = require('mysql');

app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

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

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  pool.query(
    'SELECT UserID, FirstName, Role FROM USER WHERE Email = ? AND Password = ?',
    [email, password],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ success: false, error: "Internal server error" });
        return;
      }

      if (results.length > 0) {
        const user = results[0]; // Get the first matching user
        res.json({ success: true, user }); // Send user details to the frontend
      } else {
        res.json({ success: false, error: "Invalid email or password" });
      }
    }
  );
});

// Register endpoint
app.post('/api/register', (req, res) => {
  const { Username, Password, FirstName, LastName, Email, PhoneNumber, Role } = req.body;

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
        res.status(500).json({ success: false, error: 'Failed to register user' });
        return;
      }

      res.json({ success: true });
    }
  );
});

// Existing API endpoint
app.get('/api', (req, res) => {
  pool.query('SELECT * FROM USER', (err, result, fields) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Error executing query" });
      return;
    }
    res.json(result); // Send the query result as the response
  });
});

app.get('/api/books', (req, res) => {
  pool.query(
    'SELECT B.BookID, B.Title, B.Author, B.Genre, B.PublicationYear, I.AvailableCopies FROM BOOK AS B, BOOK_INVENTORY AS I WHERE B.BookID = I.BookID',
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }
      const books = results.map(book => ({
        bookID: book.BookID, // Include BookID
        title: book.Title,
        author: book.Author,
        genre: book.Genre,
        year: book.PublicationYear,
        copies: book.AvailableCopies
      }));
      console.log("Books sent to frontend:", books); // Log the mapped results
      res.json(books); // Send the mapped results to the frontend
    }
  );
});

app.get('/api/books/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT 
      B.BookID, 
      B.Title, 
      B.Author, 
      B.Genre, 
      B.PublicationYear, 
      I.AvailableCopies,
      CASE 
        WHEN I.AvailableCopies = 0 THEN 1 -- Grayed out if no available copies
        WHEN EXISTS (
          SELECT 1 
          FROM HOLD AS H 
          WHERE H.ItemID = B.BookID 
            AND H.ItemType = 'Book' 
            AND H.HoldStatus = 'Active'
            AND H.UserID != ? -- Grayed out if there is an active hold by another user
        ) THEN 1
        ELSE 0 -- Otherwise, the button is enabled
      END AS IsGrayedOut
    FROM BOOK AS B
    LEFT JOIN BOOK_INVENTORY AS I ON B.BookID = I.BookID
  `;

  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching books:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    const books = results.map(book => ({
      bookID: book.BookID,
      title: book.Title,
      author: book.Author,
      genre: book.Genre,
      year: book.PublicationYear,
      copies: book.AvailableCopies,
      isGrayedOut: book.IsGrayedOut === 1 // Add a flag to indicate if the button should be grayed out
    }));

    console.log('Books sent to frontend:', books);
    res.json(books);
  });
});

app.post('/api/addBook', (req, res) => {
  const {
    BookID,
    Title,
    Author,
    Genre,
    PublicationYear,
    Publisher,
    Language,
    Format,
    ISBN,
    BookInventoryID,
    TotalCopies,
    AvailableCopies,
    ShelfLocation // Add ShelfLocation field
  } = req.body;

  const bookQuery = `
    INSERT INTO BOOK (BookID, Title, Author, Genre, PublicationYear, Publisher, Language, Format, ISBN)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const inventoryQuery = `
    INSERT INTO BOOK_INVENTORY (BookInventoryID, BookID, TotalCopies, AvailableCopies, ShelfLocation)
    VALUES (?, ?, ?, ?, ?)
  `;

  // Insert into BOOK table
  pool.query(
    bookQuery,
    [BookID, Title, Author, Genre, PublicationYear, Publisher, Language, Format, ISBN],
    (err, bookResults) => {
      if (err) {
        console.error('Error inserting book:', err);
        res.status(500).json({ success: false, error: 'Failed to add book' });
        return;
      }

      // Insert into BOOK_INVENTORY table
      pool.query(
        inventoryQuery,
        [BookInventoryID, BookID, TotalCopies, AvailableCopies, ShelfLocation],
        (err, inventoryResults) => {
          if (err) {
            console.error('Error inserting book inventory:', err);
            res.status(500).json({ success: false, error: 'Failed to add book inventory' });
            return;
          }

          res.json({ success: true });
        }
      );
    }
  );
});

app.post('/api/confirmLoan', (req, res) => {
  const { BookID, UserID, Role } = req.body; // Receive UserID and Role from the frontend
  console.log("Received BookID for loan confirmation:", BookID);

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
      res.status(500).json({ success: false, error: 'Database connection error' });
      return;
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        connection.release();
        res.status(500).json({ success: false, error: 'Transaction error' });
        return;
      }

      // Decrement AvailableCopies
      connection.query(decrementQuery, [BookID], (err, results) => {
        if (err || results.affectedRows === 0) {
          console.error('Error decrementing AvailableCopies or no rows affected:', err);
          connection.rollback(() => connection.release());
          res.status(400).json({ success: false, error: 'No available copies to loan' });
          return;
        }

        // Insert into LOAN table
        connection.query(insertLoanQuery, [UserID, BookID, loanPeriod], (err, results) => {
          if (err) {
            console.error('Error inserting into LOAN table:', err);
            connection.rollback(() => connection.release());
            res.status(500).json({ success: false, error: 'Failed to create loan record' });
            return;
          }

          // Commit the transaction
          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              connection.rollback(() => connection.release());
              res.status(500).json({ success: false, error: 'Transaction commit error' });
              return;
            }

            connection.release();
            res.json({ success: true });
          });
        });
      });
    });
  });
});

app.post('/api/confirmHold', (req, res) => {
  const { UserID, ItemType, ItemID } = req.body;

  const query = `
    INSERT INTO HOLD (UserID, ItemType, ItemID, RequestAT, HoldStatus)
    VALUES (?, ?, ?, NOW(), 'Pending')
  `;

  pool.query(query, [UserID, ItemType, ItemID], (err, results) => {
    if (err) {
      console.error('Error inserting hold:', err);
      res.status(500).json({ success: false, error: 'Failed to place hold' });
      return;
    }

    res.json({ success: true });
  });
});

app.get('/api/loans/:userId', (req, res) => {
  const { userId } = req.params;

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
      console.error('Error fetching loans:', err);
      res.status(500).json({ success: false, error: 'Failed to fetch loans' });
      return;
    }

    console.log('Loans fetched for user:', userId, results); // Log the results
    res.json({ success: true, loans: results });
  });
});

app.get('/api/holds/:userId', (req, res) => {
  const { userId } = req.params;

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
    WHERE U.UserID = ? AND H.HoldStatus IN ('Pending', 'Active') -- Include both Pending and Active holds
  `;

  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching holds:', err);
      res.status(500).json({ success: false, error: 'Failed to fetch holds' });
      return;
    }

    // Log the results being sent to the frontend
    console.log('Holds fetched for user:', userId, results);

    res.json({ success: true, holds: results });
  });
});

app.post('/api/confirmReturn', (req, res) => {
  const { LoanID } = req.body; // Receive the LoanID from the frontend

  console.log('Received LoanID from frontend:', LoanID); // Log the LoanID received

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
      res.status(500).json({ success: false, error: 'Database connection error' });
      return;
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        connection.release();
        res.status(500).json({ success: false, error: 'Transaction error' });
        return;
      }

      // Update the loan's ReturnedAt field
      connection.query(updateLoanQuery, [LoanID], (err, results) => {
        if (err || results.affectedRows === 0) {
          console.error('Error updating loan or no rows affected:', err);
          connection.rollback(() => connection.release());
          res.status(404).json({ success: false, error: 'Loan not found or already returned' });
          return;
        }

        // Increment AvailableCopies in BOOK_INVENTORY
        connection.query(incrementCopiesQuery, [LoanID], (err, results) => {
          if (err || results.affectedRows === 0) {
            console.error('Error incrementing AvailableCopies or no rows affected:', err);
            connection.rollback(() => connection.release());
            res.status(500).json({ success: false, error: 'Failed to update book inventory' });
            return;
          }

          // Commit the transaction
          connection.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              connection.rollback(() => connection.release());
              res.status(500).json({ success: false, error: 'Transaction commit error' });
              return;
            }

            console.log('Loan returned and book inventory updated successfully');
            connection.release();
            res.json({ success: true });
          });
        });
      });
    });
  });
});

app.listen(5000, () => {
  console.log("server started on port 5000");
});

