import api from './api';

const bookService = {
  getAllBooks: async () => {
    try {
      const response = await api.get('/books');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getBookById: async (bookId) => {
    try {
      const response = await api.get(`/books/${bookId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createBook: async (bookData) => {
    try {
      const response = await api.post('/books', bookData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateBook: async (bookId, bookData) => {
    try {
      const response = await api.put(`/books/${bookId}`, bookData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteBook: async (bookId) => {
    try {
      const response = await api.delete(`/books/${bookId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default bookService;