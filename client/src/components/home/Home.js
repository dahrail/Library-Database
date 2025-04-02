import React, { useEffect } from "react";
import "../../styles/home/Home.css";

const Home = ({
  userData,
  navigateToBooks,
  navigateToMedia,
  navigateToDevices,
  navigateToLoans,
  navigateToHolds,  // Add navigateToHolds in the props
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
      
      /* Make sure hero title remains visible */
      .hero-title {
        animation: fadeInUp 0.5s forwards;
        opacity: 1 !important;
        visibility: visible !important;
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
        <h1 className="hero-title" style={{
          fontSize: "56px",
          fontWeight: "600",
          margin: "0",
          letterSpacing: "-0.02em",
          opacity: "1", // Change initial opacity to 1
          color: "white",
          position: "relative",
          zIndex: "10",
          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          animation: "fadeInUp 0.5s ease" // Simplified animation property
        }}>Welcome to BookFinder</h1>
        <p>
          You are logged in as {userData.FirstName} with role {userData.Role}
        </p>
        {/* Added inline styles to ensure subtitle visibility */}
        <p className="hero-subtitle" style={{
          color: "white", 
          opacity: 1,
          fontSize: "24px",
          marginTop: "20px",
          fontWeight: "400",
          position: "relative",
          zIndex: 10
        }}>
          Explore our collection of books, devices, media, and more!
        </p>
      </div>

      {/* Content Section */}
      <div className="content-section">
        <h2 className="section-title">Library Services</h2>
        
        <div id="menu-grid" className="menu-container fade-in-items">
          <div className="menu-item" onClick={() => navigateToBooks('all')}>
            <div className="menu-item-image-container">
              <img src="/images/book.jpg" alt="Books" className="menu-image" />
            </div>
            <div className="menu-item-content">
              <h3>Books</h3>
              <p>Browse our extensive collection of books across various genres</p>
            </div>
          </div>
          
          <div className="menu-item" onClick={() => navigateToMedia('all')}>
            <div className="menu-item-image-container">
              <img src="/images/media.jpg" alt="Media" className="menu-image" />
            </div>
            <div className="menu-item-content">
              <h3>Media</h3>
              <p>Discover music, movies, and other digital content</p>
            </div>
          </div>
          
          <div className="menu-item" onClick={() => navigateToDevices('all')}>
            <div className="menu-item-image-container">
              <img src="/images/devices.jpg" alt="Devices" className="menu-image" />
            </div>
            <div className="menu-item-content">
              <h3>Devices</h3>
              <p>Borrow Ipad, laptops, and headphone</p>
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
          
          {/* Add the Holds menu item */}
          <div className="menu-item" onClick={navigateToHolds}>
            <div className="menu-item-image-container">
              <img src="/images/holds.jpg" alt="Holds" className="menu-image" />
            </div>
            <div className="menu-item-content">
              <h3>Holds</h3>
              <p>View and manage your current book holds</p>
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
