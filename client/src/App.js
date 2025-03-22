import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure CSS is imported

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null); // Store logged-in user's details
  const [currentScreen, setCurrentScreen] = useState('login'); // Track the current screen ('login', 'welcome', 'home', 'books')
  const [books, setBooks] = useState([]); // Store the list of books
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
    ShelfLocation: '' // Add ShelfLocation field
  });
  const [newUser, setNewUser] = useState({
    Username: '',
    Password: '',
    FirstName: '',
    LastName: '',
    Email: '',
    PhoneNumber: ''
  });
  const [selectedBook, setSelectedBook] = useState(null); // Store the selected book
  const [loans, setLoans] = useState([]); // Store the list of loans
  const [holds, setHolds] = useState([]); // Store the list of holds
  const [selectedLoan, setSelectedLoan] = useState(null); // Store the selected loan

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true); // Set login state to true
        setUserData(data.user); // Store user details, including UserID
        setCurrentScreen('welcome'); // Navigate to the welcome screen
      } else {
        alert(data.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred while logging in.');
    }
  };

  const navigateToHome = () => {
    setCurrentScreen('home'); // Navigate to the home screen
  };

  const navigateToWelcome = () => {
    setCurrentScreen('welcome'); // Navigate back to the welcome screen
  };

  const navigateToBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const data = await response.json();
      console.log("Books received from backend:", data); // Log the data
      setBooks(data); // Store the books in state
      setCurrentScreen('books'); // Navigate to the books screen
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleLoan = (book) => {
    setSelectedBook(book); // Store the selected book
    setCurrentScreen('loan'); // Navigate to the loan screen
  };

  const navigateToAddBook = () => {
    setCurrentScreen('addBook'); // Navigate to the add book screen
  };

  const navigateToRegister = () => {
    setCurrentScreen('register'); // Navigate to the register screen
  };

  const navigateToLoans = async () => {
    try {
      const response = await fetch(`/api/loans/${userData.UserID}`);
      const data = await response.json();

      if (data.success) {
        setLoans(data.loans); // Store the loans in state
        setCurrentScreen('loans'); // Navigate to the loans screen
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
        setHolds(data.holds); // Store the holds in state
        setCurrentScreen('holds'); // Navigate to the holds screen
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
        setCurrentScreen('home'); // Navigate back to the home screen
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
          PhoneNumber: fullPhoneNumber, // Send the combined phone number
          Role: 'Student' // Add Role as 'Student'
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Registration successful!');
        setCurrentScreen('login'); // Navigate back to the login screen
      } else {
        alert('Failed to register: ' + data.error);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert('An error occurred while registering.');
    }
  };

  const handleConfirmLoan = async () => {
    console.log("Confirming loan for BookID:", selectedBook.bookID); // Log the BookID
    console.log("UserID being sent:", userData.UserID); // Log the UserID
    try {
      const response = await fetch('/api/confirmLoan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          BookID: selectedBook.bookID,
          UserID: userData.UserID, // Send the UserID
          Role: userData.Role // Send the Role
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Loan confirmed successfully!');
        setCurrentScreen('home'); // Navigate back to the home screen
      } else {
        alert('Failed to confirm loan: ' + data.error);
      }
    } catch (error) {
      console.error('Error confirming loan:', error);
      alert('An error occurred while confirming the loan.');
    }
  };

  const navigateToHold = (book) => {
    setSelectedBook(book); // Store the selected book
    setCurrentScreen('hold'); // Navigate to the hold screen
  };

  const handleConfirmHold = async () => {
    try {
      const response = await fetch('/api/confirmHold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          UserID: userData.UserID, // Send UserID from userData
          ItemType: 'Book', // Set ItemType to "Book"
          ItemID: selectedBook.bookID, // Send the selected BookID
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert('Hold placed successfully!');
        setCurrentScreen('books'); // Navigate back to the books screen
      } else {
        alert('Failed to place hold: ' + data.error);
      }
    } catch (error) {
      console.error('Error placing hold:', error);
      alert('An error occurred while placing the hold.');
    }
  };

  return (
    <div className="app-container">
      {/* Show TopBar on all screens */}
      <TopBar />
      
      {currentScreen === 'login' && (
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
              <button type="submit" className="btn btn-primary">Login</button>
              <button type="button" onClick={navigateToRegister} className="btn btn-secondary">Register</button>
            </div>
          </form>
        </div>
      )}

      {currentScreen === 'welcome' && isLoggedIn && (
        <div className="content-container">
          <h2>Welcome!</h2>
          <p>
            You are logged in as <strong>{userData.FirstName}</strong> with role{' '}
            <strong>{userData.Role}</strong>.
          </p>
          <button onClick={navigateToHome}>Home</button>
        </div>
      )}

      {currentScreen === 'home' && (
        <div className="content-container">
          <h2>Team 7 Library (Role: {userData.Role})</h2>
          <button onClick={navigateToBooks}>Books</button>
          <button onClick={navigateToLoans}>Loans</button>
          <button onClick={navigateToHolds}>Holds</button>
          {userData.Role === 'Admin' && (
            <button onClick={navigateToAddBook}>Add New Book</button>
          )}
        </div>
      )}

      {currentScreen === 'books' && (
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
                          backgroundColor: 'blue',
                          color: 'white',
                          cursor: 'pointer',
                        }}
                      >
                        Loan
                      </button>
                    ) : (
                      <button
                        onClick={() => navigateToHold(book)} // Navigate to the hold page
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
        <div className="content-container">
          <h2>Loan Screen</h2>
          <p>Checking out a loan for book: <strong>{selectedBook.title}</strong></p>
          <p>
            The book will be due in{' '}
            <strong>{userData.Role === 'Student' ? '7 days' : '14 days'}</strong>.
          </p>
          <button onClick={() => setCurrentScreen('books')}>Back to Books</button>
          <button onClick={handleConfirmLoan}>Confirm</button> {/* Add Confirm button */}
        </div>
      )}

      {currentScreen === 'addBook' && (
        <div className="content-container">
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

      {currentScreen === 'register' && (
        <div className="content-container">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={newUser.Username}
                onChange={(e) => setNewUser({ ...newUser, Username: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={newUser.Password}
                onChange={(e) => setNewUser({ ...newUser, Password: e.target.value })}
                required
              />
            </div>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                value={newUser.FirstName}
                onChange={(e) => setNewUser({ ...newUser, FirstName: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                value={newUser.LastName}
                onChange={(e) => setNewUser({ ...newUser, LastName: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={newUser.Email}
                onChange={(e) => setNewUser({ ...newUser, Email: e.target.value })}
                required
              />
            </div>
            <div>
              <label>Phone Number:</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  maxLength="3"
                  value={newUser.PhonePart1 || ''}
                  onChange={(e) => setNewUser({ ...newUser, PhonePart1: e.target.value })}
                  required
                  style={{ width: '50px', marginRight: '5px' }}
                />
                -
                <input
                  type="text"
                  maxLength="3"
                  value={newUser.PhonePart2 || ''}
                  onChange={(e) => setNewUser({ ...newUser, PhonePart2: e.target.value })}
                  required
                  style={{ width: '50px', margin: '0 5px' }}
                />
                -
                <input
                  type="text"
                  maxLength="4"
                  value={newUser.PhonePart3 || ''}
                  onChange={(e) => setNewUser({ ...newUser, PhonePart3: e.target.value })}
                  required
                  style={{ width: '70px', marginLeft: '5px' }}
                />
              </div>
            </div>
            <button type="submit">Confirm</button>
          </form>
          <button onClick={() => setCurrentScreen('login')}>Back to Login</button>
        </div>
      )}

      {currentScreen === 'loans' && (
        <div className="content-container">
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
                  <th>Returned At</th> {/* New column for ReturnedAt */}
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
                        ? new Date(loan.ReturnedAt).toLocaleString() // Display the datetime if ReturnedAt is not null
                        : 'Yet to be returned'} {/* Display "Yet to be returned" if null */}
                    </td>
                    <td>
                      <button
                        onClick={() => navigateToReturnConfirmation(loan)}
                        disabled={!!loan.ReturnedAt} // Disable the button if ReturnedAt is not null
                        style={{
                          backgroundColor: loan.ReturnedAt ? 'gray' : 'red', // Gray if returned, red otherwise
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
        <div className="content-container">
          <h2>Hold Screen</h2>
          <p>You are placing a hold for the book: <strong>{selectedBook.title}</strong></p>
          <p>We will notify you when the book becomes available.</p>
          <button onClick={() => setCurrentScreen('books')}>Back to Books</button>
          <button onClick={handleConfirmHold}>Confirm</button> {/* Add Confirm button */}
        </div>
      )}

      {currentScreen === 'holds' && (
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
                    <td>{new Date(hold.RequestAT).toLocaleString()}</td> {/* Correctly parse and format the date */}
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
          <button onClick={() => setCurrentScreen('loans')}>Cancel</button> {/* Cancel button first */}
          <button onClick={handleConfirmReturn}>Confirm Return</button> {/* Confirm button second */}
        </div>
      )}
    </div>
  );
}

export default App;
