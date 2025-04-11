import React, { useEffect } from "react";
import "../../styles/home/Home.css";

const Home = ({
  userData,
  navigateToBooks,
  navigateToMedia,
  navigateToDevices,
  navigateToLoans,
  navigateToHolds,  // Add navigateToHolds in the props
  navigateToFines, // Add navigateToFines to props
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
              <img src="https://cache.getarchive.net/Prod/thumb/cdn12/L3Bob3RvLzIwMTYvMTIvMzEvaXBhZC1zYW1zdW5nLW11c2ljLW11c2ljLTA3MDM4OC0xMDI0LmpwZw%3D%3D/320/212/jpg" alt="Devices" className="menu-image" />
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
              <img src="https://www.northbrook.info/sites/default/files/large-feature/hold-shelves_0.jpg" alt="Holds" className="menu-image" />
            </div>
            <div className="menu-item-content">
              <h3>Holds</h3>
              <p>View and manage your current book holds</p>
            </div>
          </div>
          
          {/* Add the Fines menu item - place it after Holds */}
          <div className="menu-item" onClick={navigateToFines}>
            <div className="menu-item-image-container">
              <img src="data:image/jpeg;base64,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" alt="Fines" className="menu-image" />
            </div>
            <div className="menu-item-content">
              <h3>Fines</h3>
              <p>View and pay your outstanding library fines</p>
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
