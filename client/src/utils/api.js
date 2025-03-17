import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Base URL for the API

// User authentication
export const loginUser = async (credentials) => {
    return await axios.post(`${API_URL}/auth/login`, credentials);
};

export const registerUser = async (userData) => {
    return await axios.post(`${API_URL}/auth/register`, userData);
};

// Book management
export const fetchBooks = async () => {
    return await axios.get(`${API_URL}/books`);
};

export const addBook = async (bookData) => {
    return await axios.post(`${API_URL}/books`, bookData);
};

export const editBook = async (bookId, bookData) => {
    return await axios.put(`${API_URL}/books/${bookId}`, bookData);
};

export const deleteBook = async (bookId) => {
    return await axios.delete(`${API_URL}/books/${bookId}`);
};

// Borrowing management
export const borrowItem = async (borrowData) => {
    return await axios.post(`${API_URL}/borrowings`, borrowData);
};

export const returnItem = async (returnData) => {
    return await axios.post(`${API_URL}/borrowings/return`, returnData);
};

// Reports
export const fetchFineReport = async () => {
    return await axios.get(`${API_URL}/reports/fines`);
};

export const fetchInventoryReport = async () => {
    return await axios.get(`${API_URL}/reports/inventory`);
};

export const fetchBorrowingReport = async () => {
    return await axios.get(`${API_URL}/reports/borrowings`);
};