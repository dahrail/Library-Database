import React from 'react';
import '../../styles/fines/Fines.css';

const FineList = ({ fines, navigateToHome, navigateToPayFine }) => {
  return (
    <div className="content-container">
      <h2>Your Fines</h2>
      {fines.length === 0 ? (
        <p>You have no fines.</p>
      ) : (
        <table className="fines-table">
          <thead>
            <tr>
              <th>Item Type</th>
              <th>Title</th>
              <th>Author</th>
              <th>Borrowed At</th>
              <th>Due At</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fines.map((fine, index) => (
              <tr key={index}>
                <td>{fine.ItemType}</td>
                <td>{fine.Title}</td>
                <td>{fine.Author}</td>
                <td>{new Date(fine.BorrowedAt).toLocaleString()}</td>
                <td>{new Date(fine.DueAT).toLocaleString()}</td>
                <td>${parseFloat(fine.Amount).toFixed(2)}</td>
                <td>{fine.Status}</td>
                <td>
                  {fine.Status === "Paid" ? (
                    <button disabled style={{ opacity: 0.5, cursor: "not-allowed" }}>
                      Paid
                    </button>
                  ) : (
                    <button onClick={() => navigateToPayFine(fine)}>
                      Pay Fine
                    </button>
                  )}
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

export default FineList;
