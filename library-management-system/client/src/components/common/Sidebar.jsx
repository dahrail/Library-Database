import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Assuming you have a CSS file for styling

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Library Management</h2>
      <ul>
        <li>
          <Link to="/books">Books</Link>
        </li>
        <li>
          <Link to="/loans">Loans</Link>
        </li>
        <li>
          <Link to="/holds">Holds</Link>
        </li>
        <li>
          <Link to="/fines">Fines</Link>
        </li>
        <li>
          <Link to="/admin/dashboard">Admin Dashboard</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;