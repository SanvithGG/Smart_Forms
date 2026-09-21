import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8088/api';

/**
 * Pre-configured Axios instance for the Spring Boot backend
 */
export const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor (for attaching auth tokens if needed)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smart_forms_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error normalization
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Network communication error';
    return Promise.reject(new Error(errorMsg));
  }
);

export default axiosClient;
