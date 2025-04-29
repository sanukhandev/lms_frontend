import axios from 'axios';
import { secureDecode, secureEncode } from './secureEncode';

// Helper to check if running in browser
const isBrowser = typeof window !== 'undefined';

// Axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add token to each request (client-side only)
if (isBrowser) {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

// --------- Auth Token Functions ---------

export const setAuthToken = (token: string) => {
  if (!isBrowser) return;
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  if (!isBrowser) return '';
  return localStorage.getItem('authToken') || '';
};

// --------- User Role Functions ---------

export const setUserRole = (role: string) => {
  if (!isBrowser) return;
  const encoded = secureEncode(role);
  localStorage.setItem('userRoleToken', encoded);
};

export const getUserRole = () => {
  if (!isBrowser) return null;
  const encoded = localStorage.getItem('userRoleToken');
  return encoded ? secureDecode(encoded) : null;
};

// --------- User Data Functions ---------

export const setUserData = (user: object) => {
  if (!isBrowser) return;
  localStorage.setItem('userData', btoa(JSON.stringify(user)));
};

export const getUserData = () => {
  if (!isBrowser) return null;
  const data = localStorage.getItem('userData');
  return data ? JSON.parse(atob(data)) : null;
};

// --------- Clear All Auth Data ---------

export const clearAuthData = () => {
  if (!isBrowser) return;
  localStorage.clear();
};
