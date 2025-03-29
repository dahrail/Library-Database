import React from 'react';
import '../../styles/home/LandingPage.css';

const LandingPage = ({ navigateToLogin, navigateToRegister }) => {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">Welcome to BookFinder</h1>
        <h2 className="landing-subtitle">Your University Library Portal</h2>
        
        <div className="feature-section">
          <div className="feature">
            <i className="feature-icon book-icon"></i>
            <h3>Extensive Collection</h3>
            <p>Access thousands of books, journals, and digital resources for your academic needs.</p>
          </div>
          
          <div className="feature">
            <i className="feature-icon search-icon"></i>
            <h3>Easy Search</h3>
            <p>Find exactly what you need with our powerful search and filtering tools.</p>
          </div>
          
          <div className="feature">
            <i className="feature-icon borrow-icon"></i>
            <h3>Simple Borrowing</h3>
            <p>Borrow books with just a few clicks and manage your loans online.</p>
          </div>
        </div>
        
        <div className="cta-section">
          <button onClick={navigateToRegister} className="cta-button">Create Account</button>
          <p className="cta-subtext">Already have an account? <button onClick={navigateToLogin} className="text-link">Sign in</button></p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
