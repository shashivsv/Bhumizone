import React, { createContext, useContext, useState, useEffect } from 'react';
import { tokenService } from '../services/tokenService';
import { authApi } from '../services/api/authApi';
import { mockServer } from '../services/mock/mockServer';
import { INITIAL_USERS } from '../services/mock/mockData';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenService.getUser());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If no user is logged in, default to Buyer for initial browsing convenience or stay null
    if (!user) {
      const savedUser = tokenService.getUser();
      if (savedUser) {
        setUser(savedUser);
      }
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);
      tokenService.setAccessToken(response.token);
      tokenService.setUser(response.user);
      setUser(response.user);
      toast.success(`Welcome back, ${response.user.name}!`);
      return response.user;
    } catch (err) {
      toast.error(err.message || 'Login failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(userData);
      tokenService.setAccessToken(response.token);
      tokenService.setUser(response.user);
      setUser(response.user);
      toast.success(`Account created successfully as ${userData.role}!`);
      return response.user;
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    tokenService.clearTokens();
    setUser(null);
    toast.info('You have been logged out.');
  };

  // Demo helper: Switch roles on the fly to inspect perspectives
  const quickSwitchRole = async (roleType) => {
    let targetUser = null;
    if (roleType === 'BUYER') {
      targetUser = INITIAL_USERS[0];
    } else if (roleType === 'OWNER') {
      targetUser = INITIAL_USERS[1];
    } else if (roleType === 'DEALER_UNSUB') {
      targetUser = INITIAL_USERS[2];
    } else if (roleType === 'DEALER_SUB') {
      targetUser = INITIAL_USERS[3];
    } else if (roleType === 'ADMIN') {
      targetUser = INITIAL_USERS[4];
    }

    if (targetUser) {
      try {
        // Try authenticating with backend first
        const res = await authApi.login(targetUser.email, 'password123');
        tokenService.setAccessToken(res.token);
        tokenService.setUser(res.user);
        setUser(res.user);
        toast.success(`Logged in as: ${res.user.role} (${res.user.name})`);
        return;
      } catch {
        // Fallback to local mock role switch
        tokenService.setAccessToken(`mock_jwt_${targetUser.id}`);
        tokenService.setUser(targetUser);
        setUser({ ...targetUser });
        toast.success(`Switched role to: ${targetUser.role} (${targetUser.name})`);
      }
    }
  };

  const toggleFavorite = async (propertyId) => {
    if (!user) {
      toast.error('Please login to save properties.');
      return false;
    }
    try {
      const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';
      let updatedSaved;
      if (USE_MOCK) {
        updatedSaved = await mockServer.toggleFavorite(user.id, propertyId);
      } else {
        try {
          const res = await authApi.toggleFavorite(propertyId);
          updatedSaved = res.savedProperties;
        } catch {
          updatedSaved = await mockServer.toggleFavorite(user.id, propertyId);
        }
      }
      const updatedUser = { ...user, savedProperties: updatedSaved };
      tokenService.setUser(updatedUser);
      setUser(updatedUser);
      const isSaved = updatedSaved.includes(propertyId);
      toast.success(isSaved ? 'Added to Saved Properties' : 'Removed from Saved Properties');
      return isSaved;
    } catch {
      toast.error('Failed to update favorites.');
      return false;
    }
  };

  const updateUserSubscription = (subscriptionData) => {
    if (!user) return;
    const updated = { ...user, subscription: subscriptionData };
    tokenService.setUser(updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        register,
        logout,
        quickSwitchRole,
        toggleFavorite,
        updateUserSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
