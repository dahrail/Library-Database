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
  const categories = ["all"]; // Removed category options as they're not in schema
  
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    roomId: 'all',
    searchTerm: '',
    eventCategory: 'all',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      roomId: 'all',
      searchTerm: '',
      eventCategory: 'all',
    });
  };

  const eventCategories = ['all', 'Workshops', 'Seminar', 'Conference'];

  const filteredEvents = events.filter((event) => {
    const matchesDate =
      (!filters.dateFrom || new Date(event.StartAt) >= new Date(filters.dateFrom)) &&
      (!filters.dateTo || new Date(event.EndAt) <= new Date(filters.dateTo));
    const matchesRoom = filters.roomId === 'all' || Number(event.RoomID) === Number(filters.roomId);
    const matchesCategory = 
      filters.eventCategory === 'all' || 
      (event.EventCategory && event.EventCategory.toLowerCase() === filters.eventCategory.toLowerCase());
    const matchesSearch = 
      !filters.searchTerm || 
      event.EventName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      (event.EventDescription && event.EventDescription.toLowerCase().includes(filters.searchTerm.toLowerCase()));
    return matchesDate && matchesRoom && matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (initialCategory) {
      setFilters(prev => ({
        ...prev,
        eventCategory: initialCategory
      }));
    }
  }, [initialCategory]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
          // Fetch attendee counts for all events
          const eventsWithCounts = await Promise.all(
            (data.events || []).map(async (event) => {
              try {
                const countResponse = await fetch(`/api/events/${event.EventID}/count`);
                const countData = await countResponse.json();
                return {
                  ...event,
                  AttendeeCount: countData.success ? countData.TotalRegistrations : 0,
                  CheckedInCount: countData.success ? countData.CheckedInCount : 0
                };
              } catch (error) {
                console.error(`Error fetching counts for event ${event.EventID}:`, error);
                return event;
              }
            })
          );
          setEvents(eventsWithCounts);
        } else {
          setError(data.error || "Failed to fetch events");
        }
      } catch (error) {
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
      }
    };

    fetchEvents();
    fetchRooms();
  }, []);

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
      alert('An error occurred while adding the event.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEvent = async (eventData) => {
    try {
      setLoading(true);
      console.log("Updating event with ID:", eventData.EventID);
      
      // Include both the original Category/Description and mapped EventCategory/EventDescription
      const response = await fetch(`/api/events/${eventData.EventID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });
      
      // Parse response before checking status to handle potential JSON parsing errors
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse response:", text);
        throw new Error("Invalid server response");
      }
      
      if (data.success) {
        alert('Event updated successfully!');
        const refreshResponse = await fetch('/api/events');
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setEvents(refreshData.events || []);
        }
        setCurrentAction(null);
      } else {
        alert('Failed to update event: ' + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Update event error:", error);
      alert('An error occurred while updating the event: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const responseText = await response.text();
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (jsonError) {
          throw new Error(`Invalid server response: ${responseText}`);
        }
        if (data.success) {
          alert('Event deleted successfully!');
          setEvents(prev => prev.filter(e => e.EventID !== eventId));
          setCurrentAction(null);
        } else {
          alert('Failed to delete event: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
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
      
      // First get the attendee list
      const response = await fetch(`/api/events/${event.EventID}/attendees`);
      const attendeeData = await response.json();
      if (attendeeData.success) {
        setEventAttendees(attendeeData.attendees || []);
      } else {
        setEventAttendees([]);
      }
      
      // Then get the current attendee counts
      const countResponse = await fetch(`/api/events/${event.EventID}/count`);
      const countData = await countResponse.json();
      if (countData.success) {
        const counts = {
          checked: countData.CheckedInCount || 0,
          total: countData.TotalRegistrations || 0
        };
        setAttendeeCount(counts);
        
        // Also update the selected event with current attendance info
        setSelectedEvent(prev => ({
          ...prev,
          AttendeeCount: counts.total,
          CheckedInCount: counts.checked
        }));
      } else {
        setAttendeeCount({ checked: 0, total: 0 });
      }
      
      setCurrentAction('detail');
    } catch (error) {
      console.error('Error loading event details:', error);
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
      const eventToRegister = events.find(e => e.EventID === eventId);
      if (eventToRegister) {
        setSelectedEvent(eventToRegister);
        setCurrentAction('register');
      }
    } catch (error) {
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
      
      // Simple API call with just the required IDs
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          UserID: userData.UserID,
          EventID: selectedEvent.EventID
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }
      
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Failed to parse server response:', responseText);
        throw new Error('Invalid response from server. Please try again later.');
      }
      
      if (data.success) {
        // Refresh the event details completely
        const refreshResponse = await fetch('/api/events');
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          // Update the main events list
          setEvents(refreshData.events || []);
          
          // Find the updated event
          const updatedEvent = refreshData.events.find(e => e.EventID === selectedEvent.EventID);
          if (updatedEvent) {
            setSelectedEvent(updatedEvent);
            
            // Get updated counts
            const countResponse = await fetch(`/api/events/${selectedEvent.EventID}/count`);
            const countData = await countResponse.json();
            if (countData.success) {
              const counts = {
                checked: countData.CheckedInCount || 0,
                total: countData.TotalRegistrations || 0
              };
              setAttendeeCount(counts);
              
              // Update selected event with attendee counts
              setSelectedEvent(prev => ({
                ...prev,
                AttendeeCount: counts.total,
                CheckedInCount: counts.checked
              }));
              
              // Also update the event in the main events array
              setEvents(prevEvents => prevEvents.map(e => 
                e.EventID === selectedEvent.EventID 
                  ? { ...e, AttendeeCount: counts.total, CheckedInCount: counts.checked }
                  : e
              ));
              
              const availableSpots = selectedEvent.MaxAttendees - counts.total;
              alert(`Registration successful! You are now registered for this event. There are ${availableSpots > 0 ? availableSpots : 0} spots remaining.`);
            } else {
              alert('Registration successful! You are now registered for this event.');
            }
            
            // Refresh the attendee list too
            const attendeeResponse = await fetch(`/api/events/${selectedEvent.EventID}/attendees`);
            const attendeeData = await attendeeResponse.json();
            if (attendeeData.success) {
              setEventAttendees(attendeeData.attendees || []);
            }
          }
        }
        setCurrentAction('detail');
      } else {
        alert('Failed to register: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message && typeof error.message === 'string') {
        if (error.message.includes('already registered')) {
          alert('You are already registered for this event.');
        } else if (error.message.includes('maximum capacity')) {
          alert('This event has reached maximum capacity.');
        } else {
          alert('An error occurred while registering for the event: ' + error.message);
        }
      } else {
        alert('An error occurred while registering for the event. Please try again later.');
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
      
      // Add the current timestamp directly when checking in
      // Use ISO format that MySQL can handle
      const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      const response = await fetch('/api/events/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          UserID: userData.UserID,
          EventID: eventId,
          CheckedInAt: currentTime
        })
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error(`Invalid server response: ${responseText}`);
      }
      
      if (data.success) {
        // Refresh all event data completely
        const refreshResponse = await fetch('/api/events');
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setEvents(refreshData.events || []);
          
          // If in detail view, refresh that specific event's data
          if (currentAction === 'detail' && selectedEvent) {
            const updatedEvent = refreshData.events.find(e => e.EventID === selectedEvent.EventID);
            if (updatedEvent) {
              setSelectedEvent(updatedEvent);
            }
            
            // Get fresh attendee data
            const attendeeResponse = await fetch(`/api/events/${selectedEvent.EventID}/attendees`);
            const attendeeData = await attendeeResponse.json();
            if (attendeeData.success) {
              setEventAttendees(attendeeData.attendees || []);
            }
            
            // Get fresh count data
            const countResponse = await fetch(`/api/events/${selectedEvent.EventID}/count`);
            const countData = await countResponse.json();
            if (countData.success) {
              const counts = {
                checked: countData.CheckedInCount || 0,
                total: countData.TotalRegistrations || 0
              };
              setAttendeeCount(counts);
              
              // Update selected event with the counts
              setSelectedEvent(prev => ({
                ...prev,
                AttendeeCount: counts.total,
                CheckedInCount: counts.checked
              }));
              
              // Also update the event in the main events array
              setEvents(prevEvents => prevEvents.map(e => 
                e.EventID === selectedEvent.EventID 
                  ? { ...e, AttendeeCount: counts.total, CheckedInCount: counts.checked }
                  : e
              ));
            }
          } else {
            // If not in detail view, find the event in the array and update its counts
            // This handles the case when checking in from the main events list
            const countResponse = await fetch(`/api/events/${eventId}/count`);
            const countData = await countResponse.json();
            if (countData.success) {
              const counts = {
                checked: countData.CheckedInCount || 0,
                total: countData.TotalRegistrations || 0
              };
              
              // Update the specific event in the array
              setEvents(prevEvents => prevEvents.map(e => 
                e.EventID === eventId 
                  ? { ...e, AttendeeCount: counts.total, CheckedInCount: counts.checked }
                  : e
              ));
            }
          }
        }
        
        alert(`Check-in successful! You are now checked in for this event.`);
      } else {
        if (data.error.includes("need to register") || data.error.includes("not registered")) {
          alert('You need to register for this event before checking in.');
        } else if (data.error.includes("already checked in")) {
          alert('You have already checked in for this event.');
        } else {
          alert('Failed to check in: ' + data.error);
        }
      }
    } catch (error) {
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

  const filterStyles = {
    filtersContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      marginBottom: "30px",
      padding: "20px",
      backgroundColor: "#f5f5f7",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    },
    filterHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px",
    },
    filterTitle: {
      fontSize: "18px",
      fontWeight: "600",
      color: "#1d1d1f",
      margin: 0,
    },
    clearButton: {
      padding: "6px 12px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#e1e1e1",
      color: "#333",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    filterRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: "15px",
    },
    filterGroup: {
      flex: "1",
      minWidth: "200px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "500",
      color: "#333",
      fontSize: "14px",
    },
    select: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      backgroundColor: "#fff",
      fontSize: "15px",
      appearance: "none",
      backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"%23333\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/><path d=\"M0 0h24v24H0z\" fill=\"none\"/></svg>')",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 10px center",
      backgroundSize: "20px",
      cursor: "pointer"
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      backgroundColor: "#fff",
      fontSize: "15px",
    },
    dateInput: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      backgroundColor: "#fff",
      fontSize: "15px",
    },
  };

  const adminStyles = {
    adminPanel: {
      marginBottom: "25px",
      padding: "15px",
      backgroundColor: "#f8f9fa",
      borderRadius: "10px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    },
    actionRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    heading: {
      margin: "0 0 15px 0",
      fontSize: "18px",
      fontWeight: "600",
    },
    button: {
      backgroundColor: "#0071e3",
      color: "white",
      border: "none",
      borderRadius: "6px",
      padding: "10px 16px",
      fontSize: "15px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    }
  };

  const eventCardStyles = {
    card: {
      borderRadius: "12px",
      overflow: "hidden",
      backgroundColor: "#fff",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    header: {
      background: "linear-gradient(135deg, #3a7bd5, #00d2ff)",
      color: "white",
      padding: "16px 20px",
      position: "relative",
    },
    headerContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    title: {
      margin: "0 0 5px 0",
      fontSize: "18px",
      fontWeight: "600",
      lineHeight: "1.3",
      flex: "1",
    },
    category: {
      display: "inline-block",
      fontSize: "12px",
      fontWeight: "600",
      padding: "3px 8px",
      borderRadius: "20px",
      backgroundColor: "rgba(255, 255, 255, 0.25)",
      marginBottom: "5px",
    },
    body: {
      padding: "16px 20px",
      flex: "1",
    },
    detailsTable: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0 8px",
    },
    detailLabel: {
      color: "#666",
      fontWeight: "500",
      fontSize: "13px",
      width: "70px",
      verticalAlign: "top",
    },
    detailValue: {
      fontSize: "14px",
      color: "#333",
    },
    footer: {
      padding: "12px 20px",
      borderTop: "1px solid #eee",
      backgroundColor: "#fafafa",
    },
    actionButtons: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      alignItems: "center",
    },
    primaryButton: {
      backgroundColor: "#0071e3",
      color: "white",
      border: "none",
      borderRadius: "18px",
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
      flexGrow: "1",
      textAlign: "center",
      transition: "all 0.2s ease",
    },
    secondaryButton: {
      backgroundColor: "#f5f5f7",
      color: "#333",
      border: "none",
      borderRadius: "18px",
      padding: "8px 16px",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    adminMenu: {
      position: "absolute",
      top: "12px",
      right: "12px",
      zIndex: "5",
    },
    menuButton: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "18px",
      transition: "all 0.2s ease",
    },
    menuDropdown: {
      position: "absolute",
      top: "40px",
      right: "0",
      backgroundColor: "white",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      borderRadius: "8px",
      padding: "8px 0",
      minWidth: "120px",
      zIndex: "10",
    },
    menuItem: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      color: "#333",
      fontSize: "14px",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
    menuItemEdit: {
      color: "#2563eb",
    },
    menuItemDelete: {
      color: "#dc2626",
    },
    statusTag: {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "500",
      backgroundColor: "#e3f9e5",
      color: "#1d8531",
      marginLeft: "auto",
    },
    badge: {
      display: "inline-block",
      padding: "3px 8px",
      borderRadius: "12px",
      fontSize: "11px",
      fontWeight: "600",
      marginBottom: "8px",
    },
    upcomingBadge: {
      backgroundColor: "#e3f9e5",
      color: "#1d8531",
    },
    pastBadge: {
      backgroundColor: "#f3f4f6", 
      color: "#6b7280",
    },
    todayBadge: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
    },
    icon: {
      marginRight: "6px",
      fontSize: "14px",
    },
    availabilityIndicator: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "4px 0",
      fontSize: "13px",
      color: "#4b5563",
      marginTop: "8px",
      marginBottom: "8px",
    },
    spotCounter: {
      fontWeight: "500",
      display: "inline-flex",
      alignItems: "center",
    },
    lowSpots: {
      color: "#b91c1c",
    },
    manySpots: {
      color: "#15803d",
    },
  };

  const getEventTimeStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < now) {
      return "past";
    } else if (start.toDateString() === now.toDateString()) {
      return "today";
    } else {
      return "upcoming";
    }
  };

  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (eventId, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === eventId ? null : eventId);
  };

  useEffect(() => {
    const closeMenus = () => setOpenMenuId(null);
    document.addEventListener('click', closeMenus);
    return () => document.removeEventListener('click', closeMenus);
  }, []);

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
      <div className="events-header">
        <div className="events-header-overlay">
          <h2>Library Events</h2>
          <p className="hero-subtitle">
            Discover upcoming library events and activities
          </p>
        </div>
      </div>
      
      <div className="events-section">
        {userData?.Role === 'Admin' && (
          <div style={adminStyles.adminPanel}>
            <div style={adminStyles.actionRow}>
              <h3 style={adminStyles.heading}>Admin Controls</h3>
              <button 
                style={adminStyles.button}
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? 'Cancel' : 'Add New Event'}
              </button>
            </div>
            {showAddForm && (
              <AddEventForm 
                onSubmit={handleAddEvent} 
                rooms={rooms}
                onCancel={() => setShowAddForm(false)}
              />
            )}
          </div>
        )}
        
        <div className="filters-section" style={filterStyles.filtersContainer}>
          <div style={filterStyles.filterHeader}>
            <h3 style={filterStyles.filterTitle}>Filter Events</h3>
            <button 
              onClick={clearFilters} 
              style={filterStyles.clearButton}
            >
              Clear Filters
            </button>
          </div>
          
          <div style={filterStyles.filterRow}>
            <div style={{...filterStyles.filterGroup, flex: 2}}>
              <label style={filterStyles.label} htmlFor="searchTerm">Search Events:</label>
              <input
                type="text"
                id="searchTerm"
                name="searchTerm"
                placeholder="Search by name or description"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                style={filterStyles.input}
              />
            </div>
            
            <div style={filterStyles.filterGroup}>
              <label style={filterStyles.label} htmlFor="eventCategory">Category:</label>
              <select
                id="eventCategory"
                name="eventCategory"
                value={filters.eventCategory}
                onChange={handleFilterChange}
                style={filterStyles.select}
              >
                {eventCategories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={filterStyles.filterRow}>
            <div style={filterStyles.filterGroup}>
              <label style={filterStyles.label} htmlFor="dateFrom">From Date:</label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                style={filterStyles.dateInput}
              />
            </div>
            
            <div style={filterStyles.filterGroup}>
              <label style={filterStyles.label} htmlFor="dateTo">To Date:</label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                style={filterStyles.dateInput}
              />
            </div>
            
            <div style={filterStyles.filterGroup}>
              <label style={filterStyles.label} htmlFor="roomId">Location:</label>
              <select
                id="roomId"
                name="roomId"
                value={filters.roomId}
                onChange={handleFilterChange}
                style={filterStyles.select}
              >
                <option value="all">All Locations</option>
                {rooms.map(room => (
                  <option key={room.RoomID} value={room.RoomID}>
                    {room.RoomName || `Room ${room.RoomNumber}`} (Capacity: {room.Capacity})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading && <p className="loading-message">Loading events...</p>}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <p>Please try again later or contact support.</p>
          </div>
        )}
        
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="no-events-message">
            <p>No events match your current filters</p>
            <button 
              onClick={clearFilters}
              className="clear-filters-btn"
            >
              Clear All Filters
            </button>
          </div>
        )}
        
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="events-grid fade-in-items">
            {filteredEvents.map(event => {
              const timeStatus = getEventTimeStatus(event.StartAt, event.EndAt);
              const registeredCount = event.AttendeeCount || 0;
              const remainingSpots = event.MaxAttendees - registeredCount;
              const isFull = remainingSpots <= 0;
              
              return (
                <div key={event.EventID} style={eventCardStyles.card}>
                  {/* Card Header */}
                  <div style={eventCardStyles.header}>
                    <div style={eventCardStyles.headerContent}>
                      <div>
                        <div style={eventCardStyles.category}>
                          {event.EventCategory || 'Event'}
                        </div>
                        <h3 style={eventCardStyles.title}>{event.EventName}</h3>
                        
                        {/* Event timing status badge */}
                        {timeStatus === "past" && (
                          <span style={{...eventCardStyles.badge, ...eventCardStyles.pastBadge}}>
                            <span style={eventCardStyles.icon}>⌛</span>Past Event
                          </span>
                        )}
                        {timeStatus === "today" && (
                          <span style={{...eventCardStyles.badge, ...eventCardStyles.todayBadge}}>
                            <span style={eventCardStyles.icon}>⭐</span>Today
                          </span>
                        )}
                        {timeStatus === "upcoming" && (
                          <span style={{...eventCardStyles.badge, ...eventCardStyles.upcomingBadge}}>
                            <span style={eventCardStyles.icon}>📅</span>Upcoming
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Admin Actions Menu */}
                    {userData?.Role === 'Admin' && (
                      <div style={eventCardStyles.adminMenu} onClick={e => e.stopPropagation()}>
                        <button 
                          style={eventCardStyles.menuButton}
                          onClick={(e) => toggleMenu(event.EventID, e)}
                          aria-label="Menu"
                        >
                          ⋮
                        </button>
                        
                        {openMenuId === event.EventID && (
                          <div style={eventCardStyles.menuDropdown}>
                            <div 
                              style={{...eventCardStyles.menuItem, ...eventCardStyles.menuItemEdit}}
                              onClick={() => {
                                setSelectedEvent(event);
                                setCurrentAction('edit');
                              }}
                            >
                              <span>✏️</span> Edit
                            </div>
                            <div 
                              style={{...eventCardStyles.menuItem, ...eventCardStyles.menuItemDelete}}
                              onClick={() => handleDeleteEvent(event.EventID)}
                            >
                              <span>🗑️</span> Delete
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Card Body - Event Details */}
                  <div style={eventCardStyles.body}>
                    <table style={eventCardStyles.detailsTable}>
                      <tbody>
                        <tr>
                          <td style={eventCardStyles.detailLabel}><span style={eventCardStyles.icon}>📆</span>Date:</td>
                          <td style={eventCardStyles.detailValue}>
                            {new Date(event.StartAt).toLocaleDateString()}
                          </td>
                        </tr>
                        <tr>
                          <td style={eventCardStyles.detailLabel}><span style={eventCardStyles.icon}>⏰</span>Time:</td>
                          <td style={eventCardStyles.detailValue}>
                            {new Date(event.StartAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                            {new Date(event.EndAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </td>
                        </tr>
                        <tr>
                          <td style={eventCardStyles.detailLabel}><span style={eventCardStyles.icon}>📍</span>Location:</td>
                          <td style={eventCardStyles.detailValue}>
                            {event.RoomNumber || 'TBA'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                    {/* Availability indicator */}
                    <div style={eventCardStyles.availabilityIndicator}>
                      <span>Attendance</span>
                      <span 
                        style={{
                          ...eventCardStyles.spotCounter, 
                          ...(remainingSpots <= 3 ? eventCardStyles.lowSpots : eventCardStyles.manySpots)
                        }}
                      >
                        {isFull ? (
                          <span>Full</span>
                        ) : (
                          <span>
                            <span style={eventCardStyles.icon}>👤</span>
                            {remainingSpots} spots left
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  {/* Card Footer - Action Buttons */}
                  <div style={eventCardStyles.footer}>
                    <div style={eventCardStyles.actionButtons}>
                      <button 
                        style={eventCardStyles.primaryButton}
                        onClick={() => handleViewEventDetails(event)}
                      >
                        View Details
                      </button>
                      
                      {userData && timeStatus !== "past" && (
                        <>
                          {!event.UserCheckedIn ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                style={{
                                  ...eventCardStyles.secondaryButton,
                                  opacity: isFull ? '0.7' : '1'
                                }}
                                onClick={() => handleRegisterForEvent(event.EventID)}
                                disabled={isFull}
                              >
                                {isFull ? 'Full' : 'Register'}
                              </button>
                              
                              <button
                                style={{
                                  ...eventCardStyles.secondaryButton,
                                  backgroundColor: '#d1fadf',
                                  color: '#15803d'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCheckInForEvent(event.EventID);
                                }}
                              >
                                Check In
                              </button>
                            </div>
                          ) : (
                            <div style={eventCardStyles.statusTag}>
                              <span>✓</span> Checked In
                            </div>
                          )}
                        </>
                      )}
                      
                      {timeStatus === "past" && (
                        <span style={{fontSize: '13px', color: '#6b7280', marginLeft: '10px'}}>
                          This event has ended
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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