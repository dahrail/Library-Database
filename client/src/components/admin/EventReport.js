import React, { useEffect, useState } from 'react';
import '../../styles/admin/reports.css';
import DataReportChart from '../DataReportChart';

const EventReport = () => {
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'chart'
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'pie'
  const [chartMetric, setChartMetric] = useState('attendance'); // which data to visualize

  // Input fields (user input before "Generate Report")
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('all');
  const [roomIdInput, setRoomIdInput] = useState('all');
  const [eventNameInput, setEventNameInput] = useState('');
  const [sortByInput, setSortByInput] = useState('none');
  const [sortOrderInput, setSortOrderInput] = useState('asc');

  // Applied filters (used for actual filtering)
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [roomIdFilter, setRoomIdFilter] = useState('all');
  const [eventNameFilter, setEventNameFilter] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [sortOrder, setSortOrder] = useState('asc');

  const [roomsList, setRoomsList] = useState([]);
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [attendeeData, setAttendeeData] = useState({});
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  // Fetch rooms for filter dropdown
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms');
        const data = await response.json();
        if (data.success) {
          setRoomsList(data.rooms || []);
        } else {
          console.error('Failed to fetch rooms:', data.error);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  // Data aggregation for charts
  const prepareChartData = () => {
    if (!filteredData || filteredData.length === 0) return [];

    switch (chartMetric) {
      case 'attendance':
        return filteredData.map(event => ({
          label: event.EventName,
          value: event.RegisteredAttendees
        }));
      case 'checkInRate':
        return filteredData.map(event => ({
          label: event.EventName,
          value: event.CheckInRate
        }));
      case 'categories':
        const categoryData = {};
        filteredData.forEach(event => {
          const category = event.EventCategory || 'Uncategorized';
          if (!categoryData[category]) {
            categoryData[category] = 0;
          }
          categoryData[category] += event.RegisteredAttendees;
        });
        return Object.keys(categoryData).map(category => ({
          label: category,
          value: categoryData[category]
        }));
      case 'roomUtilization':
        const roomData = {};
        filteredData.forEach(event => {
          const room = event.RoomName || event.RoomNumber || 'Unknown';
          if (!roomData[room]) {
            roomData[room] = 0;
          }
          roomData[room] += 1;
        });
        return Object.keys(roomData).map(room => ({
          label: room,
          value: roomData[room]
        }));
      default:
        return [];
    }
  };

  // Calculate summary statistics
  const calculateStats = () => {
    if (!filteredData || filteredData.length === 0) {
      return { totalEvents: 0, totalAttendees: 0, avgAttendance: 0, avgCheckIn: 0 };
    }

    const totalEvents = filteredData.length;
    const totalAttendees = filteredData.reduce((sum, event) => sum + (event.RegisteredAttendees || 0), 0);
    const avgAttendance = totalEvents > 0 ? (totalAttendees / totalEvents).toFixed(1) : 0;
    
    const totalCheckIns = filteredData.reduce((sum, event) => sum + (event.CheckedInAttendees || 0), 0);
    const avgCheckIn = totalAttendees > 0 ? ((totalCheckIns / totalAttendees) * 100).toFixed(1) : 0;

    return { totalEvents, totalAttendees, avgAttendance, avgCheckIn };
  };

  // Apply filters and fetch report data
  const applyFilters = async () => {
    setStartDateFilter(startDateInput);
    setEndDateFilter(endDateInput);
    setCategoryFilter(categoryInput);
    setRoomIdFilter(roomIdInput);
    setEventNameFilter(eventNameInput);
    setSortBy(sortByInput);
    setSortOrder(sortOrderInput);
    setIsLoading(true);

    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (startDateInput) queryParams.append('startDate', startDateInput);
      if (endDateInput) queryParams.append('endDate', endDateInput);
      if (categoryInput !== 'all') queryParams.append('category', categoryInput);
      if (roomIdInput !== 'all') queryParams.append('roomId', roomIdInput);
      if (eventNameInput) queryParams.append('eventName', eventNameInput);
      if (sortByInput !== 'none') {
        queryParams.append('sortBy', sortByInput);
        queryParams.append('sortOrder', sortOrderInput);
      }
      
      const queryString = queryParams.toString();
      console.log(`Sending request to /api/eventReport?${queryString}`);
      
      const response = await fetch(`/api/eventReport?${queryString}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API response:", data);
      
      if (data.success) {
        console.log(`Retrieved ${data.data.length} event records`);
        const serverData = data.data;
        
        // Apply client-side filtering for event name if needed
        let filteredResult = [...serverData];
        
        // Add client-side event name filtering if the field has a value
        if (eventNameInput) {
          const searchTerm = eventNameInput.toLowerCase();
          filteredResult = filteredResult.filter(event => 
            (event.EventName && event.EventName.toLowerCase().includes(searchTerm)) || 
            (event.EventDescription && event.EventDescription.toLowerCase().includes(searchTerm))
          );
          console.log(`Client-side filtered to ${filteredResult.length} events matching "${eventNameInput}"`);
        }
        
        setReportData(serverData);
        setFilteredData(filteredResult);
      } else {
        console.error('Failed to fetch event report:', data.error);
      }
    } catch (error) {
      console.error('Error fetching event report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    applyFilters();
  }, []);

  // Apply client-side sorting if needed
  useEffect(() => {
    if (filteredData.length > 0 && sortBy !== 'none') {
      const sorted = [...filteredData].sort((a, b) => {
        let aValue, bValue;
        
        switch(sortBy) {
          case 'RegisteredAttendees':
            aValue = a.RegisteredAttendees || 0;
            bValue = b.RegisteredAttendees || 0;
            break;
          case 'CheckedInAttendees':
            aValue = a.CheckedInAttendees || 0;
            bValue = b.CheckedInAttendees || 0;
            break;
          case 'CheckInRate':
            aValue = a.CheckInRate || 0;
            bValue = b.CheckInRate || 0;
            break;
          case 'EventName':
            aValue = a.EventName || '';
            bValue = b.EventName || '';
            return sortOrder === 'asc' 
              ? aValue.localeCompare(bValue) 
              : bValue.localeCompare(aValue);
          case 'StartDate':
            aValue = new Date(a.StartAt || 0).getTime();
            bValue = new Date(b.StartAt || 0).getTime();
            break;
          default:
            return 0;
        }
        
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });
      
      setFilteredData(sorted);
    }
  }, [sortBy, sortOrder, reportData]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  // Format check-in time
  const formatCheckInTime = (dateString) => {
    if (!dateString) return 'Not checked in';
    
    const date = new Date(dateString);
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleDateString(undefined, options);
  };

  // Get attendees for a specific event
  const fetchEventAttendees = async (eventId) => {
    if (attendeeData[eventId]) {
      // If we already have the data, just toggle the expanded state
      setExpandedEventId(expandedEventId === eventId ? null : eventId);
      return;
    }
    
    try {
      setLoadingAttendees(true);
      const response = await fetch(`/api/events/${eventId}/attendees`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAttendeeData(prev => ({
          ...prev,
          [eventId]: data.attendees || []
        }));
        setExpandedEventId(eventId);
      } else {
        console.error('Failed to fetch attendees:', data.error);
      }
    } catch (error) {
      console.error('Error fetching attendees:', error);
    } finally {
      setLoadingAttendees(false);
    }
  };

  const eventCategories = ['all', 'Workshops', 'Seminar', 'Conference'];
  const chartData = prepareChartData();
  const stats = calculateStats();

  return (
    <div className="event-report">
      <h3>Event Report</h3>

      {/* View toggle */}
      <div className="view-toggle" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', justifyContent: 'end' }}>
        <button 
          onClick={() => setViewMode('table')} 
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: viewMode === 'table' ? '#0071e3' : '#e1e1e1',
            color: viewMode === 'table' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Table View
        </button>
        <button 
          onClick={() => setViewMode('chart')} 
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: viewMode === 'chart' ? '#0071e3' : '#e1e1e1',
            color: viewMode === 'chart' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Chart View
        </button>
      </div>

      {/* Filters */}
      <div className="filters" style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        <label>
          Event Name:&nbsp;
          <input
            type="text"
            value={eventNameInput}
            onChange={e => setEventNameInput(e.target.value)}
            placeholder="Search by event name"
          />
        </label>

        <label>
          Start Date:&nbsp;
          <input
            type="date"
            value={startDateInput}
            onChange={e => setStartDateInput(e.target.value)}
          />
        </label>

        <label>
          End Date:&nbsp;
          <input
            type="date"
            value={endDateInput}
            onChange={e => setEndDateInput(e.target.value)}
          />
        </label>

        <label>
          Category:&nbsp;
          <select value={categoryInput} onChange={e => setCategoryInput(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Workshops">Workshops</option>
            <option value="Seminar">Seminar</option>
            <option value="Conference">Conference</option>
          </select>
        </label>

        <label>
          Room:&nbsp;
          <select value={roomIdInput} onChange={e => setRoomIdInput(e.target.value)}>
            <option value="all">All Rooms</option>
            {roomsList.map(room => (
              <option key={room.RoomID} value={room.RoomID}>
                {room.RoomName || room.RoomNumber}
              </option>
            ))}
          </select>
        </label>
        
        <label>
          Sort by:&nbsp;
          <select value={sortByInput} onChange={e => setSortByInput(e.target.value)}>
            <option value="none">None</option>
            <option value="RegisteredAttendees">Total Registrations</option>
            <option value="CheckedInAttendees">Check-ins</option>
            <option value="CheckInRate">Check-in Rate</option>
            <option value="EventName">Event Name</option>
            <option value="StartDate">Start Date</option>
          </select>
        </label>

        <label>
          Order:&nbsp;
          <select
            value={sortOrderInput}
            onChange={e => setSortOrderInput(e.target.value)}
            disabled={sortByInput === 'none'}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>

        <button onClick={applyFilters} style={{ height: 'fit-content', padding: '0.5rem 1rem' }}>
          Generate Report
        </button>
      </div>

      {/* Summary Statistics */}
      <div className="summary-stats" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        margin: '1rem 0', 
        backgroundColor: '#f5f5f7', 
        padding: '1rem', 
        borderRadius: '8px' 
      }}>
        <div className="stat-box">
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalEvents}</div>
          <div>Total Events</div>
        </div>
        <div className="stat-box">
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalAttendees}</div>
          <div>Total Registrations</div>
        </div>
        <div className="stat-box">
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.avgAttendance}</div>
          <div>Avg. Attendees per Event</div>
        </div>
        <div className="stat-box">
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.avgCheckIn}%</div>
          <div>Avg. Check-in Rate</div>
        </div>
      </div>

      {/* Chart View */}
      {viewMode === 'chart' && (
        <div className="chart-container">
          <div className="chart-controls" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
            <label>
              Chart Type:&nbsp;
              <select value={chartType} onChange={e => setChartType(e.target.value)}>
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
              </select>
            </label>
            <label>
              Data to Show:&nbsp;
              <select value={chartMetric} onChange={e => setChartMetric(e.target.value)}>
                <option value="attendance">Attendance by Event</option>
                <option value="checkInRate">Check-in Rate by Event</option>
                <option value="categories">Attendance by Category</option>
                <option value="roomUtilization">Events by Room</option>
              </select>
            </label>
          </div>
          
          {isLoading ? (
            <p>Loading chart data...</p>
          ) : chartData.length === 0 ? (
            <p>No data available for chart visualization.</p>
          ) : (
            <div style={{ height: '400px' }}>
              <DataReportChart reportData={chartData} chartType={chartType} />
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        isLoading ? (
          <p>Loading...</p>
        ) : (
          <table style={{ 
            width: '100%', 
            borderCollapse: 'separate',
            borderSpacing: '0',
            marginTop: '20px'
          }}>
            <thead>
              <tr>
                <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'left' }}></th> {/* Column for expand/collapse button */}
                <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Event ID</th>
                <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Event Name</th>
                <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Start Date</th>
                <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Start Time</th>
                <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>End Date</th>
                <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>End Time</th>
                <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Room</th>
                <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'left' }}>Organizer</th>
                <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Registered</th>
                <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Checked In</th>
                <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Max Capacity</th>
                <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Attendance %</th>
                <th style={{ padding: '12px 15px', borderBottom: '2px solid #ddd', textAlign: 'right' }}>Check-in %</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr><td colSpan="15" style={{ padding: '15px', textAlign: 'center' }}>No results found.</td></tr>
              ) : (
                filteredData.map((event, index) => (
                  <React.Fragment key={event.EventID}>
                    <tr style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
                      <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee' }}>
                        <button 
                          onClick={() => fetchEventAttendees(event.EventID)}
                          style={{ 
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            color: '#0071e3',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          {expandedEventId === event.EventID ? '−' : '+'}
                        </button>
                      </td>
                      <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee' }}>{event.EventID}</td>
                      <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', fontWeight: '500' }}>{event.EventName}</td>
                      <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee' }}>{event.EventCategory}</td>
                      <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee' }}>{formatDate(event.StartAt)}</td>
                      <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee' }}>{formatTime(event.StartAt)}</td>
                      <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee' }}>{formatDate(event.EndAt)}</td>
                      <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee' }}>{formatTime(event.EndAt)}</td>
                      <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee' }}>{event.RoomName || event.RoomNumber || 'N/A'}</td>
                      <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee' }}>{`${event.OrganizerFirstName || ''} ${event.OrganizerLastName || ''}`.trim() || 'N/A'}</td>
                      <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{event.RegisteredAttendees}</td>
                      <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{event.CheckedInAttendees}</td>
                      <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{event.MaxAttendees}</td>
                      <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{event.AttendanceRate}%</td>
                      <td style={{ padding: '12px 15px', borderBottom: '1px solid #eee', textAlign: 'right' }}>{event.CheckInRate}%</td>
                    </tr>
                    {expandedEventId === event.EventID && (
                      <tr>
                        <td colSpan="15" style={{ padding: '0' }}>
                          <div style={{ 
                            padding: '20px 25px', 
                            backgroundColor: '#f8f9fa',
                            borderTop: '1px solid #e9ecef',
                            borderBottom: '1px solid #e9ecef',
                            margin: '0 0 10px 0'
                          }}>
                            <h4 style={{ margin: '5px 0 20px 0', fontSize: '16px' }}>Attendee Details</h4>
                            
                            {loadingAttendees ? (
                              <p style={{ padding: '10px 0', color: '#666' }}>Loading attendees...</p>
                            ) : attendeeData[event.EventID]?.length > 0 ? (
                              <table style={{ 
                                width: '100%', 
                                marginBottom: '10px', 
                                borderCollapse: 'collapse', 
                                fontSize: '14px' 
                              }}>
                                <thead>
                                  <tr>
                                    <th style={{ padding: '10px 15px', borderBottom: '2px solid #ddd', textAlign: 'left', backgroundColor: '#f1f1f1' }}>User ID</th>
                                    <th style={{ padding: '10px 15px', borderBottom: '2px solid #ddd', textAlign: 'left', backgroundColor: '#f1f1f1' }}>Name</th>
                                    <th style={{ padding: '10px 15px', borderBottom: '2px solid #ddd', textAlign: 'left', backgroundColor: '#f1f1f1' }}>Email</th>
                                    <th style={{ padding: '10px 15px', borderBottom: '2px solid #ddd', textAlign: 'left', backgroundColor: '#f1f1f1' }}>Check-in Status</th>
                                    <th style={{ padding: '10px 15px', borderBottom: '2px solid #ddd', textAlign: 'left', backgroundColor: '#f1f1f1' }}>Check-in Time</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {attendeeData[event.EventID].map((attendee, idx) => (
                                    <tr key={attendee.EventAttendeeID} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
                                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee' }}>{attendee.UserID}</td>
                                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee' }}>{attendee.FirstName} {attendee.LastName}</td>
                                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee' }}>{attendee.Email}</td>
                                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee' }}>
                                        <span style={{
                                          display: 'inline-block',
                                          padding: '4px 8px',
                                          borderRadius: '4px',
                                          backgroundColor: attendee.CheckedIn === 1 ? '#d1fadf' : '#f3f4f6',
                                          color: attendee.CheckedIn === 1 ? '#15803d' : '#6b7280',
                                          fontSize: '13px'
                                        }}>
                                          {attendee.CheckedIn === 1 ? 'Checked In' : 'Registered'}
                                        </span>
                                      </td>
                                      <td style={{ padding: '10px 15px', borderBottom: '1px solid #eee' }}>{formatCheckInTime(attendee.CheckedInAt)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p style={{ padding: '10px 0', color: '#666' }}>No attendees found for this event.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default EventReport;