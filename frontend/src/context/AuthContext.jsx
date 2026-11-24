import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('campusease_user');
    const token = localStorage.getItem('campusease_access_token');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await api.post('/auth/login/', { username, password });
    const { access, refresh, user: userData } = response.data;
    localStorage.setItem('campusease_access_token', access);
    localStorage.setItem('campusease_refresh_token', refresh);
    localStorage.setItem('campusease_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('campusease_access_token');
    localStorage.removeItem('campusease_refresh_token');
    localStorage.removeItem('campusease_user');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        isStudent,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
