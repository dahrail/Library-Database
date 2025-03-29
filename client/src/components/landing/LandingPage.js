import React, { useEffect } from 'react';
import '../../styles/landing/LandingPage.css';

const LandingPage = ({ 
  navigateToBooks, 
  navigateToMedia, 
  navigateToRooms, 
  navigateToEvents 
}) => {
  // Add animation styles on component mount
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to BookFinder</h1>
          <p className="hero-subtitle">Your University Library Portal</p>
          <div className="hero-cta">
            <button onClick={navigateToBooks} className="cta-button primary">
              Explore Books
            </button>
            <button onClick={navigateToMedia} className="cta-button secondary">
              Discover Media
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="features-section">
        <h2 className="section-title">Library Services</h2>
        
        <div className="features-grid">
          <div className="feature-card" onClick={navigateToBooks}>
            <div className="feature-icon book-icon"></div>
            <h3>Extensive Book Collection</h3>
            <p>Browse thousands of books across all genres and subjects</p>
          </div>
          
          <div className="feature-card" onClick={navigateToMedia}>
            <div className="feature-icon media-icon"></div>
            <h3>Digital Media</h3>
            <p>Access our collection of music, movies, and more</p>
          </div>
          
          <div className="feature-card" onClick={navigateToRooms}>
            <div className="feature-icon room-icon"></div>
            <h3>Study Spaces</h3>
            <p>Reserve private rooms and collaborative spaces</p>
          </div>
          
          <div className="feature-card" onClick={navigateToEvents}>
            <div className="feature-icon event-icon"></div>
            <h3>Events & Workshops</h3>
            <p>Join our community events and learning sessions</p>
          </div>
        </div>
      </section>

      {/* Promotional Section */}
      <section className="promo-section">
        <div className="promo-content">
          <h2>Discover Something New</h2>
          <p>Our curated collections are updated regularly with the latest publications</p>
          <button onClick={navigateToBooks} className="promo-button">
            Start Browsing
          </button>
        </div>
        <div className="promo-image"></div>
      </section>

      {/* Quick Info Section */}
      <section className="info-section">
        <div className="info-card">
          <h3>24/7 Digital Access</h3>
          <p>Access our digital resources anytime, anywhere</p>
        </div>
        <div className="info-card">
          <h3>Easy Borrowing</h3>
          <p>Simple checkout process with flexible return options</p>
        </div>
        <div className="info-card">
          <h3>Expert Assistance</h3>
          <p>Get help from our knowledgeable library staff</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2023 BookFinder - University Library Portal</p>
      </footer>
    </div>
  );
};

export default LandingPage;
