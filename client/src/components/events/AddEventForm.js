import React, { useState } from 'react';

const AddEventForm = ({ onSubmit, rooms, onCancel }) => {
  const [eventData, setEventData] = useState({
    EventName: '',
    RoomID: '',
    StartAt: '',
    EndAt: '',
    MaxAttendees: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(eventData);
  };
  
  // Format datetime for input fields
  const formatDateTimeForInput = (date) => {
    const d = new Date(date || new Date());
    return d.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
  };
  
  return (
    <div className="add-event-form-container">
      <h3>Add New Event</h3>
      <form onSubmit={handleSubmit} className="add-event-form">
        <div className="form-group">
          <label htmlFor="EventName">Event Name:</label>
          <input
            type="text"
            id="EventName"
            name="EventName"
            value={eventData.EventName}
            onChange={handleChange}
            required
            placeholder="Enter event name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="RoomID">Room:</label>
          <select
            id="RoomID"
            name="RoomID"
            value={eventData.RoomID}
            onChange={handleChange}
            required
          >
            <option value="">Select a Room</option>
            {rooms.map(room => (
              <option key={room.RoomID} value={room.RoomID}>
                {room.RoomName || room.RoomNumber} (Capacity: {room.Capacity})
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="StartAt">Start Date/Time:</label>
            <input
              type="datetime-local"
              id="StartAt"
              name="StartAt"
              value={eventData.StartAt}
              onChange={handleChange}
              required
              min={formatDateTimeForInput()}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="EndAt">End Date/Time:</label>
            <input
              type="datetime-local"
              id="EndAt"
              name="EndAt"
              value={eventData.EndAt}
              onChange={handleChange}
              required
              min={eventData.StartAt || formatDateTimeForInput()}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="MaxAttendees">Maximum Attendees:</label>
          <input
            type="number"
            id="MaxAttendees"
            name="MaxAttendees"
            value={eventData.MaxAttendees}
            onChange={handleChange}
            min="1"
            required
            placeholder="Enter maximum number of attendees"
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEventForm;