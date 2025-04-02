import React, { useState, useEffect } from 'react';

const AddEventForm = ({ onSubmit, rooms, onCancel, eventToEdit = null }) => {
  // Initialize state with either the event to edit or empty values
  const [eventData, setEventData] = useState({
    EventName: '',
    RoomID: '',
    StartAt: '',
    EndAt: '',
    MaxAttendees: '',
    Description: '' // Added description field
  });
  
  // If eventToEdit is provided, populate the form
  useEffect(() => {
    if (eventToEdit) {
      // Format dates for the datetime-local input
      const formattedStartAt = formatDateTimeForInput(new Date(eventToEdit.StartAt));
      const formattedEndAt = formatDateTimeForInput(new Date(eventToEdit.EndAt));
      
      setEventData({
        EventID: eventToEdit.EventID,
        EventName: eventToEdit.EventName || '',
        RoomID: eventToEdit.RoomID || '',
        StartAt: formattedStartAt,
        EndAt: formattedEndAt,
        MaxAttendees: eventToEdit.MaxAttendees || '',
        Description: eventToEdit.Description || ''
      });
    }
  }, [eventToEdit]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate that end time is after start time
    if (new Date(eventData.EndAt) <= new Date(eventData.StartAt)) {
      alert('End time must be after start time');
      return;
    }
    onSubmit(eventData);
  };
  
  // Format datetime for input fields
  const formatDateTimeForInput = (date) => {
    const d = new Date(date || new Date());
    return d.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:MM
  };
  
  return (
    <div className="add-event-form-container">
      <h3>{eventToEdit ? 'Edit Event' : 'Add New Event'}</h3>
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
          <label htmlFor="Description">Description:</label>
          <textarea
            id="Description"
            name="Description"
            value={eventData.Description}
            onChange={handleChange}
            placeholder="Enter event description"
            rows={3}
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '8px', 
              border: '1px solid #d2d2d7',
              fontSize: '15px',
              resize: 'vertical' 
            }}
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
              onChange={(e) => {
                handleChange(e);
                // When start date changes, validate end date is still after it
                if (eventData.EndAt && new Date(e.target.value) >= new Date(eventData.EndAt)) {
                  // Automatically adjust end time to be start time + 1 hour
                  const newStartDate = new Date(e.target.value);
                  const newEndDate = new Date(newStartDate.getTime() + 60 * 60 * 1000);
                  setEventData(prev => ({
                    ...prev,
                    EndAt: formatDateTimeForInput(newEndDate)
                  }));
                }
              }}
              required
              min={formatDateTimeForInput()}
              style={{
                borderColor: eventData.StartAt ? '#d2d2d7' : '#ff3b30'
              }}
            />
            <small style={{ 
              display: 'block', 
              fontSize: '12px',
              color: '#86868b',
              marginTop: '5px'
            }}>
              Select a date and time in the future
            </small>
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
              style={{
                borderColor: eventData.EndAt && 
                             new Date(eventData.EndAt) > new Date(eventData.StartAt) ? 
                             '#d2d2d7' : '#ff3b30'
              }}
            />
            <small style={{ 
              display: eventData.StartAt && eventData.EndAt && 
                       new Date(eventData.EndAt) <= new Date(eventData.StartAt) ? 
                       'block' : 'none',
              fontSize: '12px',
              color: '#ff3b30',
              marginTop: '5px'
            }}>
              End time must be after start time
            </small>
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
            {eventToEdit ? 'Update Event' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEventForm;