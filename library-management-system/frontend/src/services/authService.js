import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

const register = async (username, email, password) => {
    const response = await axios.post(API_URL + 'register', {
        username,
        email,
        password,
    });
    return response.data;
};

const login = async (username, password) => {
    const response = await axios.post(API_URL + 'login', {
        username,
        password,
    });
    if (response.data.accessToken) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

export default {
    register,
    login,
    logout,
    getCurrentUser,
};