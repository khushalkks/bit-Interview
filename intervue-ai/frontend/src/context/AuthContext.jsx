import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('bit_interview_token'));
  const [loading, setLoading] = useState(true);

  // Initialize session on mount via MongoDB backend
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
        } catch (err) {
          console.error('Session expired or invalid token:', err);
          logout();
        }
      }
      setLoading(false);
    }

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem('bit_interview_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password, targetRole) => {
    const data = await authAPI.register(name, email, password, targetRole);
    localStorage.setItem('bit_interview_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const loginWithOAuth = async (provider = 'google') => {
    const data = await authAPI.oauthMock(provider);
    localStorage.setItem('bit_interview_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('bit_interview_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginWithOAuth, logout, isSupabaseConfigured: false }}>
      {children}
    </AuthContext.Provider>
  );
}
