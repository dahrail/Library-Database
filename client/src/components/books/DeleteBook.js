import React from 'react';
import '../../styles/books/Books.css';

const DeleteBook = ({ bookData, onDeleteBook, navigateToHome}) => {
  const handleConfirmDelete = () => {
    onDeleteBook(bookData.BookID);
  };

  const handleDelete = () => {
    onDeleteBook(bookData.BookID);
  };

  return (
    <div className="content-container">
      <h2>Confirm Delete Book</h2>
      <div className="book-details">
        <p><strong>Type:</strong> {bookData.Type}</p>
        <p><strong>Author:</strong> {bookData.Author}</p>
        <p><strong>Genre:</strong> {bookData.Genre}</p>
        <p><strong>Publication Year:</strong> {bookData.PublicationYear}</p>
        <p><strong>Publisher:</strong> {bookData.Publisher}</p>
        <p><strong>Language:</strong> {bookData.Language}</p>
        <p><strong>Format:</strong> {bookData.Format}</p>
        <p><strong>ISBN:</strong> {bookData.ISBN}</p>
        <p><strong>Total Copies:</strong> {bookData.TotalCopies}</p>
        <p><strong>Available Copies:</strong> {bookData.AvailableCopies}</p>
        <p><strong>Shelf Location:</strong> {bookData.ShelfLocation}</p>
      </div>

      <div className="button-group">
        <button onClick={navigateToHome} className="btn-secondary">Cancel</button>
        <button onClick={handleDelete} className="btn-danger">Delete</button>
      </div>
    </div>
  );
};

export default DeleteBook;
