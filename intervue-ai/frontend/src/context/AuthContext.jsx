import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { supabase, isSupabaseConfigured } from '../services/supabase';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('bit_interview_token'));
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    async function loadUser() {
      // 1. Supabase Session Check
      if (isSupabaseConfigured) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const supabaseUser = {
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email,
              target_role: session.user.user_metadata?.target_role || 'Senior SWE'
            };
            setUser(supabaseUser);
            setToken(session.access_token);
            localStorage.setItem('bit_interview_token', session.access_token);
            setLoading(false);
            return;
          }
        } catch (supaErr) {
          console.warn('Supabase session load error (falling back to backend token):', supaErr);
        }
      }

      // 2. Fallback FastAPI JWT session load
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

    // Supabase auth state listener
    let authListener = null;
    if (isSupabaseConfigured) {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setUser({
              id: session.user.id,
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email,
              target_role: session.user.user_metadata?.target_role || 'Senior SWE'
            });
            setToken(session.access_token);
            localStorage.setItem('bit_interview_token', session.access_token);
          }
        });
        authListener = subscription;
      } catch (listenerErr) {
        console.warn('Supabase auth state change subscription error:', listenerErr);
      }
    }

    return () => {
      if (authListener) authListener.unsubscribe();
    };
  }, [token]);

  const login = async (email, password) => {
    // 1. Try FastAPI backend first (handles instant demo accounts and registered users)
    try {
      const data = await authAPI.login(email, password);
      localStorage.setItem('bit_interview_token', data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      return data.user;
    } catch (apiErr) {
      // 2. If backend auth fails and Supabase is configured, attempt Supabase authentication
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (!error && data?.user) {
            const userObj = {
              id: data.user.id,
              name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
              email: data.user.email,
              target_role: data.user.user_metadata?.target_role || 'Senior SWE'
            };
            if (data.session) {
              localStorage.setItem('bit_interview_token', data.session.access_token);
              setToken(data.session.access_token);
            }
            setUser(userObj);
            return userObj;
          }
        } catch (supaErr) {
          console.warn('Supabase login fallback also failed:', supaErr);
        }
      }
      throw apiErr;
    }
  };

  const register = async (name, email, password, targetRole) => {
    try {
      const data = await authAPI.register(name, email, password, targetRole);
      localStorage.setItem('bit_interview_token', data.access_token);
      setToken(data.access_token);
      setUser(data.user);

      // Mirror registration in Supabase in background if enabled
      if (isSupabaseConfigured) {
        try {
          await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: name, target_role: targetRole }
            }
          });
        } catch (supaSyncErr) {
          console.warn('Background Supabase registration sync skipped:', supaSyncErr);
        }
      }
      return data.user;
    } catch (apiErr) {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, target_role: targetRole }
          }
        });
        if (error) throw error;
        const userObj = {
          id: data.user?.id || 'usr_registered',
          name,
          email,
          target_role: targetRole || 'Senior SWE'
        };
        if (data.session) {
          localStorage.setItem('bit_interview_token', data.session.access_token);
          setToken(data.session.access_token);
        }
        setUser(userObj);
        return userObj;
      }
      throw apiErr;
    }
  };

  const loginWithOAuth = async (provider = 'google') => {
    if (!isSupabaseConfigured) {
      throw new Error('Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to enable OAuth logins.');
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/dashboard'
      }
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('bit_interview_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginWithOAuth, logout, isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
}

