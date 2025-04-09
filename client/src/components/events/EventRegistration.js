import React from 'react';
import '../../styles/events/Events.css';

const EventRegistration = ({ event, onConfirm, onCancel }) => {
  if (!event) {
    return (
      <div className="content-container">
        <h2>Registration Error</h2>
        <p>Event information is not available.</p>
        <div className="button-group">
          <button onClick={onCancel} className="btn-secondary">Back to Events</button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-container">
      <h2>Event Registration</h2>
      
      <div className="event-details">
        <p><strong>Event:</strong> {event.EventName}</p>
        <p><strong>Date:</strong> {new Date(event.StartAt).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {new Date(event.StartAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
          {new Date(event.EndAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        <p><strong>Location:</strong> {event.RoomNumber}</p>
      </div>
      
      <p>Would you like to register for this event?</p>
      
      <div className="button-group">
        <button onClick={onCancel} className="btn-secondary">Cancel</button>
        <button onClick={onConfirm} className="btn-primary">Confirm Registration</button>
      </div>
    </div>
  );
};

export default EventRegistration;
