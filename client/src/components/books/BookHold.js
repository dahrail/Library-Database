import React from 'react';
import '../../styles/books/Books.css';

const BookHold = ({ selectedBook, handleConfirmHold, navigateToBooks }) => {
  return (
    <div className="content-container">
      <h2>Hold Screen</h2>
      <p>You are placing a hold for the book: <strong>{selectedBook.title}</strong></p>
      <p>We will notify you when the book becomes available.</p>
      <div className="button-group">
        <button onClick={navigateToBooks} className="btn-secondary">Back to Books</button>
        <button onClick={handleConfirmHold} className="btn-primary">Confirm</button>
      </div>
    </div>
  );
};

export default BookHold;
