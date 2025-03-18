import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Assuming you have a CSS file for styling

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>Library Management System</h1>
      </div>
      <hr className="divider" /> {/* Add this line for the divider */}
      <nav className="navigation">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/books">Books</Link></li>
          <li><Link to="/borrowings">Borrowings</Link></li>
          <li><Link to="/reports">Reports</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;