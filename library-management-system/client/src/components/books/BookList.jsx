import React, { useEffect, useState } from 'react';
import { getBooks } from '../../services/bookService';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Available Books</h1>
      <ul>
        {books.map((book) => (
          <li key={book.BookID}>
            <h2>{book.Title}</h2>
            <p>Author: {book.AuthorCreator}</p>
            <p>Genre: {book.Genre}</p>
            <p>Publication Year: {book.PublicationYear}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;