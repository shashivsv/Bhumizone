import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi, subscriptionApi } from '../../../services/api/propertyApi';
import { Button } from '../../../components/ui/Button';
import { formatCurrencyINR } from '../../../utils/currencyFormatter';
import { PageLoader } from '../../../components/feedback/PageLoader';
import {
  Building2,
  Users,
  CheckSquare,
  Crown,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export function AdminDashboardPage() {
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const [propsData, usersData, txnsData] = await Promise.all([
          adminApi.getProperties(),
          adminApi.getUsers(),
          subscriptionApi.getTransactions(),
        ]);
        setProperties(propsData);
        setUsers(usersData);
        setTransactions(txnsData);
      } catch (err) {
        console.error('Error loading admin dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  if (loading) {
    return <PageLoader message="Loading platform administration metrics..." />;
  }

  const pendingModeration = properties.filter((p) => p.status === 'PENDING_APPROVAL');
  const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const dealersCount = users.filter((u) => u.role === 'DEALER').length;
  const ownersCount = users.filter((u) => u.role === 'OWNER').length;
  const buyersCount = users.filter((u) => u.role === 'BUYER').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          GharDekho Administration & Moderation
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Supervise property quality, moderate new listings, manage dealer subscriptions, and inspect transactions.
        </p>
      </div>

      {/* PENDING MODERATION ALERT BANNER (If any) */}
      {pendingModeration.length > 0 && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold shadow-xs">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-amber-950">
                {pendingModeration.length} Properties Pending Moderation
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                New listings submitted by owners and dealers require verification before going live.
              </p>
            </div>
          </div>

          <Link to="/admin/moderation" className="shrink-0">
            <Button variant="amber" size="sm">
              Review Queue Now ({pendingModeration.length})
            </Button>
          </Link>
        </div>
      )}

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Moderation Queue</span>
            <CheckSquare className="w-4 h-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-600">
            {pendingModeration.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Awaiting review</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Properties</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            {properties.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Across all statuses</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Subscription GMV</span>
            <CreditCard className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            {formatCurrencyINR(totalRevenue)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Dealer revenue</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Registered Users</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            {users.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {dealersCount} Dealers • {ownersCount} Owners
          </span>
        </div>
      </div>

      {/* QUICK ADMIN ACTION PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-3">
              <CheckSquare className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Property Moderation</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Inspect submitted photos, RERA details, and descriptions. Approve to publish or reject with feedback.
            </p>
          </div>
          <Link to="/admin/moderation" className="mt-4 block">
            <Button variant="outline" size="sm" className="w-full">
              Open Moderation Queue &rarr;
            </Button>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-3">
              <Crown className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Subscription Plans & Pricing</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Configure 3-month, 6-month, and 12-month tier prices, discount rates, and features for dealers.
            </p>
          </div>
          <Link to="/admin/plans" className="mt-4 block">
            <Button variant="outline" size="sm" className="w-full">
              Configure Pricing &rarr;
            </Button>
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 mb-3">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">User Directory</h3>
            <p className="mt-1 text-xs text-slate-500 leading-relaxed">
              Inspect buyers, individual owners, and registered real estate dealer agencies and their subscription statuses.
            </p>
          </div>
          <Link to="/admin/users" className="mt-4 block">
            <Button variant="outline" size="sm" className="w-full">
              Manage Users &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
