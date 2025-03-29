import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const LoanList = ({ user, onReturnBook }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      if (!user || !user.UserID) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/loans/${user.UserID}`);
        if (!response.ok) {
          throw new Error('Failed to fetch loans');
        }
        const data = await response.json();
        
        if (data.success) {
          setLoans(data.loans);
        } else {
          throw new Error(data.error || 'Failed to fetch loans');
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLoans();
  }, [user]);

  if (loading) return <div className="loading">Loading loans...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const activeLoans = loans.filter(loan => !loan.ReturnedAt);
  const pastLoans = loans.filter(loan => loan.ReturnedAt);

  return (
    <div className="loan-list-container">
      <h2>My Loans</h2>
      
      <div className="loan-section">
        <h3>Current Loans</h3>
        {activeLoans.length === 0 ? (
          <p className="no-loans">You don't have any active loans.</p>
        ) : (
          <div className="loan-cards">
            {activeLoans.map((loan) => (
              <div key={loan.LoanID} className="loan-card">
                <h4>{loan.Title}</h4>
                <p><strong>Author:</strong> {loan.Author}</p>
                <p><strong>Borrowed:</strong> {formatDate(loan.BorrowedAt)}</p>
                <p><strong>Due:</strong> {formatDate(loan.DueAT)}</p>
                <button 
                  onClick={() => onReturnBook(loan)}
                  className="return-button"
                >
                  Return Book
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="loan-section">
        <h3>Past Loans</h3>
        {pastLoans.length === 0 ? (
          <p className="no-loans">You don't have any past loans.</p>
        ) : (
          <div className="loan-cards">
            {pastLoans.map((loan) => (
              <div key={loan.LoanID} className="loan-card past-loan">
                <h4>{loan.Title}</h4>
                <p><strong>Author:</strong> {loan.Author}</p>
                <p><strong>Borrowed:</strong> {formatDate(loan.BorrowedAt)}</p>
                <p><strong>Returned:</strong> {formatDate(loan.ReturnedAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanList;
