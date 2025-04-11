import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import '../../styles/books/Books.css';

const UpdateBookList = ({ navigateToHome, navigateToUpdateBook }) => {
  const [book, setBook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await API.getRawBook();
        if (data.success) {
          setBook(data.book);
        } else {
          setError(data.error || 'Failed to fetch book');
        }
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('An error occurred while fetching book');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, []);

  return (
    <div className="content-container">
      <h2>Update Book</h2>
      {loading ? (
        <p>Loading book...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table className="book-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Publication Year</th>
              <th>Language</th>
              <th>Total Copies</th>
              <th>Available Copies</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {book.map((book) => (
              <tr key={book.BookID}>
                <td>{book.Title}</td>
                <td>{book.Author}</td>
                <td>{book.Genre}</td>
                <td>{book.PublicationYear}</td>
                <td>{book.Language}</td>
                <td>{book.TotalCopies}</td>
                <td>{book.AvailableCopies}</td>
                <td>
                  <button
                    className="btn-primary"
                    onClick={() => navigateToUpdateBook(book)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={navigateToHome} className="btn-secondary">
        Back to Home
      </button>
    </div>
  );
};
export default UpdateBookList;