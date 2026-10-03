import {
  INITIAL_USERS,
  INITIAL_PROPERTIES,
  INITIAL_INQUIRIES,
  INITIAL_TRANSACTIONS,
} from './mockData';
import { DEFAULT_SUBSCRIPTION_PLANS } from '../../config/subscriptionPlans';
import { ROLES } from '../../config/roles';
import { PROPERTY_STATUS } from '../../config/propertyConstants';

const STORAGE_KEYS = {
  USERS: 'ghardekho_mock_users',
  PROPERTIES: 'ghardekho_mock_properties',
  INQUIRIES: 'ghardekho_mock_inquiries',
  TRANSACTIONS: 'ghardekho_mock_transactions',
  PLANS: 'ghardekho_mock_plans',
};

function getStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

// In-Memory / LocalStorage initialized state
let users = getStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
let properties = getStorage(STORAGE_KEYS.PROPERTIES, INITIAL_PROPERTIES);
let inquiries = getStorage(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES);
let transactions = getStorage(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
let plans = getStorage(STORAGE_KEYS.PLANS, DEFAULT_SUBSCRIPTION_PLANS);

/**
 * CRITICAL BUSINESS & SECURITY RULE:
 * Mask dealer phone number on the server if no active subscription.
 */
function sanitizePropertyForClient(property, viewerUserId = null) {
  const seller = users.find((u) => u.id === property.listedByUserId) || {
    id: property.listedByUserId,
    name: 'GharDekho Representative',
    role: ROLES.OWNER,
    phone: '+91 99999 00000',
  };

  let contactInfo = {
    phone: null,
    email: null,
    contactHidden: false,
    hideReason: null,
    canInquireViaForm: true,
  };

  if (seller.role === ROLES.DEALER) {
    const isSubscribed = Boolean(seller.subscription?.isActive);

    if (isSubscribed) {
      contactInfo.phone = seller.phone;
      contactInfo.email = seller.email;
      contactInfo.contactHidden = false;
    } else {
      // Backend strips the contact number completely!
      contactInfo.phone = null;
      contactInfo.email = null;
      contactInfo.contactHidden = true;
      contactInfo.hideReason = 'SUBSCRIPTION_REQUIRED';
    }
  } else {
    // Owner contact is visible
    contactInfo.phone = seller.phone;
    contactInfo.email = seller.email;
    contactInfo.contactHidden = false;
  }

  // Check if current viewer is the dealer themselves
  const isOwnerViewingSelf = viewerUserId && viewerUserId === seller.id;

  return {
    ...property,
    listedBy: {
      id: seller.id,
      name: seller.name,
      role: seller.role,
      agencyName: seller.agencyName || null,
      avatar: seller.avatar || null,
      city: seller.city || null,
      contactInfo,
      isSelf: Boolean(isOwnerViewingSelf),
      subscriptionStatus: seller.subscription || null,
    },
  };
}

export const mockServer = {
  // RESET DATA FOR DEMO PURPOSES
  resetData: () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.PROPERTIES);
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.PLANS);
    users = INITIAL_USERS;
    properties = INITIAL_PROPERTIES;
    inquiries = INITIAL_INQUIRIES;
    transactions = INITIAL_TRANSACTIONS;
    plans = DEFAULT_SUBSCRIPTION_PLANS;
    setStorage(STORAGE_KEYS.USERS, users);
    setStorage(STORAGE_KEYS.PROPERTIES, properties);
    setStorage(STORAGE_KEYS.INQUIRIES, inquiries);
    setStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
    setStorage(STORAGE_KEYS.PLANS, plans);
    return true;
  },

  // AUTHENTICATION
  login: async (email, password = '') => {
    await new Promise((r) => setTimeout(r, 200));
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw { message: 'Invalid credentials. Please check your email and password.' };
    }
    return {
      token: `mock_jwt_token_${user.id}_${Date.now()}`,
      user,
    };
  },

  register: async (userData) => {
    await new Promise((r) => setTimeout(r, 300));
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw { message: 'An account with this email address already exists.' };
    }

    const newUser = {
      id: `usr_${userData.role.toLowerCase()}_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone,
      agencyName: userData.agencyName || null,
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
      city: userData.city || 'Mumbai',
      savedProperties: [],
      subscription:
        userData.role === ROLES.DEALER
          ? {
              planId: null,
              isActive: false,
              isExpired: false,
              expiresAt: null,
              daysRemaining: 0,
            }
          : null,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    setStorage(STORAGE_KEYS.USERS, users);

    return {
      token: `mock_jwt_token_${newUser.id}_${Date.now()}`,
      user: newUser,
    };
  },

  // PROPERTIES SEARCH & RETRIEVAL
  getProperties: async (filters = {}, viewerUserId = null) => {
    await new Promise((r) => setTimeout(r, 150));

    let result = properties.filter((p) => p.status === PROPERTY_STATUS.PUBLISHED);

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.locality.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q)
      );
    }

    if (filters.type && filters.type !== 'ALL') {
      result = result.filter((p) => p.type === filters.type);
    }

    if (filters.city && filters.city !== 'ALL') {
      result = result.filter((p) => p.city.toLowerCase() === filters.city.toLowerCase());
    }

    if (filters.category && filters.category !== 'ALL') {
      result = result.filter((p) => p.category === filters.category);
    }

    if (filters.bhk && filters.bhk.length > 0) {
      const bhkList = Array.isArray(filters.bhk) ? filters.bhk : [filters.bhk];
      result = result.filter((p) => bhkList.includes(p.bhk));
    }

    if (filters.minPrice) {
      result = result.filter((p) => p.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= Number(filters.maxPrice));
    }

    // Apply Sorting
    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else {
      // Default: newest first
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Sanitize contact info for each returned property
    return result.map((p) => sanitizePropertyForClient(p, viewerUserId));
  },

  getPropertyById: async (idOrSlug, viewerUserId = null) => {
    await new Promise((r) => setTimeout(r, 100));
    const property = properties.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (!property) {
      throw { message: 'Property not found.' };
    }
    return sanitizePropertyForClient(property, viewerUserId);
  },

  getMyProperties: async (userId) => {
    await new Promise((r) => setTimeout(r, 150));
    const list = properties.filter((p) => p.listedByUserId === userId);
    return list.map((p) => sanitizePropertyForClient(p, userId));
  },

  createProperty: async (propertyData, userId) => {
    await new Promise((r) => setTimeout(r, 300));
    const newProperty = {
      ...propertyData,
      id: `prop_${Date.now()}`,
      slug: `${propertyData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`,
      listedByUserId: userId,
      status: propertyData.status || PROPERTY_STATUS.PENDING_APPROVAL,
      viewsCount: 0,
      inquiriesCount: 0,
      createdAt: new Date().toISOString(),
    };

    properties.unshift(newProperty);
    setStorage(STORAGE_KEYS.PROPERTIES, properties);
    return sanitizePropertyForClient(newProperty, userId);
  },

  updateProperty: async (id, updates, userId) => {
    await new Promise((r) => setTimeout(r, 200));
    const index = properties.findIndex((p) => p.id === id && p.listedByUserId === userId);
    if (index === -1) {
      throw { message: 'Property not found or unauthorized.' };
    }

    properties[index] = {
      ...properties[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setStorage(STORAGE_KEYS.PROPERTIES, properties);
    return sanitizePropertyForClient(properties[index], userId);
  },

  // ADMIN ACTIONS: APPROVE / REJECT
  adminModerateProperty: async (propertyId, action, rejectionReason = null) => {
    await new Promise((r) => setTimeout(r, 200));
    const index = properties.findIndex((p) => p.id === propertyId);
    if (index === -1) {
      throw { message: 'Property not found.' };
    }

    if (action === 'APPROVE') {
      properties[index].status = PROPERTY_STATUS.PUBLISHED;
      properties[index].isVerified = true;
      properties[index].rejectionReason = null;
    } else if (action === 'REJECT') {
      properties[index].status = PROPERTY_STATUS.REJECTED;
      properties[index].rejectionReason = rejectionReason || 'Property did not meet listing guidelines.';
    }

    setStorage(STORAGE_KEYS.PROPERTIES, properties);
    return sanitizePropertyForClient(properties[index]);
  },

  getAdminProperties: async () => {
    await new Promise((r) => setTimeout(r, 150));
    return properties.map((p) => sanitizePropertyForClient(p));
  },

  getAdminUsers: async () => {
    await new Promise((r) => setTimeout(r, 150));
    return users.map((u) => {
      const userProps = properties.filter((p) => p.listedByUserId === u.id);
      return {
        ...u,
        propertiesCount: userProps.length,
      };
    });
  },

  // SUBSCRIPTION & CHECKOUT ENGINE
  getSubscriptionPlans: async () => {
    await new Promise((r) => setTimeout(r, 100));
    return plans;
  },

  updateSubscriptionPlan: async (planId, updates) => {
    await new Promise((r) => setTimeout(r, 150));
    const index = plans.findIndex((p) => p.id === planId);
    if (index === -1) throw { message: 'Plan not found.' };

    plans[index] = { ...plans[index], ...updates };
    setStorage(STORAGE_KEYS.PLANS, plans);
    return plans[index];
  },

  purchaseSubscription: async (dealerId, planId, paymentMethod = 'UPI / Razorpay') => {
    await new Promise((r) => setTimeout(r, 400));
    const dealerIndex = users.findIndex((u) => u.id === dealerId);
    if (dealerIndex === -1) throw { message: 'Dealer account not found.' };

    const selectedPlan = plans.find((p) => p.id === planId);
    if (!selectedPlan) throw { message: 'Invalid subscription plan.' };

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + selectedPlan.durationMonths);

    const subscriptionData = {
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      isActive: true,
      isExpired: false,
      startedAt: startDate.toISOString(),
      expiresAt: expiryDate.toISOString(),
      daysRemaining: selectedPlan.durationMonths * 30,
    };

    users[dealerIndex].subscription = subscriptionData;
    setStorage(STORAGE_KEYS.USERS, users);

    // Record Transaction
    const newTxn = {
      id: `txn_${Date.now()}`,
      dealerId: users[dealerIndex].id,
      dealerName: users[dealerIndex].name,
      agencyName: users[dealerIndex].agencyName || null,
      planId: selectedPlan.id,
      planName: `${selectedPlan.name} (${selectedPlan.durationLabel})`,
      amount: selectedPlan.price,
      paymentMethod,
      status: 'SUCCESS',
      referenceId: `RZP_MOCK_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      createdAt: new Date().toISOString(),
    };
    transactions.unshift(newTxn);
    setStorage(STORAGE_KEYS.TRANSACTIONS, transactions);

    return {
      user: users[dealerIndex],
      subscription: subscriptionData,
      transaction: newTxn,
    };
  },

  getTransactions: async () => {
    await new Promise((r) => setTimeout(r, 100));
    return transactions;
  },

  // INQUIRIES / LEADS CRM
  sendInquiry: async (inquiryData, buyerUser = null) => {
    await new Promise((r) => setTimeout(r, 250));
    const newInquiry = {
      id: `inq_${Date.now()}`,
      propertyId: inquiryData.propertyId,
      propertyTitle: inquiryData.propertyTitle,
      buyerId: buyerUser?.id || null,
      buyerName: inquiryData.buyerName,
      buyerEmail: inquiryData.buyerEmail,
      buyerPhone: inquiryData.buyerPhone,
      ownerId: inquiryData.ownerId,
      message: inquiryData.message,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    inquiries.unshift(newInquiry);
    setStorage(STORAGE_KEYS.INQUIRIES, inquiries);

    // Increment inquiriesCount on property
    const propIndex = properties.findIndex((p) => p.id === inquiryData.propertyId);
    if (propIndex !== -1) {
      properties[propIndex].inquiriesCount = (properties[propIndex].inquiriesCount || 0) + 1;
      setStorage(STORAGE_KEYS.PROPERTIES, properties);
    }

    return newInquiry;
  },

  getInquiriesForOwnerOrDealer: async (sellerId) => {
    await new Promise((r) => setTimeout(r, 150));
    return inquiries.filter((inq) => inq.ownerId === sellerId);
  },

  getInquiriesForBuyer: async (buyerId) => {
    await new Promise((r) => setTimeout(r, 150));
    return inquiries.filter((inq) => inq.buyerId === buyerId);
  },

  updateInquiryStatus: async (inquiryId, status) => {
    await new Promise((r) => setTimeout(r, 100));
    const index = inquiries.findIndex((i) => i.id === inquiryId);
    if (index !== -1) {
      inquiries[index].status = status;
      setStorage(STORAGE_KEYS.INQUIRIES, inquiries);
      return inquiries[index];
    }
    throw { message: 'Inquiry not found.' };
  },

  // FAVORITES
  toggleFavorite: async (userId, propertyId) => {
    await new Promise((r) => setTimeout(r, 100));
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw { message: 'User not found.' };

    const saved = users[userIndex].savedProperties || [];
    const isSaved = saved.includes(propertyId);

    if (isSaved) {
      users[userIndex].savedProperties = saved.filter((id) => id !== propertyId);
    } else {
      users[userIndex].savedProperties = [...saved, propertyId];
    }

    setStorage(STORAGE_KEYS.USERS, users);
    return users[userIndex].savedProperties;
  },
};
