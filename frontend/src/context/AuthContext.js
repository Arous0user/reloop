import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import BACKEND_URL from '../config';

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: BACKEND_URL,
});

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Validate token with backend and fetch user data
        const response = await api.get('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token'); // Remove invalid token
        setUser(null);
      }
    }
    setLoading(false);
  };

  // Check if user is logged in on initial load
  useEffect(() => {
    fetchUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { user, accessToken, refreshToken } = response.data;
      
      setUser(user);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken); // Store refresh token
      
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to log in' };
    }
  };

  // Register function
  const register = async (name, email, password, isSeller = false) => {
    try {
      const response = await api.post('/api/auth/register', { name, email, password, isSeller });
      const { user, accessToken, refreshToken } = response.data; // Extract user and tokens
      
      setUser(user); // Set user in state
      localStorage.setItem('token', accessToken); // Store access token
      localStorage.setItem('refreshToken', refreshToken); // Store refresh token
      
      return { success: true, user }; // Return success and user data
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.response?.data?.message || 'Failed to create account' };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken'); // Remove refresh token
  };

  // Refresh user data
  const refreshUser = async () => {
    await fetchUser();
  };

  const isLoggedIn = !!user;

  // Context value
  const value = {
    user,
    login,
    register,
    logout,
    loading,
    refreshUser,
    isLoggedIn,
    authToken: localStorage.getItem('token'), // Provide the auth token directly
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
