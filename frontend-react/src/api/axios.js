import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://daps-backend-fg54.onrender.com/api';

const redirectToRoute = (route) => {
  if (typeof window === 'undefined') return;

  if (window.location.pathname !== route) {
    window.history.replaceState({}, '', route);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('daps_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized - clear token and route client-side to login
      localStorage.removeItem('daps_token');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        redirectToRoute('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
