import axios from 'axios';
import { secureDecode, secureEncode } from './secureEncode';


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add token on request (client-only)
if (typeof window !== 'undefined') {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

// Auth token
export const setAuthToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
};
export const getAuthToken = () => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('authToken') || '';
};

// Role
export const setUserRole = (role: string) => {
  const encoded = secureEncode(role);
  localStorage.setItem('userRoleToken', encoded);
};
export const getUserRole = () => {
  const encoded = localStorage.getItem('userRoleToken');
  return encoded ? secureDecode(encoded) : null;
};

// User
export const setUserData = (user: object) => {
  localStorage.setItem('userData', btoa(JSON.stringify(user)));
};
export const getUserData = () => {
  const data = localStorage.getItem('userData');
  return data ? JSON.parse(atob(data)) : null;
};

// Clear all
export const clearAuthData = () => {
  localStorage.clear();
};
