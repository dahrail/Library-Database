import React, { useState } from 'react';

const AddBook = ({ onBookAdded, onCancel }) => {
  const [bookData, setBookData] = useState({
    BookID: '',
    Title: '',
    Author: '',
    Genre: '',
    PublicationYear: '',
    Publisher: '',
    Language: 'English',
    Format: 'Hardcover',
    ISBN: '',
    BookInventoryID: '',
    TotalCopies: 1,
    AvailableCopies: 1,
    ShelfLocation: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/addBook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      const data = await response.json();

      if (data.success) {
        onBookAdded();
      } else {
        setError(data.error || 'Failed to add book');
      }
    } catch (err) {
      setError('An error occurred while processing your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-book-container">
      <h2>Add New Book</h2>
      <form onSubmit={handleSubmit} className="add-book-form">
        <div className="form-row">
          <div className="form-group">
            <label>Book ID</label>
            <input
              type="text"
              name="BookID"
              value={bookData.BookID}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Inventory ID</label>
            <input
              type="text"
              name="BookInventoryID"
              value={bookData.BookInventoryID}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="Title"
            value={bookData.Title}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Author</label>
          <input
            type="text"
            name="Author"
            value={bookData.Author}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Genre</label>
            <input
              type="text"
              name="Genre"
              value={bookData.Genre}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Publication Year</label>
            <input
              type="number"
              name="PublicationYear"
              value={bookData.PublicationYear}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Publisher</label>
            <input
              type="text"
              name="Publisher"
              value={bookData.Publisher}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>ISBN</label>
            <input
              type="text"
              name="ISBN"
              value={bookData.ISBN}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Language</label>
            <select
              name="Language"
              value={bookData.Language}
              onChange={handleChange}
              className="form-input"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Format</label>
            <select
              name="Format"
              value={bookData.Format}
              onChange={handleChange}
              className="form-input"
            >
              <option value="Hardcover">Hardcover</option>
              <option value="Paperback">Paperback</option>
              <option value="E-book">E-book</option>
              <option value="Audiobook">Audiobook</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Total Copies</label>
            <input
              type="number"
              name="TotalCopies"
              value={bookData.TotalCopies}
              onChange={handleChange}
              required
              min="1"
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Available Copies</label>
            <input
              type="number"
              name="AvailableCopies"
              value={bookData.AvailableCopies}
              onChange={handleChange}
              required
              min="0"
              max={bookData.TotalCopies}
              className="form-input"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Shelf Location</label>
          <input
            type="text"
            name="ShelfLocation"
            value={bookData.ShelfLocation}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-buttons">
          <button 
            type="button" 
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding Book...' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
