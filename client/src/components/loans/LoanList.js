import React from 'react';
import '../../styles/loans/Loans.css';

const LoanList = ({ loans, navigateToReturnConfirmation, navigateToHome }) => {
  return (
    <div className="content-container">
      <h2>Your Loans</h2>
      {loans.length === 0 ? (
        <p>You have no loan history.</p>
      ) : (
        <table className="loans-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Item Type</th>
              <th>Title</th>
              <th>Author</th>
              <th>Borrowed At</th>
              <th>Due At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, index) => (
              <tr key={index}>
                <td>{loan.FirstName}</td>
                <td>{loan.LastName}</td>
                <td>{loan.ItemType}</td>
                <td>{loan.Title}</td>
                <td>{loan.Author}</td>
                <td>{new Date(loan.BorrowedAt).toLocaleString()}</td>
                <td>{new Date(loan.DueAT).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => navigateToReturnConfirmation(loan)}
                    className={loan.ReturnedAt ? 'btn-disabled' : 'btn-return'}
                    disabled={!!loan.ReturnedAt}
                  >
                    Return
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={navigateToHome} className="btn-back">Back to Home</button>
    </div>
  );
};

export default LoanList;
