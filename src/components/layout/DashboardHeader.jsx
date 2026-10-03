import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, Sparkles, ChevronDown } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { ROLE_LABELS, ROLE_BADGE_COLORS } from '../../config/roles';

export function DashboardHeader({ onOpenMobileSidebar }) {
  const { user, role, quickSwitchRole } = useAuth();
  const [roleSwitcherOpen, setRoleSwitcherOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            {role === 'ADMIN'
              ? 'Administrator Workspace'
              : role === 'DEALER'
              ? `${user?.agencyName || 'Dealer'} Portal`
              : role === 'OWNER'
              ? 'Property Owner Dashboard'
              : 'Buyer Hub'}
          </h2>
          <p className="text-[11px] text-slate-500 hidden sm:block">
            GharDekho Verified Real Estate Operations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Role Switcher (Essential for rapid review and testing) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Role:</span> {role}
            <ChevronDown className="w-3 h-3 text-amber-700" />
          </button>

          {roleSwitcherOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-50"
              onClick={() => setRoleSwitcherOpen(false)}
            >
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Switch Test Persona
              </div>
              <button
                type="button"
                onClick={() => quickSwitchRole('BUYER')}
                className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Buyer (Aarav)</span>
                <Badge variant="sky" size="sm">Buyer</Badge>
              </button>
              <button
                type="button"
                onClick={() => quickSwitchRole('OWNER')}
                className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Owner (Dr. Ramesh)</span>
                <Badge variant="indigo" size="sm">Owner</Badge>
              </button>
              <button
                type="button"
                onClick={() => quickSwitchRole('DEALER_UNSUB')}
                className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-rose-700">Dealer (Unsubscribed)</p>
                  <p className="text-[10px] text-slate-500">Phone masked</p>
                </div>
                <Badge variant="amber" size="sm">Masked</Badge>
              </button>
              <button
                type="button"
                onClick={() => quickSwitchRole('DEALER_SUB')}
                className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-emerald-700">Dealer (Subscribed)</p>
                  <p className="text-[10px] text-slate-500">Phone visible</p>
                </div>
                <Badge variant="emerald" size="sm">Active</Badge>
              </button>
              <button
                type="button"
                onClick={() => quickSwitchRole('ADMIN')}
                className="w-full text-left px-3 py-2 text-xs font-medium hover:bg-slate-50 flex items-center justify-between"
              >
                <span>Admin (Priya)</span>
                <Badge variant="rose" size="sm">Admin</Badge>
              </button>
            </div>
          )}
        </div>

        <span
          className={`hidden sm:inline-flex text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wider ${
            ROLE_BADGE_COLORS[role] || 'bg-slate-100'
          }`}
        >
          {ROLE_LABELS[role] || role}
        </span>
      </div>
    </header>
  );
}
