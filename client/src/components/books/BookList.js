import React from 'react';
import '../../styles/books/Books.css';

const BookList = ({ books, handleLoan, navigateToHold, navigateToHome }) => {
  return (
    <div className="content-container">
      <h2>Books</h2>
      <table className="book-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Year</th>
            <th>Available Copies</th>
            <th>Loan</th>
            <th>Hold</th>
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
                <button
                  onClick={() => handleLoan(book)}
                  disabled={
                    book.copies === 0 || 
                    (book.otherUserHasHold && !book.userHasHold)
                  }
                  className={
                    book.copies === 0 || (book.otherUserHasHold && !book.userHasHold)
                      ? 'btn-disabled'
                      : 'btn-loan'
                  }
                >
                  Loan
                </button>
              </td>
              <td>
                <button
                  onClick={() => book.copies === 0 && navigateToHold(book)}
                  disabled={book.copies > 0}
                  className={book.copies > 0 ? 'btn-disabled' : 'btn-hold'}
                >
                  Hold
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={navigateToHome} className="btn-back">Back to Home</button>
    </div>
  );
};

export default BookList;
