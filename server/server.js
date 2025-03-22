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
    'SELECT FirstName, Role FROM USER WHERE Email = ? AND Password = ?',
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
  pool.query('SELECT B.Title, B.Author, B.Genre, B.PublicationYear, I.AvailableCopies FROM BOOK AS B, BOOK_INVENTORY AS I WHERE B.BookID = I.BookID', (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    const books = results.map(book => ({
      title: book.Title,
      author: book.Author,
      genre: book.Genre,
      year: book.PublicationYear,
      copies: book.AvailableCopies
    }));
    console.log("Books sent to frontend:", books); // Log the mapped results
    res.json(books); // Send the mapped results to the frontend
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

app.listen(5000, () => {
  console.log("server started on port 5000");
});

