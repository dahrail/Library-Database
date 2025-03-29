import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const FineList = ({ user }) => {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This is a placeholder since the backend endpoint isn't implemented yet
  useEffect(() => {
    // Simulate loading fines data
    setTimeout(() => {
      setFines([
        // Sample data - would come from actual API in production
        {
          fineID: 1,
          amount: 5.00,
          reason: 'Late return',
          dateIssued: '2023-11-01',
          status: 'Unpaid',
          bookTitle: 'The Great Gatsby'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [user]);

  if (loading) return <div className="loading">Loading fines...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const formatAmount = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="fine-list-container">
      <h2>My Fines</h2>
      
      {fines.length === 0 ? (
        <p className="no-fines">You don't have any fines.</p>
      ) : (
        <div className="fine-list">
          <table className="fines-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Reason</th>
                <th>Date Issued</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fines.map((fine) => (
                <tr key={fine.fineID}>
                  <td>{fine.bookTitle}</td>
                  <td>{fine.reason}</td>
                  <td>{formatDate(fine.dateIssued)}</td>
                  <td>{formatAmount(fine.amount)}</td>
                  <td>{fine.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FineList;
