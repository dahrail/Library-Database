import api from './api';

const loanService = {
  createLoan: async (loanData) => {
    try {
      const response = await api.post('/loans', loanData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getLoanHistory: async (userId) => {
    try {
      const response = await api.get(`/loans/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  renewLoan: async (loanId) => {
    try {
      const response = await api.put(`/loans/renew/${loanId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  returnLoan: async (loanId) => {
    try {
      const response = await api.put(`/loans/return/${loanId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  getOverdueLoans: async (userId) => {
    try {
      const response = await api.get(`/loans/overdue/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default loanService;