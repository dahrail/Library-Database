import api from './api';

const fineService = {
  getFines: async (userId) => {
    try {
      const response = await api.get(`/fines/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching fines: ' + error.message);
    }
  },

  payFine: async (fineId) => {
    try {
      const response = await api.put(`/fines/pay/${fineId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error paying fine: ' + error.message);
    }
  },

  getFineDetails: async (fineId) => {
    try {
      const response = await api.get(`/fines/details/${fineId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching fine details: ' + error.message);
    }
  },

  getOverdueFines: async (userId) => {
    try {
      const response = await api.get(`/fines/overdue/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching overdue fines: ' + error.message);
    }
  },
};

export default fineService;