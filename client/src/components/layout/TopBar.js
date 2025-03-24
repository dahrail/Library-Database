import React from 'react';
import '../../styles/layout/TopBar.css';

const TopBar = ({ isLoggedIn, userData, handleLogout }) => {
  return (
    <div className="top-bar">
      <div className="top-bar-content">
        <div className="logo">BookFinder</div>
        
        {/* Navigation buttons */}
        <div className="nav-buttons">
          <button className="nav-button">Browse & Borrow (WIP)</button>
          <button className="nav-button">Media (WIP)</button>
          <button className="nav-button">Electronics (WIP)</button>
          <button className="nav-button">Events (WIP)</button>
        </div>
        
        {isLoggedIn && userData && (
          <div className="user-info">
            <span>Hello, {userData.FirstName}</span>
            <button 
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
