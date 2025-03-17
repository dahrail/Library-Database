import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-links">
        <h2>Manage Library</h2>
        <ul>
          <li>
            <Link to="/books">View Books</Link>
          </li>
          <li>
            <Link to="/books/add">Add New Book</Link>
          </li>
          <li>
            <Link to="/reports/fines">View Fine Reports</Link>
          </li>
          <li>
            <Link to="/reports/inventory">View Inventory Reports</Link>
          </li>
          <li>
            <Link to="/reports/borrowings">View Borrowing Reports</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;