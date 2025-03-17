import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const login = async (credentials) => {
        try {
            const response = await axios.post('/api/auth/login', credentials);
            setUser(response.data.user);
            navigate('/'); // Redirect to home after login
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('/api/auth/register', userData);
            setUser(response.data.user);
            navigate('/'); // Redirect to home after registration
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    const logout = () => {
        setUser(null);
        navigate('/login'); // Redirect to login after logout
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};