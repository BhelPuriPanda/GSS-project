import api from '../api/axios';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { uniqueId: email, password });
    if (response.data.success && response.data.token) {
      localStorage.setItem('daps_token', response.data.token);
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success && response.data.token) {
      localStorage.setItem('daps_token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('daps_token');
    window.location.hash = '/login';
  },

  getCurrentUser: async () => {
    // This assumes there's a /me endpoint, common in JWT setups
    // Based on FRONTEND_INTEGRATION.md, media/me is there, 
    // but auth/me isn't explicitly mentioned, so we'll just check if token exists
    return !!localStorage.getItem('daps_token');
  }
};

export default authService;
