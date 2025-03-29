import React, { useEffect } from "react";
import "../../styles/home/Home.css";

const Home = ({
  userData,
  navigateToBooks,
  navigateToMedia,
  navigateToElectronics,
  navigateToLoans,
  navigateToRooms,
  navigateToDataReport,
  navigateToEvents,
}) => {
  const isAdmin = userData?.Role === "Admin";
  
  // Add animation styles on component mount
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .fade-in-items .menu-item {
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.5s forwards;
      }
      
      .fade-in-items .menu-item:nth-child(1) { animation-delay: 0.1s; }
      .fade-in-items .menu-item:nth-child(2) { animation-delay: 0.15s; }
      .fade-in-items .menu-item:nth-child(3) { animation-delay: 0.2s; }
      .fade-in-items .menu-item:nth-child(4) { animation-delay: 0.25s; }
      .fade-in-items .menu-item:nth-child(5) { animation-delay: 0.3s; }
      .fade-in-items .menu-item:nth-child(6) { animation-delay: 0.35s; }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="home-modern-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">Welcome to BookFinder</h1>
        <p className="hero-subtitle">
          Explore our collection of books, electronics, media, and more!
        </p>
      </div>

      {/* Content Section */}
      <div className="content-section">
        <h2 className="section-title">Library Services</h2>
        
        <div id="menu-grid" className="menu-container fade-in-items">
          <div className="menu-item" onClick={navigateToBooks}>
            <div className="menu-item-image-container">
              <img src="/images/book.jpg" alt="Books" className="menu-image" />
            </div>
            <div className="menu-item-content">
              <h3>Books</h3>
              <p>Browse our extensive collection of books across various genres</p>
            </div>
          </div>
          
          <div className="menu-item" onClick={navigateToMedia}>
            <div className="menu-item-image-container">
              <img src="/images/media.jpg" alt="Media" className="menu-image" />
            </div>
            <div className="menu-item-content">
              <h3>Media</h3>
              <p>Discover music, movies, and other digital content</p>
            </div>
          </div>
          
          <div className="menu-item" onClick={navigateToElectronics}>
            <div className="menu-item-image-container">
              <img src="/images/electronics.jpg" alt="Electronics" className="menu-image" />
            </div>
            <div className="menu-item-content">
              <h3>Electronics</h3>
              <p>Borrow electronic devices, laptops, and more</p>
            </div>
          </div>
          
          <div className="menu-item" onClick={navigateToLoans}>
            <div className="menu-item-image-container">
              <img src="/images/loans.jpg" alt="Loans" className="menu-image" />
            </div>
            <div className="menu-item-content">
              <h3>Loans</h3>
              <p>Manage your current loans and borrowing history</p>
            </div>
          </div>
          
          <div className="menu-item" onClick={navigateToRooms}>
            <div className="menu-item-image-container">
              <img src="/images/rooms.jpg" alt="Rooms" className="menu-image" />
            </div>
            <div className="menu-item-content">
              <h3>Rooms</h3>
              <p>Reserve private study rooms and meeting spaces</p>
            </div>
          </div>
          
          <div className="menu-item" onClick={navigateToEvents}>
            <div className="menu-item-image-container">
              <img src="/images/events.jpg" alt="Events" className="menu-image" />
            </div>
            <div className="menu-item-content">
              <h3>Events</h3>
              <p>Check out upcoming library events and activities</p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <button onClick={navigateToDataReport} className="data-report-button">
            View Data Report
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
