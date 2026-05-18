import { createContext, useState, useEffect, useContext } from 'react';
import client from '../api/client';
import * as authApi from '../api/auth';

// Create the context object
const AuthContext = createContext(null);

// Provider component — wraps the whole app and supplies the auth state
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app startup, check if we have a token and fetch the user info
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Try to fetch current user info to verify token is still valid
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchCurrentUser() {
    try {
      // We need a "who am I" endpoint — we'll add this to Django shortly
      const response = await client.get('/auth/me/');
      setUser(response.data);
    } catch (err) {
      // Token invalid or expired
      authApi.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(username, password) {
    await authApi.login(username, password);
    await fetchCurrentUser();
  }

  function logout() {
    authApi.logout();
    setUser(null);
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin: user?.is_staff || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook — easier way for components to access the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}