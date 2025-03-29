import React, { useState } from 'react';

const BookLoan = ({ book, user, onCancel, onConfirm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirmLoan = async () => {
    if (!user || !book) {
      setError('Missing user or book information');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/confirmLoan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BookID: book.bookID,
          UserID: user.UserID,
          Role: user.Role
        }),
      });

      const data = await response.json();

      if (data.success) {
        onConfirm();
      } else {
        setError(data.error || 'Failed to loan book');
      }
    } catch (err) {
      setError('An error occurred while processing your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="book-loan-container">
      <h2>Confirm Book Loan</h2>
      <div className="book-details">
        <h3>{book?.title}</h3>
        <p><strong>Author:</strong> {book?.author}</p>
        <p><strong>Available Copies:</strong> {book?.copies}</p>
      </div>

      <div className="loan-terms">
        <p>Loan Period: {user?.Role === 'Student' ? '7 days' : '14 days'}</p>
        <p>Due Date: {new Date(Date.now() + (user?.Role === 'Student' ? 7 : 14) * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="loan-buttons">
        <button 
          onClick={onCancel}
          className="cancel-button"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          onClick={handleConfirmLoan}
          className="confirm-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Loan'}
        </button>
      </div>
    </div>
  );
};

export default BookLoan;
