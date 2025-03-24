import React from 'react';
import '../../styles/home/Home.css';

const Home = ({ userData, navigateToBooks, navigateToLoans, navigateToHolds, navigateToFines, navigateToAddBook }) => {
  return (
    <div className="content-container home-container">
      <h2>Team 7 Library (Role: {userData.Role})</h2>
      <div className="menu-container">
        <button onClick={navigateToBooks} className="menu-button">Books</button>
        <button onClick={navigateToLoans} className="menu-button">Loans</button>
        <button onClick={navigateToHolds} className="menu-button">Holds</button>
        <button onClick={navigateToFines} className="menu-button">Fines</button>
        {userData.Role === 'Admin' && (
          <button onClick={navigateToAddBook} className="menu-button admin-button">Add New Book</button>
        )}
      </div>
    </div>
  );
};

export default Home;
