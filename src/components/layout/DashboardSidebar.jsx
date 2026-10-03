import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_NAV_LINKS } from '../../config/navigation';
import { ROLES, ROLE_LABELS, ROLE_BADGE_COLORS } from '../../config/roles';
import {
  Home,
  LayoutDashboard,
  Building2,
  PlusCircle,
  Inbox,
  Crown,
  BarChart3,
  CheckSquare,
  Users,
  CreditCard,
  Heart,
  MessageSquare,
  LogOut,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../ui/Button';

const ICON_MAP = {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Inbox,
  Crown,
  BarChart3,
  CheckSquare,
  Users,
  CreditCard,
  Heart,
  MessageSquare,
};

export function DashboardSidebar({ onClose }) {
  const { user, role, logout } = useAuth();
  const navLinks = (role && ROLE_NAV_LINKS[role]) || [];

  const isDealer = role === ROLES.DEALER;
  const isDealerSubscribed = isDealer && user?.subscription?.isActive;

  return (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-slate-200/80 bg-white">
      <div>
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-sm">
              <Home className="h-4 w-4" />
            </div>
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">
              Ghar<span className="text-emerald-600">Dekho</span>
            </span>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
              alt={user?.name}
              className="h-10 w-10 rounded-full object-cover border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              <div className="mt-1">
                <span
                  className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                    ROLE_BADGE_COLORS[role] || 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {ROLE_LABELS[role] || role}
                </span>
              </div>
            </div>
          </div>

          {/* Dealer Subscription Prompt if Unsubscribed */}
          {isDealer && !isDealerSubscribed && (
            <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-2.5 text-xs text-amber-900">
              <div className="flex items-start gap-1.5 font-bold">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Contact Hidden!</span>
              </div>
              <p className="mt-1 text-[11px] text-amber-800 leading-tight">
                Buyers cannot see your phone number on listings.
              </p>
              <Link to="/dealer/subscription" onClick={onClose} className="mt-2 block">
                <Button variant="amber" size="xs" className="w-full">
                  Activate Subscription
                </Button>
              </Link>
            </div>
          )}

          {/* Dealer Subscription Active Badge */}
          {isDealer && isDealerSubscribed && (
            <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/80 p-2 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span className="font-bold text-[11px]">Phone Visible</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                Active
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Navigation Links */}
        <nav className="p-3 space-y-1">
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
            Navigation
          </p>
          {navLinks.map((item) => {
            const Icon = ICON_MAP[item.icon] || LayoutDashboard;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                end={item.path.endsWith('/dashboard')}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/20'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Public Portal</span>
        </Link>
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
