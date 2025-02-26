import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getLoanHistory } from '../../services/loanService';

const LoanHistory = () => {
  const { user } = useContext(AuthContext);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoanHistory = async () => {
      try {
        const response = await getLoanHistory(user.UserID);
        setLoans(response.data);
      } catch (err) {
        setError('Failed to fetch loan history');
      } finally {
        setLoading(false);
      }
    };

    fetchLoanHistory();
  }, [user.UserID]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Loan History</h2>
      <table>
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Item Type</th>
            <th>Borrowed At</th>
            <th>Due At</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan.LoanID}>
              <td>{loan.ItemID}</td>
              <td>{loan.LoanType}</td>
              <td>{new Date(loan.BorrowedAt).toLocaleString()}</td>
              <td>{new Date(loan.DueAt).toLocaleString()}</td>
              <td>{loan.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LoanHistory;