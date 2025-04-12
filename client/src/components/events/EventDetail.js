import React from 'react';
import '../../styles/events/Events.css';

const EventDetail = ({ 
  event, 
  onBack, 
  userData, 
  onRegister, 
  attendees, 
  onCheckIn,
  attendeeCount 
}) => {
  if (!event) {
    return (
      <div className="event-detail-container">
        <div className="error-message">
          <p>Event details not available.</p>
          <button onClick={onBack} className="btn-secondary">Back to Events</button>
        </div>
      </div>
    );
  }
  
  // Check if current user is registered and/or checked in
  const isUserRegistered = attendees.some(a => a.UserID === userData?.UserID);
  const isUserCheckedIn = attendees.some(a => a.UserID === userData?.UserID && a.CheckedIn === 1);

  // Calculate remaining spots
  const remainingSpots = event.MaxAttendees - attendeeCount.total;
  const isFull = remainingSpots <= 0;
  
  // Check if event is past, today, or upcoming
  const getEventTimeStatus = () => {
    const now = new Date();
    const start = new Date(event.StartAt);
    const end = new Date(event.EndAt);
    
    if (end < now) {
      return "past";
    } else if (start.toDateString() === now.toDateString()) {
      return "today";
    } else {
      return "upcoming";
    }
  };
  
  const timeStatus = getEventTimeStatus();

  // Format check-in time
  const formatCheckInTime = (dateString) => {
    if (!dateString) return 'Not checked in';
    
    const date = new Date(dateString);
    const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    
    return `${date.toLocaleDateString(undefined, dateOptions)} at ${date.toLocaleTimeString(undefined, timeOptions)}`;
  };
  
  return (
    <div className="event-detail-container">
      <div className="event-detail-card">
        <div className="event-detail-header">
          <h2>{event.EventName}</h2>
          {event.Category && <div className="event-detail-category">{event.Category}</div>}
          
          {/* Event status badge */}
          <div className="event-status-badge">
            {timeStatus === "past" && <span className="badge past-event">Past Event</span>}
            {timeStatus === "today" && <span className="badge today-event">Today</span>}
            {timeStatus === "upcoming" && <span className="badge upcoming-event">Upcoming</span>}
          </div>
        </div>
        
        <div className="event-detail-section">
          <h3>Event Details</h3>
          <div className="detail-row">
            <span className="detail-label"><i className="event-icon">📆</i>Date:</span>
            <span className="detail-value">{new Date(event.StartAt).toLocaleDateString()}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label"><i className="event-icon">⏰</i>Time:</span>
            <span className="detail-value">
              {new Date(event.StartAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
              {new Date(event.EndAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label"><i className="event-icon">📍</i>Location:</span>
            <span className="detail-value">{event.RoomNumber}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label"><i className="event-icon">👤</i>Organizer:</span>
            <span className="detail-value">{event.Organizer || 'Library Staff'}</span>
          </div>
          
          {event.Description && (
            <div className="event-description">
              <h3><i className="event-icon">📝</i>Description</h3>
              <p>{event.Description}</p>
            </div>
          )}
          
          <div className="event-capacity">
            <h3><i className="event-icon">👥</i>Attendance</h3>
            <div className="capacity-stats">
              <div className="capacity-row">
                <span>Registered:</span>
                <span>{attendeeCount.total} of {event.MaxAttendees} spots filled</span>
              </div>
              <div className="capacity-row">
                <span>Checked In:</span>
                <span>{attendeeCount.checked} attendees</span>
              </div>
              <div className="capacity-row">
                <span>Availability:</span>
                <span className={isFull ? 'full-event' : (remainingSpots <= 3 ? 'low-spots' : 'available-spots')}>
                  {isFull ? 'Full' : `${remainingSpots} spots remaining`}
                </span>
              </div>
              <div className="capacity-progress">
                <div 
                  className="progress-bar"
                  style={{
                    width: `${Math.min(100, (attendeeCount.total / event.MaxAttendees) * 100)}%`,
                    backgroundColor: isFull ? '#ef4444' : remainingSpots <= 3 ? '#f59e0b' : '#10b981'
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {userData && timeStatus !== "past" && (
            <div className="registration-status">
              {isUserRegistered ? (
                <div className="registered-message">
                  <i className="event-icon">✅</i> You are registered for this event.
                </div>
              ) : (
                <button 
                  className="btn-register"
                  onClick={onRegister}
                  disabled={isFull}
                >
                  {isFull ? 'Event Full' : 'Register for this Event'}
                </button>
              )}
              
              {isUserRegistered && !isUserCheckedIn && (
                <button 
                  className="btn-checkin"
                  onClick={onCheckIn}
                >
                  <i className="event-icon">🎟️</i> Check In Now
                </button>
              )}
              
              {isUserCheckedIn && (
                <div className="checked-in-message">
                  <i className="event-icon">✓</i> You are checked in for this event.
                </div>
              )}
            </div>
          )}
          
          {timeStatus === "past" && (
            <div className="past-event-message">
              This event has already taken place.
            </div>
          )}
          
          {!userData && (
            <p className="login-prompt">
              <i className="event-icon">🔒</i> Please log in to register for this event.
            </p>
          )}
          
          {userData?.Role === 'Admin' && (
            <div className="attendee-list">
              <h4><i className="event-icon">👥</i> Registered Attendees ({attendeeCount.total})</h4>
              {attendees.length > 0 ? (
                <table className="attendees-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Check-in Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map(attendee => (
                      <tr key={attendee.EventAttendeeID} className={attendee.CheckedIn === 1 ? 'checked-in' : ''}>
                        <td>{attendee.FirstName} {attendee.LastName}</td>
                        <td>{attendee.Email}</td>
                        <td>{attendee.CheckedIn === 1 ? 'Checked In' : 'Registered'}</td>
                        <td>{formatCheckInTime(attendee.CheckedInAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No attendees yet.</p>
              )}
            </div>
          )}
        </div>
        
        <div className="event-detail-actions">
          <button 
            onClick={onBack}
            className="btn-secondary"
          >
            Back to Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
