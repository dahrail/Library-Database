import React from 'react';
import '../../styles/layout/TopBar.css';

const TopBar = ({ 
  isLoggedIn, 
  userData, 
  handleLogout, 
  navigateToBooks, 
  navigateToBooksNotLoggedIn, 
  navigateToMedia,
  navigateToLogin // Add this prop
}) => {
  return (
    <div className="top-bar">
      <div className="top-bar-content">
        <div 
          className="logo" 
          onClick={navigateToLogin} 
          style={{ cursor: 'pointer' }}
        >
          BookFinder
        </div>
        
        {/* Navigation buttons */}
        <div className="nav-buttons">
          <button 
            onClick={isLoggedIn ? navigateToBooks : navigateToBooksNotLoggedIn}
            className="nav-button"
          >
            Browse & Borrow
          </button>
          <button 
            onClick={navigateToMedia}
            className="nav-button"
          >
            Media
          </button>
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
