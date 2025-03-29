import React, { useState } from 'react';
import { format } from 'date-fns';

const ReturnConfirmation = ({ loan, onCancel, onConfirm }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirmReturn = async () => {
    if (!loan || !loan.LoanID) {
      setError('Invalid loan information');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/confirmReturn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          LoanID: loan.LoanID
        }),
      });

      const data = await response.json();

      if (data.success) {
        onConfirm();
      } else {
        setError(data.error || 'Failed to process return');
      }
    } catch (err) {
      setError('An error occurred while processing your request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  return (
    <div className="return-confirmation-container">
      <h2>Confirm Book Return</h2>
      <div className="loan-details">
        <h3>{loan?.Title}</h3>
        <p><strong>Author:</strong> {loan?.Author}</p>
        <p><strong>Borrowed On:</strong> {formatDate(loan?.BorrowedAt)}</p>
        <p><strong>Due Date:</strong> {formatDate(loan?.DueAT)}</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="confirmation-buttons">
        <button 
          onClick={onCancel}
          className="cancel-button"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button 
          onClick={handleConfirmReturn}
          className="confirm-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Return'}
        </button>
      </div>
    </div>
  );
};

export default ReturnConfirmation;
