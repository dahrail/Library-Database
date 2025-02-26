import axios from 'axios';

const API_URL = 'http://localhost:5000/api/items/';

const getAllBooks = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getBookById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const borrowBook = async (bookId, userId) => {
    try {
        const response = await axios.post(`${API_URL}${bookId}/borrow`, { userId });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const returnBook = async (bookId, userId) => {
    try {
        const response = await axios.post(`${API_URL}${bookId}/return`, { userId });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const requestHold = async (bookId, userId) => {
    try {
        const response = await axios.post(`${API_URL}${bookId}/hold`, { userId });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { getAllBooks, getBookById, borrowBook, returnBook, requestHold };