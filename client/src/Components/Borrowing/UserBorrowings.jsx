import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserBorrowings() {
  const [borrowings, setBorrowings] = useState([]);
  const userId = localStorage.getItem('userId'); // Assuming user ID is stored in local storage

  useEffect(() => {
    const fetchBorrowings = async () => {
      try {
        const response = await axios.get(`/api/borrowings/user/${userId}`);
        setBorrowings(response.data);
      } catch (error) {
        console.error('Error fetching borrowings:', error);
      }
    };

    fetchBorrowings();
  }, [userId]);

  return (
    <div className="container">
      <h2>Your Borrowed Items</h2>
      {borrowings.length === 0 ? (
        <p>You have not borrowed any items.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Item Name</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {borrowings.map((borrowing) => (
              <tr key={borrowing.id}>
                <td>{borrowing.itemId}</td>
                <td>{borrowing.itemName}</td>
                <td>{new Date(borrowing.borrowDate).toLocaleDateString()}</td>
                <td>{new Date(borrowing.dueDate).toLocaleDateString()}</td>
                <td>{borrowing.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserBorrowings;