import React from 'react';

const Welcome = ({ onLoginClick, onRegisterClick, onBrowseBooksClick }) => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <h1>Welcome to Our Library System</h1>
        <p>Your gateway to knowledge and discovery</p>
        
        <div className="welcome-buttons">
          <button 
            className="welcome-button primary-button" 
            onClick={onLoginClick}
          >
            Login
          </button>
          <button 
            className="welcome-button secondary-button" 
            onClick={onRegisterClick}
          >
            Register
          </button>
          <button 
            className="welcome-button tertiary-button" 
            onClick={onBrowseBooksClick}
          >
            Browse Books
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
