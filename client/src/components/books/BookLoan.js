import React from 'react';
import '../../styles/books/Books.css';

const BookLoan = ({ selectedBook, userData, handleBorrowBook, navigateToBooks }) => {
  return (
    <div className="content-container">
      <h2>Loan Screen</h2>
      <p>Checking out a loan for book: <strong>{selectedBook.title}</strong></p>
      <p>
        The book will be due in{' '}
        <strong>{userData.Role === 'Student' ? '7 days' : '14 days'}</strong>.
      </p>
      <div className="button-group">
        <button onClick={navigateToBooks} className="btn-secondary">Cancel</button>
        <button onClick={handleBorrowBook} className="btn-primary">Confirm</button>
      </div>
    </div>
  );
};

export default BookLoan;
