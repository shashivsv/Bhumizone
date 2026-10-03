import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../config/roles';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/HomePage';
import { PropertyListingPage } from '../features/properties/pages/PropertyListingPage';
import { PropertyDetailPage } from '../features/properties/pages/PropertyDetailPage';
import { PublicPricingPage } from '../features/subscriptions/pages/PublicPricingPage';
import { UnauthorizedPage, NotFoundPage } from '../pages/UnauthorizedPage';

// Auth Pages
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';

// Buyer & Shared
import { SavedPropertiesPage } from '../features/favorites/pages/SavedPropertiesPage';
import { InquiriesPage } from '../features/inquiries/pages/InquiriesPage';

// Owner Pages
import { OwnerDashboardPage } from '../features/listings/pages/OwnerDashboardPage';
import { MyListingsPage } from '../features/listings/pages/MyListingsPage';
import { ListingWizard } from '../features/listings/components/ListingWizard';

// Dealer Pages
import { DealerDashboardPage } from '../features/listings/pages/DealerDashboardPage';
import { DealerSubscriptionPage } from '../features/subscriptions/pages/DealerSubscriptionPage';

// Admin Pages
import { AdminDashboardPage } from '../features/admin/pages/AdminDashboardPage';
import { ModerationQueuePage } from '../features/admin/pages/ModerationQueuePage';
import { AdminPropertiesPage } from '../features/admin/pages/AdminPropertiesPage';
import { AdminUsersPage } from '../features/admin/pages/AdminUsersPage';
import { AdminPlansPage } from '../features/admin/pages/AdminPlansPage';
import { AdminTransactionsPage } from '../features/admin/pages/AdminTransactionsPage';

export function AppRoutes() {
  return (
    <Routes>
      {/* 1. PUBLIC ROUTES */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PropertyListingPage />} />
        <Route path="/properties/:slugOrId" element={<PropertyDetailPage />} />
        <Route path="/pricing" element={<PublicPricingPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* 2. AUTHENTICATION ROUTES */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* 3. PROTECTED BUYER & SHARED ROUTES */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/saved-properties" element={<SavedPropertiesPage />} />
        <Route path="/my-inquiries" element={<InquiriesPage />} />
      </Route>

      {/* 4. OWNER PORTAL */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRoles={[ROLES.OWNER]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/owner/dashboard" replace />} />
        <Route path="dashboard" element={<OwnerDashboardPage />} />
        <Route path="properties" element={<MyListingsPage />} />
        <Route path="properties/new" element={<ListingWizard />} />
        <Route path="inquiries" element={<InquiriesPage />} />
      </Route>

      {/* 5. DEALER PORTAL */}
      <Route
        path="/dealer"
        element={
          <ProtectedRoute allowedRoles={[ROLES.DEALER]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dealer/dashboard" replace />} />
        <Route path="dashboard" element={<DealerDashboardPage />} />
        <Route path="properties" element={<MyListingsPage />} />
        <Route path="properties/new" element={<ListingWizard />} />
        <Route path="inquiries" element={<InquiriesPage />} />
        <Route path="subscription" element={<DealerSubscriptionPage />} />
      </Route>

      {/* 6. ADMIN PORTAL */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="moderation" element={<ModerationQueuePage />} />
        <Route path="properties" element={<AdminPropertiesPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="plans" element={<AdminPlansPage />} />
        <Route path="transactions" element={<AdminTransactionsPage />} />
        <Route path="inquiries" element={<InquiriesPage />} />
      </Route>
    </Routes>
  );
}
