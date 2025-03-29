import React, { useState, useEffect } from 'react';
import '../../styles/events/Events.css';
import AddEventForm from './AddEventForm';
import API from '../../services/api';

const Events = ({ userData, navigateToHome }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [rooms, setRooms] = useState([]);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        console.log("Fetching events...");
        
        const response = await fetch('/api/events');
        console.log("Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Response data:", data);
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch events');
        }
        
        setEvents(data.events || []);
        
        // Fetch rooms if user is Admin
        if (userData?.Role === 'Admin') {
          const roomsResponse = await fetch('/api/rooms');
          const roomsData = await roomsResponse.json();
          if (roomsData.success) {
            setRooms(roomsData.rooms);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(`Failed to load events: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [userData]);

  const handleAddEvent = async (eventData) => {
    try {
      // Add the UserID from logged in user
      const eventWithUserId = {
        ...eventData,
        UserID: userData.UserID
      };
      
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventWithUserId)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Event added successfully!');
        // Refresh the events list
        const refreshResponse = await fetch('/api/events');
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setEvents(refreshData.events || []);
        }
        setShowAddForm(false);
      } else {
        alert('Failed to add event: ' + data.error);
      }
    } catch (error) {
      console.error('Error adding event:', error);
      alert('An error occurred while adding the event.');
    }
  };

  return (
    <div className="events-container">
      {/* Hero Section with gradient background - matches other pages */}
      <div className="events-header">
        <div className="events-header-overlay">
          <h2>Library Events</h2>
          <p className="hero-subtitle">
            Discover upcoming library events and activities
          </p>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="events-section">
        {/* Add Event button - only show for Admin users */}
        {userData?.Role === 'Admin' && (
          <div className="events-actions">
            <button 
              className="add-event-button"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? 'Cancel' : 'Add New Event'}
            </button>
          </div>
        )}
        
        {/* Add Event Form */}
        {showAddForm && (
          <AddEventForm 
            onSubmit={handleAddEvent} 
            rooms={rooms}
            onCancel={() => setShowAddForm(false)}
          />
        )}
        
        {loading && <p className="loading-message">Loading events...</p>}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <p>Please try again later or contact support.</p>
          </div>
        )}
        
        {!loading && !error && events.length === 0 && (
          <div className="no-events-message">
            <p>No upcoming events at this time.</p>
            {userData?.Role === 'Admin' && (
              <p>Use the "Add New Event" button to create events.</p>
            )}
          </div>
        )}
        
        {!loading && !error && events.length > 0 && (
          <div className="events-grid">
            {events.map(event => (
              <div key={event.EventID} className="event-card">
                <div className="event-header">
                  <h3>{event.EventName}</h3>
                  {event.Organizer && <p className="organizer">By: {event.Organizer}</p>}
                </div>
                
                <div className="event-details">
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {new Date(event.StartAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">
                      {new Date(event.StartAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                      {new Date(event.EndAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{event.RoomNumber}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-label">Capacity:</span>
                    <span className="detail-value">
                      {event.MaxAttendees} max
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button onClick={navigateToHome} className="btn-back">Back to Home</button>
      </div>
    </div>
  );
};

export default Events;