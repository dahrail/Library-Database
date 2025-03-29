import React, { useState, useEffect } from 'react';

const BooksNotLoggedIn = ({ onLoginClick }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div className="loading">Loading books...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="books-not-logged-in-container">
      <div className="login-prompt">
        <p>Please <button onClick={onLoginClick} className="login-prompt-button">login</button> to borrow or place holds on books.</p>
      </div>
      
      <h2>Browse Our Book Collection</h2>
      <div className="book-list">
        {books.length === 0 ? (
          <div className="no-books">No books available</div>
        ) : (
          books.map((book) => (
            <div key={book.bookID} className="book-card">
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Genre:</strong> {book.genre}</p>
              <p><strong>Year:</strong> {book.year}</p>
              <p><strong>Available Copies:</strong> {book.copies}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BooksNotLoggedIn;
