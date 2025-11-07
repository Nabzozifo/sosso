import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Instance dédiée à l'authentification (cookies Sanctum)
const authApi = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 10000,
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCsrf = async () => {
    try {
      await authApi.get('/sanctum/csrf-cookie');
      // Lecture explicite du cookie XSRF-TOKEN et forçage de l'en-tête
      const token = (document.cookie || '')
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
      if (token) {
        authApi.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(token);
      }
    } catch (e) {
      console.error('CSRF échec:', e);
    }
  };

  const register = async ({ name, email, password, password_confirmation, country }) => {
    await getCsrf();
    // Fallback: si axios n'ajoute pas automatiquement le header, on le force
    const token = (document.cookie || '')
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    const config = token ? { headers: { 'X-XSRF-TOKEN': decodeURIComponent(token) } } : {};
    const res = await authApi.post('/register', { name, email, password, password_confirmation, country }, config);
    setUser(res.data);
    return res.data;
  };

  const login = async ({ email, password }) => {
    await getCsrf();
    const token = (document.cookie || '')
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    const config = token ? { headers: { 'X-XSRF-TOKEN': decodeURIComponent(token) } } : {};
    const res = await authApi.post('/login', { email, password }, config);
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    try {
      await authApi.post('/logout');
    } catch (e) {
      console.error('Logout error:', e);
    }
    setUser(null);
  };

  const updateProfile = async (payload) => {
    await getCsrf();
    const token = (document.cookie || '')
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
    const config = token ? { headers: { 'X-XSRF-TOKEN': decodeURIComponent(token) } } : {};
    const res = await authApi.put('/api/me', payload, config);
    setUser(res.data);
    return res.data;
  };

  const fetchMe = async () => {
    try {
      const res = await authApi.get('/api/me');
      setUser(res.data);
    } catch (e) {
      // Non connecté ou erreur : ignorer
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);