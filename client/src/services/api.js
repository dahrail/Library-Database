// API service for making requests to the backend

const API = {
  // Auth API calls
  login: async (email, password) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userData, Role: "Student" }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  },

  // Books API calls
  getBooks: async (userId) => {
    try {
      // If userId is provided, fetch user-specific book info
      const endpoint = userId ? `/api/books/${userId}` : '/api/books';
      const response = await fetch(endpoint);
      return await response.json();
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  },

  addBook: async (bookData) => {
    try {
      const response = await fetch("/api/addBook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error adding book:", error);
      throw error;
    }
  },

  confirmLoan: async (bookId, userId, role) => {
    try {
      const response = await fetch("/api/confirmLoan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          BookID: bookId,
          UserID: userId,
          Role: role,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error confirming loan:", error);
      throw error;
    }
  },

  confirmHold: async (userId, itemId) => {
    try {
      const response = await fetch("/api/confirmHold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserID: userId,
          ItemType: "Book",
          ItemID: itemId,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error placing hold:", error);
      throw error;
    }
  },

  // Loans API calls
  getLoans: async (userId) => {
    try {
      const response = await fetch(`/api/loans/${userId}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching loans:", error);
      throw error;
    }
  },

  confirmReturn: async (loanId) => {
    try {
      console.log("Sending LoanID to backend:", loanId); // Debugging line
      const response = await fetch("/api/confirmReturn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ LoanID: loanId }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error confirming return:", error);
      throw error;
    }
  },

  // Holds API calls
  getHolds: async (userId) => {
    try {
      const response = await fetch(`/api/holds/${userId}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching holds:", error);
      throw error;
    }
  },

  // Fines API calls
  getFines: async (userId) => {
    try {
      const response = await fetch(`/api/fines/${userId}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching fines:", error);
      throw error;
    }
  },

  // Events API calls
  getEvents: async () => {
    try {
      const response = await fetch('/api/events');
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch events');
      }
      return data.events || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  addEvent: async (eventData) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  },
  
  registerForEvent: async (userId, eventId) => {
    try {
      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ UserID: userId, EventID: eventId }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  },

  // Media API calls
  getMedia: async () => {
    try {
      const response = await fetch("/api/media");
      return await response.json();
    } catch (error) {
      console.error("Error fetching media:", error);
      throw error;
    }
  },

  borrowMedia: async (userId, mediaId) => {
    try {
      const response = await fetch("/api/borrowMedia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserID: userId, MediaID: mediaId }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error borrowing media:", error);
      throw error;
    }
  },

  holdMedia: async (userId, mediaId) => {
    try {
      const response = await fetch("/api/holdMedia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserID: userId, MediaID: mediaId }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error holding media:", error);
      throw error;
    }
  },

  // Devices API calls
  getDevices: async () => {
    try {
      const response = await fetch("/api/device");
      return await response.json();
    } catch (error) {
      console.error("Error fetching devices:", error);
      throw error;
    }
  },
  addDevice: async (deviceData) => {
    try {
      const response = await fetch("/api/addDevice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deviceData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error adding device:", error);
      throw error;
    }
  },

  borrowDevice: async (userId, deviceId) => {
    try {
      const response = await fetch("/api/borrowDevice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserID: userId, DeviceID: deviceId }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error borrowing device:", error);
      throw error;
    }
  },
  holdDevice: async (userId, deviceId) => {
    try {
      const response = await fetch("/api/holdDevice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserID: userId, DeviceID: deviceId }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error holding device:", error);
      throw error;
    }
  },
  returnDevice: async (userId, deviceId) => {
    try {
      const response = await fetch("/api/returnDevice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserID: userId, DeviceID: deviceId }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error returning device:", error);
      throw error;
    }
  },
};

export default API;