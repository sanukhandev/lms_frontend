import axios from "axios";
import { secureEncode, secureDecode } from "./secureEncode";

// Check if window is available (SSR-safe)
const isBrowser = typeof window !== "undefined";

// Create Axios instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach Authorization header if token is available (only in browser)
if (isBrowser) {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

// --------- Token Storage ---------

export const setAuthToken = (token: string) => {
  if (isBrowser) {
  console.log("Storing test token...");
  localStorage.setItem("testKey", "testValue");
  console.log("Retrieved:", localStorage.getItem("testKey"));
}
  if (isBrowser) localStorage.setItem("authToken", token);
};

export const getAuthToken = (): string => {
  return isBrowser ? localStorage.getItem("authToken") || "" : "";
};

// --------- Role Storage ---------

export const setUserRole = (role: string) => {
  if (isBrowser) {
    const encoded = secureEncode(role);
    localStorage.setItem("userRoleToken", encoded);
  }
};

export const getUserRole = (): string | null => {
  if (!isBrowser) return null;
  const encoded = localStorage.getItem("userRoleToken");
  return encoded ? secureDecode(encoded) : null;
};

// --------- User Data Storage ---------

export const setUserData = (user: object) => {
  if (isBrowser) {
    const encoded = btoa(JSON.stringify(user));
    localStorage.setItem("userData", encoded);
  }
};

export const getUserData = (): Record<string, unknown> | null => {
  if (!isBrowser) return null;
  const encoded = localStorage.getItem("userData");
  try {
    return encoded ? JSON.parse(atob(encoded)) : null;
  } catch {
    return null;
  }
};

// --------- Clear All ---------

export const clearAuthData = () => {
  if (isBrowser) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRoleToken");
    localStorage.removeItem("userData");
  }
};
