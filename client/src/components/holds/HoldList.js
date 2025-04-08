import React from 'react';
import '../../styles/holds/Holds.css';

const HoldList = ({ holds, navigateToHome }) => {
  return (
    <div className="content-container">
      <h2>Your Holds</h2>
      {holds.length === 0 ? (
        <p>You have no active holds.</p>
      ) : (
        <table className="holds-table">
          <thead>
            <tr>
              <th>Item Type</th> {/* Add this for ItemType */}
              <th>Title/Model</th>
              <th>Author/Brand</th>
              <th>Requested At</th>
              <th>Hold Status</th>
            </tr>
          </thead>
          <tbody>
            {holds.map((hold, index) => (
              <tr key={index}>
                <td>{hold.ItemType}</td> {/* Display the ItemType here */}
                <td>{hold.Title}</td> {/* Title will vary based on ItemType */}
                <td>{hold.AuthorOrBrand}</td> {/* Author for books/media, Brand for devices */}
                <td>{new Date(hold.RequestAT).toLocaleString()}</td>
                <td>{hold.HoldStatus}</td>
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
