import React, { useState, useEffect, useRef } from 'react';
import '../../styles/events/Events.css';
import AddEventForm from './AddEventForm';
import EditEventForm from './EditEventForm';
import EventDetail from './EventDetail';
import EventRegistration from './EventRegistration';
import API from '../../services/api';

const Events = ({ 
  navigateToHome, 
  userData,
  initialCategory,
  navigateToLanding,
  navigateToLogin
}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [currentAction, setCurrentAction] = useState(null); // "detail", "register", "edit", "delete"
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventAttendees, setEventAttendees] = useState([]);
  const [attendeeCount, setAttendeeCount] = useState({ checked: 0, total: 0 });
  const initialRenderRef = useRef(true);
  const categories = ["all", "Workshop", "Lecture", "Book Club", "Kids Event", "Author Visit", "Exhibition", "Movie Screening", "Other"];
  
  // Use the initialCategory prop on mount
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
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Fetched events data:", data);
        
        if (data.success) {
          setEvents(data.events || []);
        } else {
          setError(data.error || "Failed to fetch events");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success) {
          setRooms(data.rooms || []);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        // Not setting error state here as it's not critical
      }
    };

    fetchEvents();
    fetchRooms();
  }, []);

  // Filter events when category changes
  useEffect(() => {
    if (events.length > 0) {
      if (selectedCategory === 'all') {
        setDisplayedEvents(events);
      } else {
        setDisplayedEvents(events.filter(event => event.Category === selectedCategory));
      }
    }
  }, [selectedCategory, events]);

  const handleAddEvent = async (eventData) => {
    try {
      setLoading(true);
      // Add UserID to the event data from userData
      const eventWithUser = {
        ...eventData,
        UserID: userData?.UserID
      };
      
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventWithUser)
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
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = async (eventData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${eventData.EventID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Event updated successfully!');
        // Refresh the events list
        const refreshResponse = await fetch('/api/events');
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setEvents(refreshData.events || []);
        }
        setCurrentAction(null);
      } else {
        alert('Failed to update event: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('An error occurred while updating the event.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        setLoading(true);
        console.log("Deleting event:", eventId);
        
        // Direct API call without using fetch
        const response = await fetch(`/api/events/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        // Log the raw response for debugging
        console.log("Delete response status:", response.status);
        
        const responseText = await response.text();
        console.log("Raw delete response:", responseText);
        
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          console.error('Error parsing delete response:', responseText, jsonError);
          throw new Error(`Invalid server response: ${responseText}`);
        }
        
        if (data.success) {
          alert('Event deleted successfully!');
          // Remove the deleted event from state
          setEvents(prev => prev.filter(e => e.EventID !== eventId));
          setCurrentAction(null);
        } else {
          console.error("Delete failed with error:", data.error);
          alert('Failed to delete event: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('An error occurred while deleting the event: ' + (error.message || ''));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewEventDetails = async (event) => {
    try {
      setLoading(true);
      setSelectedEvent(event);
      
      console.log("Viewing details for event:", event.EventID);
      
      // Fetch attendees for this event
      const response = await fetch(`/api/events/${event.EventID}/attendees`);
      const responseText = await response.text();
      
      try {
        // Try to parse the response as JSON
        const data = JSON.parse(responseText);
        
        if (data.success) {
          console.log("Successfully fetched attendees:", data.attendees?.length || 0);
          setEventAttendees(data.attendees || []);
        } else {
          console.error('Failed to fetch attendees:', data.error);
          setEventAttendees([]);
        }
      } catch (jsonError) {
        console.error('Error parsing attendees response:', responseText, jsonError);
        setEventAttendees([]);
      }
      
      // Fetch check-in counts
      const countResponse = await fetch(`/api/events/${event.EventID}/count`);
      const countResponseText = await countResponse.text();
      
      try {
        // Try to parse the response as JSON
        const countData = JSON.parse(countResponseText);
        
        if (countData.success) {
          console.log("Successfully fetched attendee counts:", countData);
          setAttendeeCount({
            checked: countData.CheckedInCount || 0,
            total: countData.TotalRegistrations || 0
          });
        } else {
          console.error('Failed to fetch attendee counts:', countData.error);
          setAttendeeCount({ checked: 0, total: 0 });
        }
      } catch (jsonError) {
        console.error('Error parsing count response:', countResponseText, jsonError);
        setAttendeeCount({ checked: 0, total: 0 });
      }
      
      setCurrentAction('detail');
    } catch (error) {
      console.error('Error fetching event details:', error);
      alert('Error loading event details. Please try again.');
      setEventAttendees([]);
      setAttendeeCount({ checked: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterForEvent = async (eventId) => {
    try {
      if (!userData) {
        navigateToLogin();
        return;
      }
      
      setLoading(true);
      // Find the event to display registration form
      const eventToRegister = events.find(e => e.EventID === eventId);
      if (eventToRegister) {
        setSelectedEvent(eventToRegister);
        setCurrentAction('register');
      }
    } catch (error) {
      console.error('Error preparing for registration:', error);
      alert('An error occurred while preparing registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRegistration = async () => {
    try {
      if (!userData || !selectedEvent) {
        alert('Missing user data or event information');
        return;
      }
      
      setLoading(true);
      console.log("Registering for event:", selectedEvent.EventID);
      
      // Use the API service for more consistent handling
      const response = await API.registerForEvent(userData.UserID, selectedEvent.EventID);
      
      if (response.success) {
        // Immediately update attendeeCount state to reflect the new registration
        setAttendeeCount(prev => ({
          ...prev,
          total: prev.total + 1
        }));
        
        // Refresh event data to get accurate counts
        // Change API.getAllEvents() to API.getEvents() 
        const refreshData = await API.getEvents();
        if (refreshData.success) {
          setEvents(refreshData.events || []);
          // Update selected event with refreshed data
          const updatedEvent = refreshData.events.find(e => e.EventID === selectedEvent.EventID);
          if (updatedEvent) {
            setSelectedEvent(updatedEvent);
          }
        }
        
        // Get attendee counts directly from API for accuracy
        const countResponse = await fetch(`/api/events/${selectedEvent.EventID}/count`);
        const countData = await countResponse.json();
        
        if (countData.success) {
          const totalRegistered = countData.TotalRegistrations;
          const availableSpots = selectedEvent.MaxAttendees - totalRegistered;
          
          alert(`Registration successful! You are now registered for this event. There are ${availableSpots > 0 ? availableSpots : 0} spots remaining.`);
          
          // Update attendee count state with the accurate data
          setAttendeeCount({
            checked: countData.CheckedInCount || 0,
            total: totalRegistered || 0
          });
        } else {
          alert('Registration successful! You are now registered for this event.');
        }
        
        // Go back to event details view with updated information
        setCurrentAction('detail');
      } else {
        alert('Failed to register: ' + response.error);
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      if (error.message && typeof error.message === 'string') {
        if (error.message.includes('already registered')) {
          alert('You are already registered for this event.');
        } else if (error.message.includes('maximum capacity')) {
          alert('This event has reached maximum capacity.');
        } else {
          alert('An error occurred while registering for the event: ' + error.message);
        }
      } else {
        alert('An error occurred while registering for the event.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInForEvent = async (eventId) => {
    try {
      if (!userData) {
        alert('You must be logged in to check in for an event.');
        navigateToLogin();
        return;
      }
      
      setLoading(true);
      console.log("Checking in for event:", eventId);
      
      // Use direct fetch instead of the API service for more control
      const response = await fetch('/api/events/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          UserID: userData.UserID,
          EventID: eventId
        })
      });
      
      const responseText = await response.text();
      console.log("Raw check-in response:", responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Error parsing check-in response:', responseText, jsonError);
        throw new Error(`Invalid server response: ${responseText}`);
      }
      
      if (data.success) {
        // Update local state to reflect the check-in
        setAttendeeCount(prev => ({
          ...prev,
          checked: prev.checked + 1
        }));
        
        alert(`Check-in successful! You are now checked in for this event.`);
        
        // Refresh the events list and attendee data
        const refreshResponse = await fetch('/api/events');
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setEvents(refreshData.events || []);
        }
        
        // If we're in event detail view, refresh attendees
        if (currentAction === 'detail' && selectedEvent) {
          await handleViewEventDetails(selectedEvent);
        }
      } else {
        console.error("Check-in failed with error:", data.error);
        
        // Handle specific error cases
        if (data.error.includes("need to register") || data.error.includes("not registered")) {
          alert('You need to register for this event before checking in.');
        } else if (data.error.includes("already checked in")) {
          alert('You have already checked in for this event.');
        } else {
          alert('Failed to check in: ' + data.error);
        }
      }
    } catch (error) {
      console.error('Error checking in for event:', error);
      
      if (error.message && typeof error.message === 'string') {
        if (error.message.includes('already checked in')) {
          alert('You have already checked in for this event.');
        } else if (error.message.includes('need to register') || error.message.includes('not found') || error.message.includes('not registered')) {
          alert('You need to register for this event before checking in.');
        } else {
          alert('An error occurred while checking in for the event: ' + error.message);
        }
      } else {
        alert('An error occurred while checking in for the event. Please make sure you have registered first.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Render based on current action
  if (currentAction === 'detail' && selectedEvent) {
    return (
      <EventDetail 
        event={selectedEvent}
        onBack={() => setCurrentAction(null)}
        userData={userData}
        onRegister={() => handleRegisterForEvent(selectedEvent.EventID)}
        attendees={eventAttendees}
        onCheckIn={() => handleCheckInForEvent(selectedEvent.EventID)}
        attendeeCount={attendeeCount}
      />
    );
  }

  if (currentAction === 'register' && selectedEvent) {
    return (
      <EventRegistration
        event={selectedEvent}
        onConfirm={handleConfirmRegistration}
        onCancel={() => setCurrentAction(null)}
      />
    );
  }

  if (currentAction === 'edit' && selectedEvent) {
    return (
      <EditEventForm
        event={selectedEvent}
        rooms={rooms}
        onSubmit={handleEditEvent}
        onCancel={() => setCurrentAction(null)}
      />
    );
  }

  return (
    <div className="events-container">
      {/* Hero Section with gradient background */}
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
        
        {/* Category Navigation */}
        <div className="category-nav">
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? 'All Events' : category}
            </button>
          ))}
        </div>
        
        {loading && <p className="loading-message">Loading events...</p>}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <p>Please try again later or contact support.</p>
          </div>
        )}
        
        {!loading && !error && displayedEvents.length === 0 && (
          <div className="no-events-message">
            <p>No upcoming events {selectedCategory !== 'all' ? `in category: ${selectedCategory}` : ''} at this time.</p>
            {userData?.Role === 'Admin' && (
              <p>Use the "Add New Event" button to create events.</p>
            )}
          </div>
        )}
        
        {!loading && !error && displayedEvents.length > 0 && (
          <div className="events-grid fade-in-items">
            {displayedEvents.map(event => (
              <div key={event.EventID} className="event-card">
                <div className="event-header">
                  <h3>{event.EventName}</h3>
                  {event.Category && <div className="event-category-tag">{event.Category}</div>}
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
                  
                  <div className="event-actions">
                    <button 
                      className="btn-view-details"
                      onClick={() => handleViewEventDetails(event)}
                    >
                      View Details
                    </button>
                    
                    {userData && (
                      <>
                        <button
                          className="btn-register"
                          onClick={() => handleRegisterForEvent(event.EventID)}
                        >
                          Register
                        </button>
                        
                        <button
                          className="btn-checkin"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            handleCheckInForEvent(event.EventID);
                          }}
                        >
                          Check In
                        </button>
                        
                        {/* Show checked-in status if the user has checked in */}
                        {event.UserCheckedIn && (
                          <div className="checked-in-message">
                            You are checked in!
                          </div>
                        )}
                      </>
                    )}
                    
                    {userData?.Role === 'Admin' && (
                      <div className="admin-actions">
                        <button
                          className="btn-edit"
                          onClick={() => {
                            setSelectedEvent(event);
                            setCurrentAction('edit');
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteEvent(event.EventID)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
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