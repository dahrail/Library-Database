import React, { useState } from 'react';
import './App.css';

// Import components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Welcome from './components/home/Welcome';
import Home from './components/home/Home';
import BookList from './components/books/BookList';
import BookLoan from './components/books/BookLoan';
import BookHold from './components/books/BookHold';
import AddBook from './components/books/AddBook';
import LoanList from './components/loans/LoanList';
import ReturnConfirmation from './components/loans/ReturnConfirmation';
import HoldList from './components/holds/HoldList';
import FineList from './components/fines/FineList';
import TopBar from './components/layout/TopBar';

// Import API service
import API from './services/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loans, setLoans] = useState([]);
  const [holds, setHolds] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [fines, setFines] = useState([]);
  const [reportData, setReportData] = useState(null); // State to store query results

  // Login handler
  const handleLogin = async (email, password) => {
    try {
      const data = await API.login(email, password);

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
  const navigateToAddBook = () => setCurrentScreen('addBook');
  const navigateToDataReport = () => setCurrentScreen('dataReport');

  // Books navigation and handlers
  const navigateToBooks = async () => {
    try {
      const data = await API.getBooks(userData.UserID);
      setBooks(data);
      setCurrentScreen('books');
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('An error occurred while fetching books.');
    }
  };

  const handleLoan = (book) => {
    setSelectedBook(book);
    setCurrentScreen('loan');
  };

  const navigateToHold = (book) => {
    setSelectedBook(book);
    setCurrentScreen('hold');
  };

  // Loans navigation and handlers
  const navigateToLoans = async () => {
    try {
      const data = await API.getLoans(userData.UserID);
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

  const navigateToReturnConfirmation = (loan) => {
    setSelectedLoan(loan);
    setCurrentScreen('returnConfirmation');
  };

  // Holds navigation
  const navigateToHolds = async () => {
    try {
      const data = await API.getHolds(userData.UserID);
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

  // Fines navigation
  const navigateToFines = async () => {
    try {
      const data = await API.getFines(userData.UserID);
      if (data.success) {
        setFines(data.fines);
        setCurrentScreen('fines');
      } else {
        alert('Failed to fetch fines: ' + data.error);
      }
    } catch (error) {
      console.error('Error fetching fines:', error);
      alert('An error occurred while fetching fines.');
    }
  };

  // Action handlers
  const handleRegister = async (userData) => {
    try {
      const data = await API.register(userData);
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

  const handleAddBook = async (bookData) => {
    try {
      const data = await API.addBook(bookData);
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

  const handleConfirmLoan = async () => {
    try {
      const data = await API.confirmLoan(selectedBook.bookID, userData.UserID, userData.Role);
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

  const handleConfirmHold = async () => {
    try {
      const data = await API.confirmHold(userData.UserID, selectedBook.bookID);
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

  const handleConfirmReturn = async () => {
    try {
      const data = await API.confirmReturn(selectedLoan.LoanID);
      if (data.success) {
        alert(`The item "${selectedLoan.Title}" has been successfully returned.`);
        setCurrentScreen('home');
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
      <TopBar isLoggedIn={isLoggedIn} userData={userData} handleLogout={handleLogout} />
      
      {/* Render the appropriate screen based on currentScreen state */}
      {currentScreen === 'login' && (
        <Login onLogin={handleLogin} navigateToRegister={navigateToRegister} />
      )}

      {currentScreen === 'register' && (
        <Register onRegister={handleRegister} navigateToLogin={navigateToLogin} />
      )}

      {currentScreen === 'welcome' && isLoggedIn && (
        <Welcome userData={userData} navigateToHome={navigateToHome} />
      )}

      {currentScreen === 'home' && (
        <Home 
          userData={userData} 
          navigateToBooks={navigateToBooks} 
          navigateToLoans={navigateToLoans} 
          navigateToHolds={navigateToHolds} 
          navigateToFines={navigateToFines} 
          navigateToAddBook={navigateToAddBook} 
          navigateToDataReport={navigateToDataReport} // Pass the function
        />
      )}

      {currentScreen === 'books' && (
        <BookList 
          books={books} 
          handleLoan={handleLoan} 
          navigateToHold={navigateToHold} 
          navigateToHome={navigateToHome} 
        />
      )}

      {currentScreen === 'loan' && selectedBook && (
        <BookLoan 
          selectedBook={selectedBook} 
          userData={userData} 
          handleConfirmLoan={handleConfirmLoan} 
          navigateToBooks={() => setCurrentScreen('books')} 
        />
      )}

      {currentScreen === 'hold' && selectedBook && (
        <BookHold 
          selectedBook={selectedBook} 
          handleConfirmHold={handleConfirmHold} 
          navigateToBooks={() => setCurrentScreen('books')} 
        />
      )}

      {currentScreen === 'addBook' && (
        <AddBook 
          onAddBook={handleAddBook} 
          navigateToHome={navigateToHome} 
        />
      )}

      {currentScreen === 'loans' && (
        <LoanList 
          loans={loans} 
          navigateToReturnConfirmation={navigateToReturnConfirmation} 
          navigateToHome={navigateToHome} 
        />
      )}

      {currentScreen === 'returnConfirmation' && selectedLoan && (
        <ReturnConfirmation 
          selectedLoan={selectedLoan} 
          handleConfirmReturn={handleConfirmReturn} 
          navigateToLoans={() => setCurrentScreen('loans')} 
        />
      )}

      {currentScreen === 'holds' && (
        <HoldList 
          holds={holds} 
          navigateToHome={navigateToHome} 
        />
      )}

      {currentScreen === 'fines' && (
        <FineList 
          fines={fines} 
          navigateToHome={navigateToHome} 
        />
      )}

      {currentScreen === 'dataReport' && (
        <div className="content-container">
          <h2>Data Reports</h2>
          <p>Select a report to view:</p>

          {/* Buttons for reports */}
          <div className="button-group">
            <button
              onClick={async () => {
                try {
                  const response = await fetch('/api/dataReport');
                  const data = await response.json();

                  if (data.success) {
                    setReportData(data.data); // Store the query results in state
                  } else {
                    alert('Failed to load books report: ' + data.error);
                  }
                } catch (error) {
                  console.error('Error loading books report:', error);
                  alert('An error occurred while loading the books report.');
                }
              }}
              className="btn-primary"
            >
              Load Books Report
            </button>

            {/* Fines Report button (only for admins and faculty) */}
            {(userData.Role === 'Admin' || userData.Role === 'Faculty') && (
              <button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/fineReport');
                    const data = await response.json();

                    if (data.success) {
                      setReportData(data.data); // Store the query results in state
                    } else {
                      alert('Failed to load fines report: ' + data.error);
                    }
                  } catch (error) {
                    console.error('Error loading fines report:', error);
                    alert('An error occurred while loading the fines report.');
                  }
                }}
                className="btn-primary"
              >
                Load Fines Report
              </button>
            )}
          </div>

          {/* Display the selected report only if reportData is available */}
          {reportData && reportData.length > 0 && (
            <div className="table-container">
              <table className="data-report-table">
                <thead>
                  <tr>
                    {Object.keys(reportData[0]).map((key, index) => (
                      <th key={index}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((value, colIndex) => (
                        <td key={colIndex}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button onClick={navigateToHome} className="btn-back">Back to Home</button>
        </div>
      )}
    </div>
  );
}

export default App;
