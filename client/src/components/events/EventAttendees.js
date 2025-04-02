import React, { useState, useEffect } from 'react';
import '../../styles/events/Events.css';

const EventAttendees = ({ eventId, userData, navigateToEvents }) => {
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceStats, setAttendanceStats] = useState({ 
    totalRegistered: 0, 
    totalCheckedIn: 0 
  });
  const [checkingIn, setCheckingIn] = useState(false);

  // Function to refresh event and attendee data
  const refreshEventData = async () => {
    try {
      // Fetch event details
      const eventResponse = await fetch(`/api/events/${eventId}`);
      if (!eventResponse.ok) {
        throw new Error(`Error fetching event: ${eventResponse.status}`);
      }
      const eventData = await eventResponse.json();
      
      // Fetch attendees with stats
      const attendeesResponse = await fetch(`/api/events/attendees/${eventId}`);
      if (!attendeesResponse.ok) {
        throw new Error(`Error fetching attendees: ${attendeesResponse.status}`);
      }
      const attendeesData = await attendeesResponse.json();
      
      setEvent(eventData.event);
      setAttendees(attendeesData.attendees);
      setAttendanceStats({
        totalRegistered: attendeesData.stats.TotalRegistered || 0,
        totalCheckedIn: attendeesData.stats.TotalCheckedIn || 0
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching event data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      refreshEventData();
    }
  }, [eventId]);

  const handleCheckIn = async (userId) => {
    if (checkingIn) return; // Prevent multiple simultaneous check-ins
    
    try {
      setCheckingIn(true);
      const response = await fetch('/api/events/admin-check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          EventID: eventId,
          UserID: userId,
          AdminID: userData.UserID,
          CheckInTime: new Date().toISOString() // Send current timestamp
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Update UI with optimistic update
        setAttendees(attendees.map(attendee => 
          attendee.UserID === userId 
            ? { ...attendee, CheckedIn: true, CheckInTime: new Date().toISOString() }
            : attendee
        ));
        
        // Update attendance stats
        setAttendanceStats(prev => ({
          ...prev,
          totalCheckedIn: prev.totalCheckedIn + 1
        }));
        
        // Then refresh data from server to ensure accuracy
        await refreshEventData();
      } else {
        alert(data.error || 'Failed to check in user');
      }
    } catch (error) {
      console.error('Error checking in user:', error);
      alert('An error occurred while checking in the user');
      // Refresh data to ensure UI is in sync with server
      await refreshEventData();
    } finally {
      setCheckingIn(false);
    }
  };

  const filteredAttendees = attendees.filter(attendee => {
    const fullName = `${attendee.FirstName} ${attendee.LastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) || 
           attendee.Email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Sort attendees - checked in first, then alphabetical
  const sortedAttendees = [...filteredAttendees].sort((a, b) => {
    // First sort by check-in status (checked in first)
    if (a.CheckedIn !== b.CheckedIn) {
      return b.CheckedIn - a.CheckedIn;
    }
    // Then sort alphabetically by last name
    return a.LastName.localeCompare(b.LastName);
  });

  if (loading) {
    return (
      <div className="loading-message">
        <div className="loading-spinner"></div>
        <p>Loading event attendees...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!event) {
    return <div className="error-message">Event not found</div>;
  }

  // Calculate time until event starts/ends
  const now = new Date();
  const eventStart = new Date(event.StartAt);
  const eventEnd = new Date(event.EndAt);
  const isUpcoming = now < eventStart;
  const isOngoing = now >= eventStart && now <= eventEnd;
  const isPast = now > eventEnd;

  return (
    <div className="event-attendees-container">
      <div className="event-attendees-header">
        <h2>Event Attendees</h2>
        <h3>{event.EventName}</h3>
        <p className="event-date">
          {new Date(event.StartAt).toLocaleDateString()} at {new Date(event.StartAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </p>
        <div className="event-status">
          {isUpcoming && <span className="status-badge upcoming">Upcoming</span>}
          {isOngoing && <span className="status-badge ongoing">In Progress</span>}
          {isPast && <span className="status-badge past">Completed</span>}
        </div>
      </div>
      
      <div className="event-stats">
        <div className="stat-box">
          <span className="stat-number">{attendanceStats.totalRegistered}</span>
          <span className="stat-label">Registered</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{attendanceStats.totalCheckedIn}</span>
          <span className="stat-label">Checked In</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">
            {attendanceStats.totalRegistered > 0 
              ? Math.round((attendanceStats.totalCheckedIn / attendanceStats.totalRegistered) * 100) 
              : 0}%
          </span>
          <span className="stat-label">Attendance</span>
        </div>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search attendees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button 
          onClick={refreshEventData} 
          className="refresh-button"
          title="Refresh attendee data"
        >
          ↻
        </button>
      </div>
      
      <div className="attendees-list">
        <div className="attendee-header">
          <div className="attendee-name">Name</div>
          <div className="attendee-email">Email</div>
          <div className="attendee-status">Status</div>
          <div className="attendee-actions">Actions</div>
        </div>
        
        {sortedAttendees.length === 0 ? (
          <div className="no-attendees">No attendees found</div>
        ) : (
          sortedAttendees.map(attendee => (
            <div key={attendee.UserID} className={`attendee-row ${attendee.CheckedIn ? 'checked-in' : ''}`}>
              <div className="attendee-name">{attendee.FirstName} {attendee.LastName}</div>
              <div className="attendee-email">{attendee.Email}</div>
              <div className="attendee-status">
                {attendee.CheckedIn ? (
                  <span className="status-checked-in">
                    ✓ Checked In
                    {attendee.CheckInTime && 
                      <span className="check-in-time">
                        {new Date(attendee.CheckInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    }
                  </span>
                ) : (
                  <span className="status-registered">Registered</span>
                )}
              </div>
              <div className="attendee-actions">
                {!attendee.CheckedIn && (
                  <button 
                    className={`checkin-button small ${checkingIn ? 'disabled' : ''}`}
                    onClick={() => handleCheckIn(attendee.UserID)}
                    disabled={checkingIn || isPast}
                  >
                    {checkingIn ? 'Processing...' : 'Check In'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="attendance-summary">
        <p>
          <strong>Summary:</strong> {attendanceStats.totalCheckedIn} of {attendanceStats.totalRegistered} registered 
          attendees have checked in ({attendanceStats.totalRegistered > 0 
            ? Math.round((attendanceStats.totalCheckedIn / attendanceStats.totalRegistered) * 100) 
            : 0}% attendance rate)
        </p>
      </div>
      
      <button onClick={navigateToEvents} className="btn-back">
        Back to Events
      </button>
    </div>
  );
};

export default EventAttendees;
