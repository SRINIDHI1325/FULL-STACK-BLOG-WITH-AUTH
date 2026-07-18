import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8082').replace(/\/$/, '');

const api = axios.create({ baseURL: `${API_URL}/api` });

// attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  },
);

export default api;
