import React, { useState } from 'react';
import '../../styles/books/Books.css';

const AddBook = ({ onAddBook, navigateToHome }) => {
  const [newBook, setNewBook] = useState({
    Title: '',
    Author: '',
    Genre: '',
    PublicationYear: '',
    Publisher: '',
    Language: '',
    Format: '',
    ISBN: '',
    TotalCopies: '',
    AvailableCopies: '',
    ShelfLocation: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBook(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddBook(newBook);
  };

  return (
    <div className="content-container">
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit} className="add-book-form">
        <div className="form-row">
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="Title"
              value={newBook.Title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Author:</label>
            <input
              type="text"
              name="Author"
              value={newBook.Author}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Genre:</label>
            <input
              type="text"
              name="Genre"
              value={newBook.Genre}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Publication Year:</label>
            <input
              type="number"
              name="PublicationYear"
              value={newBook.PublicationYear}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Publisher:</label>
            <input
              type="text"
              name="Publisher"
              value={newBook.Publisher}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Language:</label>
            <input
              type="text"
              name="Language"
              value={newBook.Language}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Format:</label>
            <input
              type="text"
              name="Format"
              value={newBook.Format}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>ISBN:</label>
            <input
              type="text"
              name="ISBN"
              value={newBook.ISBN}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Total Copies:</label>
            <input
              type="number"
              name="TotalCopies"
              value={newBook.TotalCopies}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Available Copies:</label>
            <input
              type="number"
              name="AvailableCopies"
              value={newBook.AvailableCopies}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Shelf Location:</label>
          <input
            type="text"
            name="ShelfLocation"
            value={newBook.ShelfLocation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-group">
          <button type="button" onClick={navigateToHome} className="btn-secondary">Back to Home</button>
          <button type="submit" className="btn-primary">Confirm</button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
