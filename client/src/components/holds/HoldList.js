import React from 'react';
import '../../styles/holds/Holds.css';

const HoldList = ({ holds, handleCancelHold, navigateToHome }) => {
  // Sort holds by RequestAT (newest to oldest)
  const sortedHolds = holds.sort((a, b) => new Date(b.RequestAT) - new Date(a.RequestAT));

  return (
    <div className="content-container">
      <h2>Your Holds</h2>
      {holds.length === 0 ? (
        <p>You have no active holds.</p>
      ) : (
        <table className="holds-table">
          <thead>
            <tr>
              <th>Item Type</th>
              <th>Title/Model</th>
              <th>Author/Brand</th>
              <th>Requested At</th>
              <th>Hold Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedHolds.map((hold, index) => (
              <tr key={index}>
                <td>{hold.ItemType}</td>
                <td>{hold.Title}</td>
                <td>{hold.AuthorOrBrand}</td>
                <td>{new Date(hold.RequestAT).toLocaleString()}</td>
                <td>{hold.HoldStatus}</td>
                <td>
                  <button
                    onClick={() => handleCancelHold(hold)}
                    className={hold.HoldStatus === "Pending" ? "btn-cancel" : "btn-disabled"}
                    disabled={hold.HoldStatus !== "Pending"}
                  >
                    Cancel
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

export default HoldList;
