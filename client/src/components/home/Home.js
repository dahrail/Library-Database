import React from 'react';

const Home = ({ user, onBrowseBooks, onViewLoans, onViewHolds }) => {
  return (
    <div className="home-container">
      <div className="greeting-section">
        <h1>Welcome, {user?.FirstName || 'User'}</h1>
        <p>What would you like to do today?</p>
      </div>

      <div className="quick-actions">
        <div className="action-card" onClick={onBrowseBooks}>
          <h3>Browse Books</h3>
          <p>Explore our collection of books</p>
        </div>
        
        <div className="action-card" onClick={onViewLoans}>
          <h3>My Loans</h3>
          <p>View your current and past loans</p>
        </div>
        
        <div className="action-card" onClick={onViewHolds}>
          <h3>My Holds</h3>
          <p>Manage your book hold requests</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
