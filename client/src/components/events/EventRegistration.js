import React, { useState } from 'react';
import '../../styles/events/Events.css';

const EventRegistration = ({ event, onConfirm, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Simply call onConfirm without passing any date parameter
      // The registration process will handle timestamps on the server
      await onConfirm();
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message && typeof error.message === 'string') {
        if (error.message.includes('already registered')) {
          setError('You are already registered for this event.');
        } else if (error.message.includes('maximum capacity')) {
          setError('This event has reached maximum capacity.');
        } else {
          setError(error.message || 'Failed to register for this event. Please try again later.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
      
      {error && (
        <div className="error-message" style={{ color: '#e53935', padding: '10px', marginBottom: '15px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          <p><strong>Error:</strong> {error}</p>
          <p>Please try again or contact library support if the problem persists.</p>
        </div>
      )}
      
      <div className="button-group">
        <button onClick={onCancel} className="btn-secondary" disabled={isSubmitting}>Cancel</button>
        <button 
          onClick={handleConfirm} 
          className="btn-primary" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Confirm Registration'}
        </button>
      </div>
    </div>
  );
};

export default EventRegistration;
