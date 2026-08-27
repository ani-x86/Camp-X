import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: '/api/v1', // Proxy to backend, assuming backend is on same host or handled by Vite/Webpack proxy
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campx_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Stubbed Auth endpoints (as backend might not exist yet)
export const authService = {
  login: async (credentials) => {
    try {
      // POST /api/v1/auth/login
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Handle network failure or non-200 responses
      if (error.response) {
        return error.response.data; // e.g. { success: false, message: "..." }
      }
      return { success: false, message: "Network error. Please try again." };
    }
  },
  signup: async (userData) => {
    try {
      // POST /api/v1/auth/signup
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        return error.response.data;
      }
      return { success: false, message: "Network error. Please try again." };
    }
  }
};

export default api;
