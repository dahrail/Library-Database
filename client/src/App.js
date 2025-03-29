<<<<<<< HEAD
import React, { useState } from "react";
import "./App.css";

// Import components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import RegisterAsFaculty from "./components/auth/RegisterAsFaculty"; // Import the new component
import Welcome from "./components/home/Welcome";
import Home from "./components/home/Home";
import BookList from "./components/books/BookList";
import BookLoan from "./components/books/BookLoan";
import BookHold from "./components/books/BookHold";
import AddBook from "./components/books/AddBook";
import LoanList from "./components/loans/LoanList";
import ReturnConfirmation from "./components/loans/ReturnConfirmation";
import HoldList from "./components/holds/HoldList";
import FineList from "./components/fines/FineList";
import TopBar from "./components/layout/TopBar";
import BooksNotLoggedIn from "./components/books/BooksNotLoggedIn"; // Import the new component
import RoomReservation from "./components/rooms/RoomReservation"; // Import the new component

// Import API service
import API from "./services/api";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("login");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loans, setLoans] = React.useState([]); // Initialize loans as an empty array
  const [holds, setHolds] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [fines, setFines] = useState([]);
  const [reportData, setReportData] = useState(null); // State to store data report results
=======
import React, { useState, useEffect } from "react";
import "./App.css"; // Make sure CSS is imported

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null); // Store logged-in user's details
  const [currentScreen, setCurrentScreen] = useState("login"); // Track the current screen ('login', 'welcome', 'home', 'books')
  const [books, setBooks] = useState([]); // Store the list of books
  const [newBook, setNewBook] = useState({
    BookID: "",
    Title: "",
    Author: "",
    Genre: "",
    PublicationYear: "",
    Publisher: "",
    Language: "",
    Format: "",
    ISBN: "",
    BookInventoryID: "",
    TotalCopies: "",
    AvailableCopies: "",
    ShelfLocation: "", // Add ShelfLocation field
  });
  const [newUser, setNewUser] = useState({
    Username: "",
    Password: "",
    FirstName: "",
    LastName: "",
    Email: "",
    PhoneNumber: "",
  });
  const [selectedBook, setSelectedBook] = useState(null); // Store the selected book
  const [loans, setLoans] = useState([]); // Store the list of loans
  const [holds, setHolds] = useState([]); // Store the list of holds
  const [selectedLoan, setSelectedLoan] = useState(null); // Store the selected loan

  const handleLogin = async (e) => {
    e.preventDefault();
>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa

  // Login handler
  const handleLogin = async (email, password) => {
    try {
<<<<<<< HEAD
      const data = await API.login(email, password);

      if (data.success) {
        setIsLoggedIn(true);
        setUserData(data.user);
        setCurrentScreen("welcome");
=======
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true); // Set login state to true
        setUserData(data.user); // Store user details, including UserID
        setCurrentScreen("welcome"); // Navigate to the welcome screen
>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa
      } else {
        alert(data.error || "Invalid email or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred while logging in.");
    }
  };

<<<<<<< HEAD
  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setCurrentScreen("login");
  };

  // Navigation functions
  const navigateToHome = () => setCurrentScreen("home");
  const navigateToLogin = () => setCurrentScreen("login");
  const navigateToRegister = () => setCurrentScreen("register");
  const navigateToRegisterAsFaculty = () =>
    setCurrentScreen("registerAsFaculty"); // Add navigation function
  const navigateToAddBook = () => setCurrentScreen("addBook");
  const navigateToBooksNotLoggedIn = () => setCurrentScreen("booksNotLoggedIn"); // Add navigation function
  const navigateToMedia = () => setCurrentScreen("media");
  const navigateToElectronics = () => setCurrentScreen("electronics");
  const navigateToRooms = () => {
    setCurrentScreen("rooms");
=======
  const navigateToHome = () => {
    setCurrentScreen("home"); // Navigate to the home screen
  };

  const navigateToWelcome = () => {
    setCurrentScreen("welcome"); // Navigate back to the welcome screen
>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa
  };

  const navigateToDataReport = async () => {
    try {
      const response = await fetch("/api/dataReport"); // Fetch data from the backend
      const data = await response.json();

      if (data.success) {
        setReportData(data.data); // Store the query results in state
        setCurrentScreen("dataReport"); // Navigate to the data report screen
      } else {
        alert("Failed to load data report: " + data.error);
      }
    } catch (error) {
      console.error("Error loading data report:", error);
      alert("An error occurred while loading the data report.");
    }
  };

  // Books navigation and handlers
  const navigateToBooks = async () => {
    try {
<<<<<<< HEAD
      const data = await API.getBooks(userData.UserID);
      setBooks(data);
      setCurrentScreen("books");
=======
      const response = await fetch("/api/books");
      const data = await response.json();
      console.log("Books received from backend:", data); // Log the data
      setBooks(data); // Store the books in state
      setCurrentScreen("books"); // Navigate to the books screen
>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa
    } catch (error) {
      console.error("Error fetching books:", error);
      alert("An error occurred while fetching books.");
    }
  };

  const handleLoan = (book) => {
<<<<<<< HEAD
    setSelectedBook(book);
    setCurrentScreen("loan");
  };

  const navigateToHold = (book) => {
    setSelectedBook(book);
    setCurrentScreen("hold");
  };

  const handleReturn = async (loan) => {
    try {
      console.log("Returning loan with LoanID:", loan.LoanID); // Debugging line
      const data = await API.confirmReturn(loan.LoanID); // Pass the correct LoanID
      if (data.success) {
        alert(`The item "${loan.Title}" has been successfully returned.`);
        // Refresh the loan list after returning
        const updatedLoans = await API.getLoans(userData.UserID);
        setLoans(updatedLoans);
      } else {
        alert("Failed to return the item: " + data.error);
      }
    } catch (error) {
      console.error("Error returning the item:", error);
      alert("An error occurred while returning the item.");
    }
=======
    setSelectedBook(book); // Store the selected book
    setCurrentScreen("loan"); // Navigate to the loan screen
  };

  const navigateToAddBook = () => {
    setCurrentScreen("addBook"); // Navigate to the add book screen
  };

  const navigateToRegister = () => {
    setCurrentScreen("register"); // Navigate to the register screen
>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa
  };

  // Loans navigation and handlers
  const navigateToLoans = async () => {
    try {
<<<<<<< HEAD
      const data = await API.getLoans(userData.UserID);
      if (data.success && Array.isArray(data.loans)) {
        setLoans(data.loans); // Set loans to the array from the response
      } else {
        setLoans([]); // Fallback to an empty array if the response is invalid
        alert("Failed to fetch loans: " + (data.error || "Invalid response"));
=======
      const response = await fetch(`/api/loans/${userData.UserID}`);
      const data = await response.json();

      if (data.success) {
        setLoans(data.loans); // Store the loans in state
        setCurrentScreen("loans"); // Navigate to the loans screen
      } else {
        alert("Failed to fetch loans: " + data.error);
>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa
      }
      setCurrentScreen("loans");
    } catch (error) {
      console.error("Error fetching loans:", error);
<<<<<<< HEAD
      setLoans([]); // Fallback to an empty array on error
=======
>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa
      alert("An error occurred while fetching loans.");
    }
  };

  const navigateToReturnConfirmation = (loan) => {
    console.log("Navigating to return confirmation with loan:", loan); // Debugging line
    setSelectedLoan(loan);
    setCurrentScreen("returnConfirmation");
  };

  // Holds navigation
  const navigateToHolds = async () => {
    try {
      const data = await API.getHolds(userData.UserID);
      if (data.success) {
<<<<<<< HEAD
        setHolds(data.holds);
        setCurrentScreen("holds");
=======
        setHolds(data.holds); // Store the holds in state
        setCurrentScreen("holds"); // Navigate to the holds screen
>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa
      } else {
        alert("Failed to fetch holds: " + data.error);
      }
    } catch (error) {
      console.error("Error fetching holds:", error);
      alert("An error occurred while fetching holds.");
    }
  };

  // Fines navigation
  const navigateToFines = async () => {
    try {
<<<<<<< HEAD
      const data = await API.getFines(userData.UserID);
      if (data.success) {
        setFines(data.fines);
        setCurrentScreen("fines");
      } else {
        alert("Failed to fetch fines: " + data.error);
      }
    } catch (error) {
      console.error("Error fetching fines:", error);
      alert("An error occurred while fetching fines.");
=======
      const response = await fetch("/api/addBook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });

      const data = await response.json();

      if (data.success) {
        alert("Book added successfully!");
        setCurrentScreen("home"); // Navigate back to the home screen
      } else {
        alert("Failed to add book: " + data.error);
      }
    } catch (error) {
      console.error("Error adding book:", error);
      alert("An error occurred while adding the book.");
>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa
    }
  };

  // Action handlers
  const handleRegister = async (userData) => {
    try {
<<<<<<< HEAD
      const data = await API.register(userData);
      if (data.success) {
        alert("Registration successful!");
        setCurrentScreen("login");
=======
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newUser, Role: "Student" }), // Add Role as 'Student'
      });

      const data = await response.json();

      if (data.success) {
        alert("Registration successful!");
        setCurrentScreen("login"); // Navigate back to the login screen
>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa
      } else {
        alert("Failed to register: " + data.error);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("An error occurred while registering.");
<<<<<<< HEAD
    }
  };

  const handleAddBook = async (bookData) => {
    try {
      const data = await API.addBook(bookData);
      if (data.success) {
        alert("Book added successfully!");
        // Refresh the book list
        const updatedBooks = await API.getBooks(userData.UserID);
        setBooks(updatedBooks);
        setCurrentScreen("books"); // Navigate back to the book list
      } else {
        alert("Failed to add book: " + data.error);
      }
    } catch (error) {
      console.error("Error adding book:", error);
      alert("An error occurred while adding the book.");
=======
>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa
    }
  };

  const handleConfirmLoan = async () => {
    try {
<<<<<<< HEAD
      const data = await API.confirmLoan(
        selectedBook.bookID,
        userData.UserID,
        userData.Role
      );
      if (data.success) {
        alert("Loan confirmed successfully!");
        setCurrentScreen("home");
=======
      const response = await fetch("/api/confirmLoan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          BookID: selectedBook.bookID,
          UserID: userData.UserID, // Send the UserID
          Role: userData.Role, // Send the Role
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Loan confirmed successfully!");
        setCurrentScreen("home"); // Navigate back to the home screen
>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa
      } else {
        alert("Failed to confirm loan: " + data.error);
      }
    } catch (error) {
      console.error("Error confirming loan:", error);
      alert("An error occurred while confirming the loan.");
    }
  };

<<<<<<< HEAD
  const handleConfirmHold = async () => {
    try {
      const data = await API.confirmHold(userData.UserID, selectedBook.bookID);
      if (data.success) {
        alert("Hold placed successfully!");
        setCurrentScreen("books");
=======
  const navigateToHold = (book) => {
    setSelectedBook(book); // Store the selected book
    setCurrentScreen("hold"); // Navigate to the hold screen
  };

  const handleConfirmHold = async () => {
    try {
      const response = await fetch("/api/confirmHold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserID: userData.UserID, // Send UserID from userData
          ItemType: "Book", // Set ItemType to "Book"
          ItemID: selectedBook.bookID, // Send the selected BookID
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Hold placed successfully!");
        setCurrentScreen("books"); // Navigate back to the books screen
>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa
      } else {
        alert("Failed to place hold: " + data.error);
      }
    } catch (error) {
      console.error("Error placing hold:", error);
      alert("An error occurred while placing the hold.");
    }
  };

  const handleConfirmReturn = async () => {
    try {
<<<<<<< HEAD
      console.log("Confirming return for LoanID:", selectedLoan.LoanID); // Debugging line
      const data = await API.confirmReturn(selectedLoan.LoanID); // Pass the correct LoanID
=======
      console.log("Sending LoanID to backend:", selectedLoan.LoanID); // Log the LoanID being sent

      const response = await fetch("/api/confirmReturn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ LoanID: selectedLoan.LoanID }), // Send the LoanID to the backend
      });

      const data = await response.json();

      console.log("Response from backend:", data); // Log the response from the backend

>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa
      if (data.success) {
        alert(
          `The item "${selectedLoan.Title}" has been successfully returned.`
        );
<<<<<<< HEAD
        // Refresh the loan list
        const updatedLoans = await API.getLoans(userData.UserID);
        setLoans(updatedLoans);
        setCurrentScreen("loans");
=======
        setCurrentScreen("loans"); // Navigate back to the loans screen
>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa
      } else {
        alert("Failed to return the item: " + data.error);
      }
    } catch (error) {
<<<<<<< HEAD
      console.error("Error returning the item:", error);
      alert("An error occurred while returning the item.");
    }
  };

  return (
    <div className="app-container">
      {/* Show TopBar on all screens */}
      <TopBar
        isLoggedIn={isLoggedIn}
        userData={userData}
        handleLogout={handleLogout}
        navigateToBooks={navigateToBooks} // Pass the navigateToBooks function
        navigateToBooksNotLoggedIn={navigateToBooksNotLoggedIn} // Pass the navigateToBooksNotLoggedIn function
      />

      {/* Render the appropriate screen based on currentScreen state */}
      {currentScreen === "login" && (
        <Login onLogin={handleLogin} navigateToRegister={navigateToRegister} />
      )}

      {currentScreen === "register" && (
        <Register
          onRegister={handleRegister}
          navigateToLogin={navigateToLogin}
          navigateToRegisterAsFaculty={navigateToRegisterAsFaculty} // Pass the navigation function
        />
      )}

      {currentScreen === "registerAsFaculty" && (
        <RegisterAsFaculty navigateToRegister={navigateToRegister} />
      )}

      {currentScreen === "welcome" && isLoggedIn && (
        <Welcome userData={userData} navigateToHome={navigateToHome} />
      )}

      {currentScreen === "home" && (
        <Home
          userData={userData}
          navigateToBooks={navigateToBooks}
          navigateToMedia={navigateToMedia}
          navigateToElectronics={navigateToElectronics}
          navigateToLoans={navigateToLoans} // Pass the navigateToLoans function
          navigateToRooms={navigateToRooms} // Pass the function
          navigateToHolds={navigateToHolds}
          navigateToFines={navigateToFines}
          navigateToAddBook={navigateToAddBook} // Pass the function
          navigateToDataReport={navigateToDataReport} // Pass the function
        />
      )}

      {currentScreen === "books" && (
        <BookList
          books={books}
          handleLoan={handleLoan}
          handleReturn={handleReturn}
          navigateToHome={navigateToHome}
          userData={userData} // Pass userData to check for admin role
          navigateToAddBook={navigateToAddBook} // Pass the navigateToAddBook function
        />
      )}

      {currentScreen === "booksNotLoggedIn" && (
        <BooksNotLoggedIn navigateToLogin={navigateToLogin} />
      )}

      {currentScreen === "loan" && selectedBook && (
        <BookLoan
          selectedBook={selectedBook}
          userData={userData}
          handleConfirmLoan={handleConfirmLoan}
          navigateToBooks={() => setCurrentScreen("books")}
        />
      )}

      {currentScreen === "hold" && selectedBook && (
        <BookHold
          selectedBook={selectedBook}
          handleConfirmHold={handleConfirmHold}
          navigateToBooks={() => setCurrentScreen("books")}
        />
      )}

      {currentScreen === "addBook" && (
        <AddBook onAddBook={handleAddBook} navigateToHome={navigateToHome} />
      )}

      {currentScreen === "loans" && (
        <LoanList
          loans={loans}
          navigateToReturnConfirmation={navigateToReturnConfirmation}
          navigateToHome={navigateToHome}
          handleReturn={handleReturn} // Pass the handleReturn function
        />
      )}

      {currentScreen === "returnConfirmation" && selectedLoan && (
        <ReturnConfirmation
          selectedLoan={selectedLoan}
          handleConfirmReturn={handleConfirmReturn}
          navigateToLoans={() => setCurrentScreen("loans")}
        />
      )}

      {currentScreen === "holds" && (
        <HoldList holds={holds} navigateToHome={navigateToHome} />
      )}

      {currentScreen === "fines" && (
        <FineList fines={fines} navigateToHome={navigateToHome} />
      )}

      {currentScreen === "dataReport" && (
=======
      console.error("Error confirming return:", error);
      alert("An error occurred while confirming the return.");
    }
  };

  const navigateToReturnConfirmation = (loan) => {
    setSelectedLoan(loan); // Set the selected loan
    setCurrentScreen("returnConfirmation"); // Navigate to the return confirmation screen
  };

  // Navigation bar component
  const TopBar = () => (
    <div className="top-bar">
      <div className="top-bar-content">
        <div className="logo">BookFinder</div>

        {/* Navigation buttons */}
        <div className="nav-buttons">
          <button className="nav-button">Browse & Borrow</button>
          <button className="nav-button">Media</button>
          <button className="nav-button">Electronics</button>
          <button className="nav-button">Events</button>
        </div>

        {isLoggedIn && userData && (
          <div className="user-info">
            <span>Hello, {userData.FirstName}</span>
            <button
              className="logout-button"
              onClick={() => {
                setIsLoggedIn(false);
                setUserData(null);
                setCurrentScreen("login");
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {/* Show TopBar on all screens */}
      <TopBar />

      {currentScreen === "login" && (
        <div className="login-container">
          <form onSubmit={handleLogin} className="login-form">
            <h2 className="login-title">BookFinder</h2>
            <p className="login-subtitle">University Library Portal</p>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your password"
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
              <button
                type="button"
                onClick={navigateToRegister}
                className="btn btn-secondary"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      )}

      {currentScreen === "welcome" && isLoggedIn && (
        <div className="content-container">
          <h2>Welcome!</h2>
          <p>
            You are logged in as <strong>{userData.FirstName}</strong> with role{" "}
            <strong>{userData.Role}</strong>.
          </p>
          <button onClick={navigateToHome}>Home</button>
        </div>
      )}

      {currentScreen === "home" && (
        <div className="content-container">
          <h2>Team 7 Library (Role: {userData.Role})</h2>
          <button onClick={navigateToBooks}>Books</button>
          <button onClick={navigateToLoans}>Loans</button>
          <button onClick={navigateToHolds}>Holds</button>{" "}
          {/* Add Holds button */}
          {userData.Role === "Admin" && (
            <button onClick={navigateToAddBook}>Add New Book</button>
          )}
        </div>
      )}

      {currentScreen === "books" && (
        <div className="content-container">
          <h2>Books</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Year</th>
                <th>Available Copies</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={index}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{book.year}</td>
                  <td>{book.copies}</td>
                  <td>
                    {book.copies > 0 ? (
                      <button
                        onClick={() => handleLoan(book)} // Pass the book object
                        style={{
                          backgroundColor: "blue",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Loan
                      </button>
                    ) : (
                      <button
                        onClick={() => navigateToHold(book)} // Navigate to the hold page
                        style={{
                          backgroundColor: "orange",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Hold
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={navigateToHome}>Back to Home</button>
        </div>
      )}

      {currentScreen === "loan" && selectedBook && (
        <div className="content-container">
          <h2>Loan Screen</h2>
          <p>
            Checking out a loan for book: <strong>{selectedBook.title}</strong>
          </p>
          <p>
            The book will be due in{" "}
            <strong>
              {userData.Role === "Student" ? "7 days" : "14 days"}
            </strong>
            .
          </p>
          <button onClick={() => setCurrentScreen("books")}>
            Back to Books
          </button>
          <button onClick={handleConfirmLoan}>Confirm</button>{" "}
          {/* Add Confirm button */}
        </div>
      )}

      {currentScreen === "addBook" && (
        <div className="content-container">
          <h2>Add New Book</h2>
          <form onSubmit={handleAddBook}>
            <div>
              <label>BookID:</label>
              <input
                type="number"
                value={newBook.BookID}
                onChange={(e) =>
                  setNewBook({ ...newBook, BookID: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Title:</label>
              <input
                type="text"
                value={newBook.Title}
                onChange={(e) =>
                  setNewBook({ ...newBook, Title: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Author:</label>
              <input
                type="text"
                value={newBook.Author}
                onChange={(e) =>
                  setNewBook({ ...newBook, Author: e.target.value })
                }
              />
            </div>
            <div>
              <label>Genre:</label>
              <input
                type="text"
                value={newBook.Genre}
                onChange={(e) =>
                  setNewBook({ ...newBook, Genre: e.target.value })
                }
              />
            </div>
            <div>
              <label>Publication Year:</label>
              <input
                type="number"
                value={newBook.PublicationYear}
                onChange={(e) =>
                  setNewBook({ ...newBook, PublicationYear: e.target.value })
                }
              />
            </div>
            <div>
              <label>Publisher:</label>
              <input
                type="text"
                value={newBook.Publisher}
                onChange={(e) =>
                  setNewBook({ ...newBook, Publisher: e.target.value })
                }
              />
            </div>
            <div>
              <label>Language:</label>
              <input
                type="text"
                value={newBook.Language}
                onChange={(e) =>
                  setNewBook({ ...newBook, Language: e.target.value })
                }
              />
            </div>
            <div>
              <label>Format:</label>
              <input
                type="text"
                value={newBook.Format}
                onChange={(e) =>
                  setNewBook({ ...newBook, Format: e.target.value })
                }
              />
            </div>
            <div>
              <label>ISBN:</label>
              <input
                type="text"
                value={newBook.ISBN}
                onChange={(e) =>
                  setNewBook({ ...newBook, ISBN: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>BookInventoryID:</label>
              <input
                type="number"
                value={newBook.BookInventoryID}
                onChange={(e) =>
                  setNewBook({ ...newBook, BookInventoryID: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Total Copies:</label>
              <input
                type="number"
                value={newBook.TotalCopies}
                onChange={(e) =>
                  setNewBook({ ...newBook, TotalCopies: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Available Copies:</label>
              <input
                type="number"
                value={newBook.AvailableCopies}
                onChange={(e) =>
                  setNewBook({ ...newBook, AvailableCopies: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Shelf Location:</label>
              <input
                type="text"
                value={newBook.ShelfLocation}
                onChange={(e) =>
                  setNewBook({ ...newBook, ShelfLocation: e.target.value })
                }
                required
              />
            </div>
            <button type="submit">Confirm</button>
          </form>
          <button onClick={() => setCurrentScreen("home")}>Back to Home</button>
        </div>
      )}

      {currentScreen === "register" && (
        <div className="content-container">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={newUser.Username}
                onChange={(e) =>
                  setNewUser({ ...newUser, Username: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={newUser.Password}
                onChange={(e) =>
                  setNewUser({ ...newUser, Password: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                value={newUser.FirstName}
                onChange={(e) =>
                  setNewUser({ ...newUser, FirstName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                value={newUser.LastName}
                onChange={(e) =>
                  setNewUser({ ...newUser, LastName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={newUser.Email}
                onChange={(e) =>
                  setNewUser({ ...newUser, Email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label>Phone Number:</label>
              <input
                type="text"
                value={newUser.PhoneNumber}
                onChange={(e) =>
                  setNewUser({ ...newUser, PhoneNumber: e.target.value })
                }
              />
            </div>
            <button type="submit">Confirm</button>
          </form>
          <button onClick={() => setCurrentScreen("login")}>
            Back to Login
          </button>
        </div>
      )}

      {currentScreen === "loans" && (
>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa
        <div className="content-container">
          <h2>Data Report</h2>
          <p>Here is the data from the database:</p>

          {/* Display the data in a table */}
          {reportData && (
            <table className="data-report-table">
              <thead>
                <tr>
                  {Object.keys(reportData[0]).map((key, index) => (
                    <th key={index}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
<<<<<<< HEAD
                {reportData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex}>{value}</td>
                    ))}
=======
                {loans.map((loan, index) => (
                  <tr key={index}>
                    <td>{loan.FirstName}</td>
                    <td>{loan.LastName}</td>
                    <td>{loan.ItemType}</td>
                    <td>{loan.Title}</td>
                    <td>{loan.Author}</td>
                    <td>{new Date(loan.BorrowedAt).toLocaleString()}</td>
                    <td>{new Date(loan.DueAT).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => navigateToReturnConfirmation(loan)} // Pass the loan object
                        style={{
                          backgroundColor: loan.ReturnedAt ? "gray" : "red",
                          color: "white",
                          cursor: loan.ReturnedAt ? "not-allowed" : "pointer",
                        }}
                        disabled={!!loan.ReturnedAt} // Disable if already returned
                      >
                        Return
                      </button>
                    </td>
>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <button onClick={navigateToHome} className="btn-back">
            Back to Menu
          </button>
        </div>
      )}

<<<<<<< HEAD
      {currentScreen === "rooms" && (
        <RoomReservation userData={userData} navigateToHome={navigateToHome} />
=======
      {currentScreen === "hold" && selectedBook && (
        <div className="content-container">
          <h2>Hold Screen</h2>
          <p>
            You are placing a hold for the book:{" "}
            <strong>{selectedBook.title}</strong>
          </p>
          <p>We will notify you when the book becomes available.</p>
          <button onClick={() => setCurrentScreen("books")}>
            Back to Books
          </button>
          <button onClick={handleConfirmHold}>Confirm</button>{" "}
          {/* Add Confirm button */}
        </div>
      )}

      {currentScreen === "holds" && (
        <div className="content-container">
          <h2>Your Holds</h2>
          {holds.length === 0 ? (
            <p>You have no active holds.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Requested At</th>
                  <th>Hold Status</th> {/* Add HoldStatus column */}
                </tr>
              </thead>
              <tbody>
                {holds.map((hold, index) => (
                  <tr key={index}>
                    <td>{hold.FirstName}</td>
                    <td>{hold.LastName}</td>
                    <td>{hold.Title}</td>
                    <td>{hold.Author}</td>
                    <td>{new Date(hold.RequestAT).toLocaleString()}</td>{" "}
                    {/* Correctly parse and format the date */}
                    <td>{hold.HoldStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button onClick={navigateToHome}>Back to Home</button>
        </div>
      )}

      {currentScreen === "returnConfirmation" && selectedLoan && (
        <div>
          <h2>Return Confirmation</h2>
          <p>
            Are you sure you want to return the item:{" "}
            <strong>{selectedLoan.Title}</strong> by{" "}
            <strong>{selectedLoan.Author}</strong>?
          </p>
          <button onClick={() => setCurrentScreen("loans")}>Cancel</button>
          <button onClick={handleConfirmReturn}>Confirm Return</button>
        </div>
>>>>>>> eeae8489f9c0ad04df56ab884e7555e3920024fa
      )}
    </div>
  );
}

export default App;
