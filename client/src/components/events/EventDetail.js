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
        <h2>{event.EventName}</h2>
        {event.Category && <div className="event-detail-category">{event.Category}</div>}
        
        <div className="event-detail-section">
          <h3>Event Details</h3>
          <div className="detail-row">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{new Date(event.StartAt).toLocaleDateString()}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time:</span>
            <span className="detail-value">
              {new Date(event.StartAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
              {new Date(event.EndAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{event.RoomNumber}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Organizer:</span>
            <span className="detail-value">{event.Organizer || 'Library Staff'}</span>
          </div>
          
          {event.Description && (
            <div className="event-description">
              <h3>Description</h3>
              <p>{event.Description}</p>
            </div>
          )}
          
          <div className="event-capacity">
            <h3>Attendance</h3>
            <p className={attendeeCount.total >= event.MaxAttendees ? 'low-availability' : ''}>
              {attendeeCount.total} of {event.MaxAttendees} spots filled
              {attendeeCount.checked > 0 && ` (${attendeeCount.checked} Checked In)`}
            </p>
          </div>
          
          {userData && (
            <div className="registration-status">
              {isUserRegistered ? (
                <div className="registered-message">
                  You are registered for this event.
                </div>
              ) : (
                <button 
                  className="btn-register"
                  onClick={onRegister}
                  disabled={attendeeCount.total >= event.MaxAttendees}
                >
                  {attendeeCount.total >= event.MaxAttendees 
                    ? 'Event Full' 
                    : 'Register for this Event'}
                </button>
              )}
              
              {isUserRegistered && !isUserCheckedIn && (
                <button 
                  className="btn-checkin"
                  onClick={onCheckIn}
                >
                  Check In
                </button>
              )}
              
              {isUserCheckedIn && (
                <div className="checked-in-message">
                  You are checked in for this event.
                </div>
              )}
            </div>
          )}
          
          {!userData && (
            <p className="login-prompt">
              Please log in to register for this event.
            </p>
          )}
          
          {userData?.Role === 'Admin' && (
            <div className="attendee-list">
              <h4>Registered Attendees ({attendeeCount.total})</h4>
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
