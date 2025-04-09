import React from "react";
import "../../styles/loans/Loans.css";

const LoanList = ({ loans, handleReturn, navigateToHome }) => {
  if (!Array.isArray(loans)) {
    return (
      <div className="content-container">
        <h2>Your Loans</h2>
        <p>Unable to display loans. Please try again later.</p>
        <button onClick={navigateToHome} className="btn-back">
          Back to Home
        </button>
      </div>
    );
  }

  // Sort loans by BorrowedAt (newest to oldest)
  const sortedLoans = loans.sort((a, b) => new Date(b.BorrowedAt) - new Date(a.BorrowedAt));

  return (
    <div className="content-container">
      <h2>Your Loans</h2>
      {loans.length === 0 ? (
        <p>You have no loan history.</p>
      ) : (
        <table className="loans-table">
          <thead>
            <tr>
              <th>Item Type</th>
              <th>Title/Model</th>
              <th>Author/Brand</th>
              <th>Borrowed At</th>
              <th>Due At</th>
              <th>Returned At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedLoans.map((loan, index) => (
              <tr key={index}>
                <td>{loan.ItemType}</td> 
                <td>{loan.Title}</td> 
                <td>{loan.AuthorOrBrand}</td> 
                <td>{new Date(loan.BorrowedAt).toLocaleString()}</td>
                <td>{new Date(loan.DueAT).toLocaleString()}</td>
                <td>{loan.ReturnedAt ? new Date(loan.ReturnedAt).toLocaleString() : "Not Returned"}</td>
                <td>
                  <button
                    onClick={() => handleReturn(loan)}
                    className={loan.ReturnedAt ? "btn-disabled" : "btn-return"}
                    disabled={!!loan.ReturnedAt}
                  >
                    {loan.ReturnedAt ? "Returned" : "Return"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={navigateToHome} className="btn-back">
        Back to Home
      </button>
    </div>
  );
};

export default LoanList;
