import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('crave_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('crave_token') || null;
  });
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('crave_user', JSON.stringify(user));
      localStorage.setItem('crave_token', token);
    } else {
      localStorage.removeItem('crave_user');
      localStorage.removeItem('crave_token');
    }
  }, [user, token]);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await api.register(userData);
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      setAuthError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = async (role = 'user') => {
    if (role === 'admin') {
      return login('admin@example.com', 'admin123');
    }
    return login('user@example.com', 'password123');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isAdmin: user?.role === 'admin',
        loading,
        authError,
        login,
        register,
        quickDemoLogin,
        logout,
        setAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
