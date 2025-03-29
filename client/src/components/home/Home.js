import React from "react";
import "../../styles/home/Home.css";

const Home = ({
  userData,
  navigateToBooks,
  navigateToMedia,
  navigateToElectronics,
  navigateToLoans,
  navigateToDataReport, // Add the navigation function for the data report
}) => {
  const isAdmin = userData?.Role === "Admin"; // Check if the user is an Admin

  const backgroundStyle = {
    backgroundImage: "url('/images/modernBackground.jpg')", // Correct absolute path
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100vw", // Full width of the viewport
    height: "100vh", // Full height of the viewport
    position: "absolute", // Ensure it covers the entire screen
    top: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "20px",
    overflowY: "auto", // Allow scrolling if content overflows
  };

  return (
    <div style={backgroundStyle}>
      <h2 className="gradient-text">Welcome to BookFinder</h2>
      <p className="gradient-text">
        Explore our collection of books, electronics, and media!
      </p>
      <div className="menu-container">
        <div className="menu-item" onClick={navigateToBooks}>
          <img src="/images/book.jpg" alt="Books" className="menu-image" />
          <h3>Books</h3>
        </div>
        <div className="menu-item" onClick={navigateToMedia}>
          <img src="/images/media.jpg" alt="Media" className="menu-image" />
          <h3>Media</h3>
        </div>
        <div className="menu-item" onClick={navigateToElectronics}>
          <img
            src="/images/electronics.jpg"
            alt="Electronics"
            className="menu-image"
          />
          <h3>Electronics</h3>
        </div>
        <div className="menu-item" onClick={navigateToLoans}>
          <img src="/images/loans.jpg" alt="Loans" className="menu-image" />
          <h3>Loans</h3>
        </div>
      </div>

      {/* Unique Data Report Button for Admins */}
      {isAdmin && (
        <button onClick={navigateToDataReport} className="data-report-button">
          View Data Report
        </button>
      )}
    </div>
  );
};

export default Home;
