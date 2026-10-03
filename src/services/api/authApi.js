import { mockServer } from '../mock/mockServer';
import { apiClient } from './apiClient';

// Controlled by .env VITE_USE_MOCK_API (default: false to use real MongoDB & Express backend)
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

export const authApi = {
  login: async (email, password) => {
    if (USE_MOCK) return mockServer.login(email, password);
    return apiClient.post('/auth/login', { email, password });
  },

  register: async (userData) => {
    if (USE_MOCK) return mockServer.register(userData);
    return apiClient.post('/auth/register', userData);
  },

  getCurrentUser: async () => {
    if (USE_MOCK) {
      return null;
    }
    return apiClient.get('/auth/me');
  },

  toggleFavorite: async (propertyId) => {
    if (USE_MOCK) return null;
    return apiClient.post(`/auth/favorites/${propertyId}`);
  },
};
