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
};

export default API;
