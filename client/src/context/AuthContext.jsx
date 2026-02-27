import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data);
                } catch (error) {
                    console.error(error);
                    setToken(null);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        setUser(res.data);
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
    };

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        setUser(res.data);
        setToken(res.data.token);
        localStorage.setItem('token', res.data.token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    const updatePassword = async (currentPassword, newPassword) => {
        await api.put('/auth/updatepassword', { currentPassword, newPassword });
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, updatePassword }}>
            {children}
        </AuthContext.Provider>
    );
};
