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

  // Group loans by type and split into active and returned
  const groupedLoans = loans.reduce((acc, loan) => {
    const type = loan.ItemType || "Other";
    if (!acc[type]) acc[type] = { active: [], returned: [] };
    if (loan.ReturnedAt) {
      acc[type].returned.push(loan);
    } else {
      acc[type].active.push(loan);
    }
    return acc;
  }, {});

  return (
    <div className="content-container">
      <h2>Your Loans</h2>
      {Object.entries(groupedLoans).map(([type, { active, returned }]) => (
        <div key={type}>
          <h3>{type} Loans - Active</h3>
          {active.length > 0 ? (
            <table className="loans-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Borrowed At</th>
                  <th>Due At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {active.map((loan, index) => (
                  <tr key={index}>
                    <td>{loan.Title}</td>
                    <td>{loan.Author}</td>
                    <td>{new Date(loan.BorrowedAt).toLocaleString()}</td>
                    <td>{new Date(loan.DueAT).toLocaleString()}</td>
                    <td>
                      <button
                        onClick={() => handleReturn(loan)}
                        className="btn-return"
                      >
                        Return
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No active {type} loans.</p>
          )}

          <h3>{type} Loan History</h3>
          {returned.length > 0 ? (
            <table className="loans-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Borrowed At</th>
                  <th>Due At</th>
                  <th>Returned At</th>
                </tr>
              </thead>
              <tbody>
                {returned.map((loan, index) => (
                  <tr key={index}>
                    <td>{loan.Title}</td>
                    <td>{loan.Author}</td>
                    <td>{new Date(loan.BorrowedAt).toLocaleString()}</td>
                    <td>{new Date(loan.DueAT).toLocaleString()}</td>
                    <td>{new Date(loan.ReturnedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No returned {type} loans.</p>
          )}
          <hr />
        </div>
      ))}
      <button onClick={navigateToHome} className="btn-back">
        Back to Home
      </button>
    </div>
  );
};

export default LoanList;
