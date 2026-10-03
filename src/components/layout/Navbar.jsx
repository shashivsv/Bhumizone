import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PUBLIC_NAV_LINKS } from '../../config/navigation';
import { ROLES, ROLE_LABELS, ROLE_BADGE_COLORS } from '../../config/roles';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Home,
  Heart,
  User,
  PlusCircle,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Shield,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export function Navbar() {
  const { user, role, isAuthenticated, logout, quickSwitchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (role === ROLES.ADMIN) return '/admin/dashboard';
    if (role === ROLES.DEALER) return '/dealer/dashboard';
    if (role === ROLES.OWNER) return '/owner/dashboard';
    return '/saved-properties';
  };

  const getPostPropertyPath = () => {
    if (!isAuthenticated) return '/login?redirect=/owner/properties/new';
    if (role === ROLES.DEALER) return '/dealer/properties/new';
    return '/owner/properties/new';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Ghar<span className="text-emerald-600">Dekho</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                Verified
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {PUBLIC_NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors rounded-lg hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Role Switcher */}
          <div className="relative hidden lg:block">
            <button
              type="button"
              onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
              title="Click to switch simulated user role"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Simulate Role: {role || 'Guest'}</span>
              <ChevronDown className="w-3 h-3 text-amber-700" />
            </button>

            {roleSwitcherOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setRoleSwitcherOpen(false)}
              >
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Switch Active Persona
                </div>
                <button
                  type="button"
                  onClick={() => quickSwitchRole('BUYER')}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>1. Buyer (Aarav)</span>
                  <Badge variant="sky" size="sm">Buyer</Badge>
                </button>
                <button
                  type="button"
                  onClick={() => quickSwitchRole('OWNER')}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>2. Owner (Dr. Ramesh)</span>
                  <Badge variant="indigo" size="sm">Owner</Badge>
                </button>
                <button
                  type="button"
                  onClick={() => quickSwitchRole('DEALER_UNSUB')}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-rose-700">3. Dealer (No Plan)</p>
                    <p className="text-[10px] text-slate-500">Phone masked to public</p>
                  </div>
                  <Badge variant="amber" size="sm">Masked</Badge>
                </button>
                <button
                  type="button"
                  onClick={() => quickSwitchRole('DEALER_SUB')}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-emerald-700">4. Dealer (Subscribed)</p>
                    <p className="text-[10px] text-slate-500">Phone visible to public</p>
                  </div>
                  <Badge variant="emerald" size="sm">Active</Badge>
                </button>
                <button
                  type="button"
                  onClick={() => quickSwitchRole('ADMIN')}
                  className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>5. Admin (Priya)</span>
                  <Badge variant="rose" size="sm">Admin</Badge>
                </button>
              </div>
            )}
          </div>

          {/* Saved properties count (for buyers) */}
          {user && (
            <Link
              to="/saved-properties"
              className="relative p-2 text-slate-600 hover:text-emerald-600 transition-colors"
              title="Saved Properties"
            >
              <Heart className="w-5 h-5" />
              {user.savedProperties?.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                  {user.savedProperties.length}
                </span>
              )}
            </Link>
          )}

          {/* Post Property CTA */}
          <Link to={getPostPropertyPath()} className="hidden sm:inline-flex">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4 text-emerald-600" />}
            >
              Post Property <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded ml-1">FREE</span>
            </Button>
          </Link>

          {/* User Account / Login */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-slate-200 p-1 pr-3 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                  alt={user.name}
                  className="h-7 w-7 rounded-full object-cover"
                />
                <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <div className="mt-1">
                      <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${ROLE_BADGE_COLORS[role] || 'bg-slate-100 text-slate-700'}`}>
                        {ROLE_LABELS[role] || role}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={getDashboardPath()}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    Dashboard
                  </Link>

                  {role === ROLES.DEALER && (
                    <Link
                      to="/dealer/subscription"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Manage Subscription
                    </Link>
                  )}

                  {role === ROLES.ADMIN && (
                    <Link
                      to="/admin/moderation"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Shield className="w-4 h-4 text-slate-400" />
                      Moderation Queue
                    </Link>
                  )}

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {PUBLIC_NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-slate-100">
            <Link
              to={getPostPropertyPath()}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button variant="primary" className="w-full" size="md">
                Post Property For Free
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
