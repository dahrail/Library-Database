import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Adjust the URL as needed

// Function to get all books
export const getBooks = async () => {
  try {
    const response = await axios.get(`${API_URL}/books`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to get a single book by ID
export const getBookById = async (bookId) => {
  try {
    const response = await axios.get(`${API_URL}/books/${bookId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to create a new loan
export const createLoan = async (loanData) => {
  try {
    const response = await axios.post(`${API_URL}/loans`, loanData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to get loan history
export const getLoanHistory = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/loans/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to place a hold on an item
export const createHold = async (holdData) => {
  try {
    const response = await axios.post(`${API_URL}/holds`, holdData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to get fines for a user
export const getFines = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/fines/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};