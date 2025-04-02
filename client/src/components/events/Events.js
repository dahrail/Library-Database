import React, { useState, useEffect } from 'react';
import '../../styles/events/Events.css';
import AddEventForm from './AddEventForm';
import API from '../../services/api';

const Events = ({ 
  navigateToHome, 
  userData,
  initialCategory,
  navigateToLanding,
  navigateToLogin // Add this prop to fix the "not defined" error
}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [checkedInEvents, setCheckedInEvents] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({});
  const [processingRegistration, setProcessingRegistration] = useState(null);
  const [processingCheckIn, setProcessingCheckIn] = useState(null);
  
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

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

  useEffect(() => {
    if (userData?.UserID) {
      // Fetch user's registered events
      const fetchUserRegistrations = async () => {
        try {
          const response = await fetch(`/api/events/user-registrations/${userData.UserID}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setRegisteredEvents(data.registrations.map(reg => reg.EventID));
              setCheckedInEvents(data.registrations
                .filter(reg => reg.CheckedIn)
                .map(reg => reg.EventID));
            }
          }
        } catch (error) {
          console.error('Error fetching user registrations:', error);
        }
      };
      
      fetchUserRegistrations();
    }
  }, [userData]);

  useEffect(() => {
    if (events.length > 0) {
      // Fetch attendance stats for all events
      const fetchAttendanceStats = async () => {
        try {
          const eventIds = events.map(event => event.EventID).join(',');
          const response = await fetch(`/api/events/attendance-stats?eventIds=${eventIds}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              const statsMap = {};
              data.stats.forEach(stat => {
                statsMap[stat.EventID] = {
                  registeredCount: stat.RegisteredCount || 0,
                  checkedInCount: stat.CheckedInCount || 0
                };
              });
              setAttendanceStats(statsMap);
            }
          }
        } catch (error) {
          console.error('Error fetching attendance stats:', error);
        }
      };
      
      fetchAttendanceStats();
    }
  }, [events]);

  const refreshEventStats = async (eventId) => {
    try {
      const response = await fetch(`/api/events/attendance-stats?eventIds=${eventId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.stats.length > 0) {
          setAttendanceStats(prev => ({
            ...prev,
            [eventId]: {
              registeredCount: data.stats[0].RegisteredCount,
              checkedInCount: data.stats[0].CheckedInCount
            }
          }));
        }
      }
    } catch (error) {
      console.error('Error refreshing event stats:', error);
    }
  };

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

  const handleRegisterForEvent = async (eventId) => {
    if (!userData) {
      navigateToLogin();
      return;
    }
    
    try {
      setProcessingRegistration(eventId);
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          EventID: eventId,
          UserID: userData.UserID,
          RegistrationTime: new Date().toISOString()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRegisteredEvents([...registeredEvents, eventId]);
        setAttendanceStats(prev => ({
          ...prev,
          [eventId]: {
            ...prev[eventId],
            registeredCount: (prev[eventId]?.registeredCount || 0) + 1
          }
        }));
        await refreshEventStats(eventId);
        alert('Successfully registered for the event!');
      } else {
        alert(data.error || 'Failed to register for the event');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('An error occurred while registering for the event');
    } finally {
      setProcessingRegistration(null);
    }
  };

  const handleCheckIn = async (eventId) => {
    if (!userData) return;
    
    try {
      setProcessingCheckIn(eventId);
      const response = await fetch('/api/events/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          EventID: eventId,
          UserID: userData.UserID,
          CheckInTime: new Date().toISOString()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCheckedInEvents([...checkedInEvents, eventId]);
        await refreshEventStats(eventId);
        alert('Successfully checked in to the event!');
      } else {
        alert(data.error || 'Failed to check in to the event');
      }
    } catch (error) {
      console.error('Error checking in to event:', error);
      alert('An error occurred while checking in to the event');
    } finally {
      setProcessingCheckIn(null);
    }
  };

  const handleAdminCheckIn = async (eventId, userId) => {
    try {
      const response = await fetch('/api/events/admin-check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          EventID: eventId,
          UserID: userId,
          AdminID: userData.UserID
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await refreshEventStats(eventId);
        alert('User successfully checked in!');
      } else {
        alert(data.error || 'Failed to check in user');
      }
    } catch (error) {
      console.error('Error during admin check-in:', error);
      alert('An error occurred during check-in');
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
                  
                  <div className="detail-item">
                    <span className="detail-label">Attendance:</span>
                    <span className="detail-value">
                      {attendanceStats[event.EventID]?.registeredCount || 0} registered / 
                      {attendanceStats[event.EventID]?.checkedInCount || 0} checked in
                    </span>
                  </div>
                  
                  {userData && (
                    <div className="event-actions">
                      {!registeredEvents.includes(event.EventID) ? (
                        <button 
                          className={`register-button ${processingRegistration === event.EventID ? 'processing' : ''}`}
                          onClick={() => handleRegisterForEvent(event.EventID)}
                          disabled={processingRegistration === event.EventID || new Date(event.StartAt) < new Date()}
                        >
                          {processingRegistration === event.EventID ? 'Processing...' : 'Register'}
                        </button>
                      ) : !checkedInEvents.includes(event.EventID) ? (
                        <button 
                          className={`checkin-button ${processingCheckIn === event.EventID ? 'processing' : ''}`}
                          onClick={() => handleCheckIn(event.EventID)}
                          disabled={processingCheckIn === event.EventID || 
                                    new Date(event.StartAt) > new Date() || 
                                    new Date(event.EndAt) < new Date()}
                        >
                          {processingCheckIn === event.EventID ? 'Processing...' : 'Check In'}
                        </button>
                      ) : (
                        <div className="checked-in-badge">
                          <span>✓ Checked In</span>
                        </div>
                      )}
                      
                      {userData?.Role === 'Admin' && (
                        <button 
                          className="admin-button"
                          onClick={() => window.location.href = `/event-attendees/${event.EventID}`}
                        >
                          Manage Attendees
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <button onClick={userData ? navigateToHome : navigateToLanding} className="btn-back">
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Events;