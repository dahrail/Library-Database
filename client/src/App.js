import React, { useState, useEffect } from 'react';
import './App.css';

// Import components
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import RegisterAsFaculty from "./components/auth/RegisterAsFaculty";
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
import BooksNotLoggedIn from "./components/books/BooksNotLoggedIn";
import LandingPage from "./components/home/LandingPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    BookID: '',
    Title: '',
    Author: '',
    Genre: '',
    PublicationYear: '',
    Publisher: '',
    Language: '',
    Format: '',
    ISBN: '',
    BookInventoryID: '',
    TotalCopies: '',
    AvailableCopies: '',
    ShelfLocation: ''
  });
  const [newUser, setNewUser] = useState({
    Username: '',
    Password: '',
    FirstName: '',
    LastName: '',
    Email: '',
    PhoneNumber: ''
  });
  const [selectedBook, setSelectedBook] = useState(null);
  const [loans, setLoans] = useState([]);
  const [holds, setHolds] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [fines, setFines] = useState([]);
  const [reportData, setReportData] = useState(null);

  const handleLogin = async (emailInput, passwordInput) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true);
        setUserData(data.user);
        setCurrentScreen('welcome');
      } else {
        alert(data.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred while logging in.');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setCurrentScreen('login');
  };

  // Navigation functions
  const navigateToHome = () => setCurrentScreen('home');
  const navigateToLogin = () => setCurrentScreen('login');
  const navigateToRegister = () => setCurrentScreen('register');
  const navigateToRegisterAsFaculty = () => setCurrentScreen('registerAsFaculty');
  const navigateToAddBook = () => setCurrentScreen('addBook');
  const navigateToBooksNotLoggedIn = () => setCurrentScreen('booksNotLoggedIn');
  const navigateToMedia = () => setCurrentScreen('media');
  const navigateToElectronics = () => setCurrentScreen('electronics');
  const navigateToLanding = () => setCurrentScreen('landing');
  const navigateToWelcome = () => setCurrentScreen('welcome');

  const navigateToBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const data = await response.json();
      console.log("Books received from backend:", data);
      setBooks(data);
      setCurrentScreen('books');
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleLoan = (book) => {
    setSelectedBook(book);
    setCurrentScreen('loan');
  };

  const navigateToLoans = async () => {
    try {
      const response = await fetch(`/api/loans/${userData.UserID}`);
      const data = await response.json();

      if (data.success) {
        setLoans(data.loans);
        setCurrentScreen('loans');
      } else {
        alert('Failed to fetch loans: ' + data.error);
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
      alert('An error occurred while fetching loans.');
    }
  };

  const navigateToHolds = async () => {
    try {
      const response = await fetch(`/api/holds/${userData.UserID}`);
      const data = await response.json();

      if (data.success) {
        setHolds(data.holds);
        setCurrentScreen('holds');
      } else {
        alert('Failed to fetch holds: ' + data.error);
      }
    } catch (error) {
      console.error('Error fetching holds:', error);
      alert('An error occurred while fetching holds.');
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/addBook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook)
      });

      const data = await response.json();

      if (data.success) {
        alert('Book added successfully!');
        setCurrentScreen('home');
      } else {
        alert('Failed to add book: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding book:', error);
      alert('An error occurred while adding the book.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Combine the phone number parts
    const fullPhoneNumber = `${newUser.PhonePart1}${newUser.PhonePart2}${newUser.PhonePart3}`;

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...newUser, 
          PhoneNumber: fullPhoneNumber,
          Role: 'Student'
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Registration successful!');
        setCurrentScreen('login');
      } else {
        alert('Failed to register: ' + data.error);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert('An error occurred while registering.');
    }
  };

  const handleConfirmLoan = async () => {
    console.log("Confirming loan for BookID:", selectedBook.bookID);
    console.log("UserID being sent:", userData.UserID);
    
    try {
      const response = await fetch('/api/confirmLoan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BookID: selectedBook.bookID,
          UserID: userData.UserID,
          Role: userData.Role
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Loan confirmed successfully!');
        setCurrentScreen('home');
      } else {
        alert('Failed to confirm loan: ' + data.error);
      }
    } catch (error) {
      console.error('Error confirming loan:', error);
      alert('An error occurred while confirming the loan.');
    }
  };

  const navigateToHold = (book) => {
    setSelectedBook(book);
    setCurrentScreen('hold');
  };

  const handleConfirmHold = async () => {
    try {
      const response = await fetch('/api/confirmHold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserID: userData.UserID,
          ItemType: 'Book',
          ItemID: selectedBook.bookID,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert('Hold placed successfully!');
        setCurrentScreen('books');
      } else {
        alert('Failed to place hold: ' + data.error);
      }
    } catch (error) {
      console.error('Error placing hold:', error);
      alert('An error occurred while placing the hold.');
    }
  };

  const navigateToReturnConfirmation = (loan) => {
    console.log('Navigating to ReturnConfirmation with loan:', loan);
    setSelectedLoan(loan);
    setCurrentScreen('returnConfirmation');
  };

  const handleConfirmReturn = async () => {
    try {
      console.log('Sending LoanID to backend:', selectedLoan.LoanID);

      const response = await fetch('/api/confirmReturn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ LoanID: selectedLoan.LoanID })
      });

      const data = await response.json();

      console.log('Response from backend:', data);

      if (data.success) {
        alert(`The item "${selectedLoan.Title}" has been successfully returned.`);
        setCurrentScreen('loans');
      } else {
        alert('Failed to return the item: ' + data.error);
      }
    } catch (error) {
      console.error('Error confirming return:', error);
      alert('An error occurred while confirming the return.');
    }
  };

  return (
    <div className="app-container">
      {/* Show TopBar on all screens */}
      <TopBar
        isLoggedIn={isLoggedIn}
        userData={userData}
        handleLogout={handleLogout}
        navigateToBooks={navigateToBooks}
        navigateToBooksNotLoggedIn={navigateToBooksNotLoggedIn}
        navigateToLogin={navigateToLogin}
        navigateToRegister={navigateToRegister}
      />

      {/* Render the appropriate screen based on currentScreen state */}
      {currentScreen === "landing" && (
        <LandingPage
          navigateToLogin={() => setCurrentScreen("login")}
          navigateToRegister={() => setCurrentScreen("register")}
        />
      )}

      {currentScreen === "login" && (
        <Login 
          onLogin={handleLogin} 
          navigateToRegister={navigateToRegister}
          navigateToLanding={navigateToLanding}
        />
      )}

      {currentScreen === "register" && (
        <Register
          onRegister={handleRegister}
          navigateToLogin={navigateToLogin}
          navigateToRegisterAsFaculty={navigateToRegisterAsFaculty}
          navigateToLanding={navigateToLanding}
        />
      )}

      {currentScreen === "registerAsFaculty" && (
        <RegisterAsFaculty 
          navigateToRegister={navigateToRegister}
          navigateToLanding={navigateToLanding}
        />
      )}

      {currentScreen === 'books' && (
        <div>
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
                        onClick={() => handleLoan(book)}
                        style={{
                          backgroundColor: 'blue',
                          color: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        Loan
                      </button>
                    ) : (
                      <button
                        onClick={() => navigateToHold(book)}
                        style={{
                          backgroundColor: 'orange',
                          color: 'white',
                          cursor: 'pointer',
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

      {currentScreen === 'loan' && selectedBook && (
        <div>
          <h2>Loan Screen</h2>
          <p>Checking out a loan for book: <strong>{selectedBook.title}</strong></p>
          <p>
            The book will be due in{' '}
            <strong>{userData.Role === 'Student' ? '7 days' : '14 days'}</strong>.
          </p>
          <button onClick={() => setCurrentScreen('books')}>Back to Books</button>
          <button onClick={handleConfirmLoan}>Confirm</button>
        </div>
      )}

      {currentScreen === 'addBook' && (
        <div>
          <h2>Add New Book</h2>
          <form onSubmit={handleAddBook}>
            <div>
              <label>BookID:</label>
              <input
                type="number"
                value={newBook.BookID}
                onChange={(e) => setNewBook({ ...newBook, BookID: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Title:</label>
              <input
                type="text"
                value={newBook.Title}
                onChange={(e) => setNewBook({ ...newBook, Title: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Author:</label>
              <input
                type="text"
                value={newBook.Author}
                onChange={(e) => setNewBook({ ...newBook, Author: e.target.value })}
              />
            </div>
            <div>
              <label>Genre:</label>
              <input
                type="text"
                value={newBook.Genre}
                onChange={(e) => setNewBook({ ...newBook, Genre: e.target.value })}
              />
            </div>
            <div>
              <label>Publication Year:</label>
              <input
                type="number"
                value={newBook.PublicationYear}
                onChange={(e) => setNewBook({ ...newBook, PublicationYear: e.target.value })}
              />
            </div>
            <div>
              <label>Publisher:</label>
              <input
                type="text"
                value={newBook.Publisher}
                onChange={(e) => setNewBook({ ...newBook, Publisher: e.target.value })}
              />
            </div>
            <div>
              <label>Language:</label>
              <input
                type="text"
                value={newBook.Language}
                onChange={(e) => setNewBook({ ...newBook, Language: e.target.value })}
              />
            </div>
            <div>
              <label>Format:</label>
              <input
                type="text"
                value={newBook.Format}
                onChange={(e) => setNewBook({ ...newBook, Format: e.target.value })}
              />
            </div>
            <div>
              <label>ISBN:</label>
              <input
                type="text"
                value={newBook.ISBN}
                onChange={(e) => setNewBook({ ...newBook, ISBN: e.target.value })}
                required
              />
            </div>
            <div>
              <label>BookInventoryID:</label>
              <input
                type="number"
                value={newBook.BookInventoryID}
                onChange={(e) => setNewBook({ ...newBook, BookInventoryID: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Total Copies:</label>
              <input
                type="number"
                value={newBook.TotalCopies}
                onChange={(e) => setNewBook({ ...newBook, TotalCopies: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Available Copies:</label>
              <input
                type="number"
                value={newBook.AvailableCopies}
                onChange={(e) => setNewBook({ ...newBook, AvailableCopies: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Shelf Location:</label>
              <input
                type="text"
                value={newBook.ShelfLocation}
                onChange={(e) => setNewBook({ ...newBook, ShelfLocation: e.target.value })}
                required
              />
            </div>
            <button type="submit">Confirm</button>
          </form>
          <button onClick={() => setCurrentScreen('home')}>Back to Home</button>
        </div>
      )}

      {currentScreen === 'welcome' && isLoggedIn && (
        <div>
          <h2>Welcome!</h2>
          <p>
            You are logged in as <strong>{userData.FirstName}</strong> with role{' '}
            <strong>{userData.Role}</strong>.
          </p>
          <button onClick={navigateToHome}>Home</button>
        </div>
      )}

      {currentScreen === 'home' && (
        <div>
          <h2>Team 7 Library (Role: {userData.Role})</h2>
          <button onClick={navigateToBooks}>Books</button>
          <button onClick={navigateToLoans}>Loans</button>
          <button onClick={navigateToHolds}>Holds</button>
          {userData.Role === 'Admin' && (
            <button onClick={navigateToAddBook}>Add New Book</button>
          )}
        </div>
      )}

      {currentScreen === 'loans' && (
        <div>
          <h2>Your Loans</h2>
          {loans.length === 0 ? (
            <p>You have no loan history.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Item Type</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Borrowed At</th>
                  <th>Due At</th>
                  <th>Returned At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
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
                      {loan.ReturnedAt
                        ? new Date(loan.ReturnedAt).toLocaleString()
                        : 'Yet to be returned'}
                    </td>
                    <td>
                      <button
                        onClick={() => navigateToReturnConfirmation(loan)}
                        disabled={!!loan.ReturnedAt}
                        style={{
                          backgroundColor: loan.ReturnedAt ? 'gray' : 'red',
                          color: 'white',
                          cursor: loan.ReturnedAt ? 'not-allowed' : 'pointer',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '4px',
                        }}
                      >
                        Return
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button onClick={navigateToHome}>Back to Home</button>
        </div>
      )}

      {currentScreen === 'hold' && selectedBook && (
        <div>
          <h2>Hold Screen</h2>
          <p>You are placing a hold for the book: <strong>{selectedBook.title}</strong></p>
          <p>We will notify you when the book becomes available.</p>
          <button onClick={() => setCurrentScreen('books')}>Back to Books</button>
          <button onClick={handleConfirmHold}>Confirm</button>
        </div>
      )}

      {currentScreen === 'holds' && (
        <div>
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
                  <th>Hold Status</th>
                </tr>
              </thead>
              <tbody>
                {holds.map((hold, index) => (
                  <tr key={index}>
                    <td>{hold.FirstName}</td>
                    <td>{hold.LastName}</td>
                    <td>{hold.Title}</td>
                    <td>{hold.Author}</td>
                    <td>{new Date(hold.RequestAT).toLocaleString()}</td>
                    <td>{hold.HoldStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button onClick={navigateToHome}>Back to Home</button>
        </div>
      )}

      {currentScreen === 'returnConfirmation' && selectedLoan && (
        <div>
          <h2>Return Confirmation</h2>
          <p>
            Are you sure you want to return the item: <strong>{selectedLoan.Title}</strong> by <strong>{selectedLoan.Author}</strong>?
          </p>
          <button onClick={() => setCurrentScreen('loans')}>Cancel</button>
          <button onClick={handleConfirmReturn}>Confirm Return</button>
        </div>
      )}
    </div>
  );
}

export default App;
