import React, { useState } from 'react';

const EditEventForm = ({ event, rooms, onSubmit, onCancel }) => {
  const [eventData, setEventData] = useState({
    EventID: event.EventID,
    EventName: event.EventName,
    RoomID: event.RoomID,
    StartAt: formatDateTimeForInput(event.StartAt),
    EndAt: formatDateTimeForInput(event.EndAt),
    MaxAttendees: event.MaxAttendees,
    Category: event.Category || '',
    Description: event.Description || '',
    UserID: event.UserID
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
  function formatDateTimeForInput(dateString) {
    const d = new Date(dateString);
    // Ensure local timezone is considered
    const tzOffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(d - tzOffset)).toISOString().slice(0, 16);
    return localISOTime;
  }
  
  const eventCategories = [
    'Workshop',
    'Lecture',
    'Book Club',
    'Kids Event',
    'Author Visit',
    'Exhibition',
    'Movie Screening',
    'Other'
  ];
  
  return (
    <div className="add-event-form-container">
      <h3>Edit Event</h3>
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
          <label htmlFor="Category">Event Category:</label>
          <select
            id="Category"
            name="Category"
            value={eventData.Category}
            onChange={handleChange}
            required
          >
            <option value="">Select a Category</option>
            {eventCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
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
              min={eventData.StartAt}
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
        
        <div className="form-group">
          <label htmlFor="Description">Event Description:</label>
          <textarea
            id="Description"
            name="Description"
            value={eventData.Description}
            onChange={handleChange}
            rows="4"
            placeholder="Provide details about the event"
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
          <button type="submit" className="btn-submit">
            Update Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEventForm;
