import React, { useState } from 'react';

const BookHold = ({ book, user, onCancel, onConfirm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirmHold = async () => {
    if (!user || !book) {
      setError('Missing user or book information');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/confirmHold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserID: user.UserID,
          ItemType: 'Book',
          ItemID: book.bookID
        }),
      });

      const data = await response.json();

      if (data.success) {
        onConfirm();
      } else {
        setError(data.error || 'Failed to place hold');
      }
    } catch (err) {
      setError('An error occurred while processing your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="book-hold-container">
      <h2>Confirm Hold Request</h2>
      <div className="book-details">
        <h3>{book?.title}</h3>
        <p><strong>Author:</strong> {book?.author}</p>
      </div>

      <p className="hold-info">
        You're placing a hold on this book. You'll be notified when it becomes available.
      </p>

      {error && <div className="error-message">{error}</div>}

      <div className="hold-buttons">
        <button 
          onClick={onCancel}
          className="cancel-button"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          onClick={handleConfirmHold}
          className="confirm-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Hold'}
        </button>
      </div>
    </div>
  );
};

export default BookHold;
