import React, { useState, useEffect } from 'react';
import '../../styles/layout/TopBar.css';

const TopBar = ({ 
  isLoggedIn, 
  userData, 
  handleLogout, 
  navigateToBooks, 
  navigateToMedia,
  navigateToLogin,
  navigateToRegister,
  navigateToRooms,
  navigateToEvents,
  navigateToLanding,
  bookGenres = ['all'] // Add default value for bookGenres
}) => {
  // Add state to track which dropdown is open
  const [openDropdown, setOpenDropdown] = useState(null);

  // Define menu items for each dropdown
  const [dropdownMenus, setDropdownMenus] = useState({
    books: [
      { label: 'All Books', action: () => navigateToBooks() }
    ],
    media: [
      { label: 'Movies', action: () => navigateToMedia('movies') },
      { label: 'Music', action: () => navigateToMedia('music') },
      { label: 'Video Games', action: () => navigateToMedia('videogames') },
      { label: 'All Media', action: () => navigateToMedia() }
    ],
    rooms: [
      { label: 'Small Rooms (1-4)', action: () => navigateToRooms('small') },
      { label: 'Medium Rooms (5-10)', action: () => navigateToRooms('medium') },
      { label: 'Large Rooms (10+)', action: () => navigateToRooms('large') },
      { label: 'All Rooms', action: () => navigateToRooms() }
    ],
    electronics: [
      { label: 'Laptops', action: () => {} },
      { label: 'Tablets', action: () => {} },
      { label: 'Cameras', action: () => {} },
      { label: 'Projectors', action: () => {} },
      { label: 'All Electronics', action: () => {} }
    ],
    events: [
      { label: 'Workshops', action: () => navigateToEvents('workshops') },
      { label: 'Lectures', action: () => navigateToEvents('lectures') },
      { label: 'Book Clubs', action: () => navigateToEvents('book-clubs') },
      { label: 'All Events', action: () => navigateToEvents() }
    ]
  });

  // Update book genres menu whenever bookGenres prop changes
  useEffect(() => {
    if (bookGenres && bookGenres.length > 0) {
      const genreItems = bookGenres.map(genre => {
        if (genre.toLowerCase() === 'all') {
          return { label: 'All Books', action: () => navigateToBooks() };
        } else {
          return { 
            label: genre.charAt(0).toUpperCase() + genre.slice(1), // Capitalize first letter
            action: () => navigateToBooks(genre) 
          };
        }
      });
      
      // Update the dropdown menus state with the new book genres
      setDropdownMenus(prev => ({
        ...prev,
        books: genreItems
      }));
    }
  }, [bookGenres, navigateToBooks]);

  return (
    <div className="top-bar">
      <div className="top-bar-content">
        <div 
          className="logo" 
          onClick={navigateToLanding}
          style={{ cursor: 'pointer' }}
        >
          BookFinder
        </div>
        <div className="nav-buttons">
          <div 
            className="dropdown-container"
            onMouseEnter={() => setOpenDropdown('books')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button onClick={() => navigateToBooks('all')} className="nav-button">
              Browse & Borrow
            </button>
            {openDropdown === 'books' && (
              <div className="dropdown-menu">
                {dropdownMenus.books.map((item, index) => (
                  <div key={index} className="dropdown-item" onClick={item.action}>
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div 
            className="dropdown-container"
            onMouseEnter={() => setOpenDropdown('media')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button onClick={() => navigateToMedia('all')} className="nav-button">
              Media
            </button>
            {openDropdown === 'media' && (
              <div className="dropdown-menu">
                {dropdownMenus.media.map((item, index) => (
                  <div key={index} className="dropdown-item" onClick={item.action}>
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div 
            className="dropdown-container"
            onMouseEnter={() => setOpenDropdown('rooms')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button onClick={() => navigateToRooms('all')} className="nav-button">
              Room Reservation
            </button>
            {openDropdown === 'rooms' && (
              <div className="dropdown-menu">
                {dropdownMenus.rooms.map((item, index) => (
                  <div key={index} className="dropdown-item" onClick={item.action}>
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div 
            className="dropdown-container"
            onMouseEnter={() => setOpenDropdown('electronics')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="nav-button">Electronics (WIP)</button>
            {openDropdown === 'electronics' && (
              <div className="dropdown-menu">
                {dropdownMenus.electronics.map((item, index) => (
                  <div key={index} className="dropdown-item" onClick={item.action}>
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div 
            className="dropdown-container"
            onMouseEnter={() => setOpenDropdown('events')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button onClick={() => navigateToEvents('all')} className="nav-button">
              Events
            </button>
            {openDropdown === 'events' && (
              <div className="dropdown-menu">
                {dropdownMenus.events.map((item, index) => (
                  <div key={index} className="dropdown-item" onClick={item.action}>
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {isLoggedIn && userData ? (
            <div className="user-info">
              <span>Hello, {userData.FirstName}</span>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button className="login-button" onClick={navigateToLogin}>
                Login
              </button>
              <button className="login-button" onClick={navigateToRegister}>
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;