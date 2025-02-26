import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Assuming you have a CSS file for styling

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>Library Management System</h1>
      </div>
      <nav className="navigation">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/books">Books</Link></li>
          <li><Link to="/loans">Loans</Link></li>
          <li><Link to="/holds">Holds</Link></li>
          <li><Link to="/fines">Fines</Link></li>
          <li><Link to="/admin">Admin</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;