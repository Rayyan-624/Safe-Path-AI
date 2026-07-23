import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('safepath_token'));
  const [loading, setLoading] = useState(true);

  // Verify session on mount or token change
  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (err) {
        console.error('Session verification failed', err);
        localStorage.removeItem('safepath_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [token]);

  // Login handler
  const login = async (firebaseToken) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { firebase_token: firebaseToken });
      localStorage.setItem('safepath_token', firebaseToken);
      setToken(firebaseToken);
      setUser(response.data);
      return response.data;
    } catch (err) {
      console.error('Login request failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (firebaseToken, displayName) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        firebase_token: firebaseToken,
        display_name: displayName,
      });
      localStorage.setItem('safepath_token', firebaseToken);
      setToken(firebaseToken);
      setUser(response.data);
      return response.data;
    } catch (err) {
      console.error('Registration request failed', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('safepath_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
