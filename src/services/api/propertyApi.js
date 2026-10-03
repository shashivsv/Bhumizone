import { mockServer } from '../mock/mockServer';
import { apiClient } from './apiClient';

// Controlled by .env VITE_USE_MOCK_API (default: false to use real MongoDB & Express backend)
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

export const propertyApi = {
  getProperties: async (filters = {}, viewerUserId = null) => {
    if (USE_MOCK) return mockServer.getProperties(filters, viewerUserId);
    return apiClient.get('/properties', { params: filters });
  },

  getPropertyById: async (idOrSlug, viewerUserId = null) => {
    if (USE_MOCK) return mockServer.getPropertyById(idOrSlug, viewerUserId);
    return apiClient.get(`/properties/${idOrSlug}`);
  },

  getMyProperties: async (userId) => {
    if (USE_MOCK) return mockServer.getMyProperties(userId);
    return apiClient.get('/properties/my-listings');
  },

  createProperty: async (propertyData, userId) => {
    if (USE_MOCK) return mockServer.createProperty(propertyData, userId);
    return apiClient.post('/properties', propertyData);
  },

  updateProperty: async (id, updates, userId) => {
    if (USE_MOCK) return mockServer.updateProperty(id, updates, userId);
    return apiClient.put(`/properties/${id}`, updates);
  },

  deleteProperty: async (id) => {
    return apiClient.delete(`/properties/${id}`);
  },
};

export const subscriptionApi = {
  getPlans: async () => {
    if (USE_MOCK) return mockServer.getSubscriptionPlans();
    return apiClient.get('/subscriptions/plans');
  },

  purchasePlan: async (dealerId, planId, paymentMethod) => {
    if (USE_MOCK) return mockServer.purchaseSubscription(dealerId, planId, paymentMethod);
    return apiClient.post('/subscriptions/checkout', { planId, paymentMethod });
  },

  getTransactions: async () => {
    if (USE_MOCK) return mockServer.getTransactions();
    return apiClient.get('/subscriptions/transactions');
  },
};

export const inquiryApi = {
  sendInquiry: async (inquiryData, buyerUser) => {
    if (USE_MOCK) return mockServer.sendInquiry(inquiryData, buyerUser);
    return apiClient.post('/inquiries', inquiryData);
  },

  getMyInquiries: async (userId, role) => {
    if (USE_MOCK) {
      if (role === 'BUYER') return mockServer.getInquiriesForBuyer(userId);
      return mockServer.getInquiriesForOwnerOrDealer(userId);
    }
    return apiClient.get('/inquiries');
  },

  updateStatus: async (inquiryId, status) => {
    if (USE_MOCK) return mockServer.updateInquiryStatus(inquiryId, status);
    return apiClient.patch(`/inquiries/${inquiryId}/status`, { status });
  },
};

export const adminApi = {
  getProperties: async () => {
    if (USE_MOCK) return mockServer.getAdminProperties();
    return apiClient.get('/admin/properties');
  },

  moderateProperty: async (propertyId, action, rejectionReason) => {
    if (USE_MOCK) return mockServer.adminModerateProperty(propertyId, action, rejectionReason);
    return apiClient.patch(`/admin/properties/${propertyId}/moderate`, { action, rejectionReason });
  },

  getUsers: async () => {
    if (USE_MOCK) return mockServer.getAdminUsers();
    return apiClient.get('/admin/users');
  },

  updatePlan: async (planId, updates) => {
    if (USE_MOCK) return mockServer.updateSubscriptionPlan(planId, updates);
    return apiClient.put(`/admin/plans/${planId}`, updates);
  },
};
