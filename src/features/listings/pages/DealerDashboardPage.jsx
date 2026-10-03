import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { propertyApi, inquiryApi } from '../../../services/api/propertyApi';
import { Button } from '../../../components/ui/Button';
import { StatusBadge } from '../../../components/feedback/StatusBadge';
import { formatCurrencyINR } from '../../../utils/currencyFormatter';
import { formatDate } from '../../../utils/dateFormatter';
import {
  Building2,
  PlusCircle,
  Inbox,
  Sparkles,
  AlertTriangle,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Eye,
  Crown,
} from 'lucide-react';
import { PageLoader } from '../../../components/feedback/PageLoader';

export function DealerDashboardPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const subscription = user?.subscription || { isActive: false };
  const isSubscribed = Boolean(subscription.isActive);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [propsData, inqsData] = await Promise.all([
          propertyApi.getMyProperties(user.id),
          inquiryApi.getMyInquiries(user.id, 'DEALER'),
        ]);
        setProperties(propsData);
        setInquiries(inqsData);
      } catch (err) {
        console.error('Error loading dealer dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) {
      loadData();
    }
  }, [user]);

  if (loading) {
    return <PageLoader message="Loading dealer agency hub..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {user.agencyName || 'Dealer'} Operations Center
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Certified Dealer Portfolio & Buyer Lead Generation Management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/dealer/subscription">
            <Button variant="outline" size="md" leftIcon={<Crown className="w-4 h-4 text-amber-500" />}>
              Subscription
            </Button>
          </Link>
          <Link to="/dealer/properties/new">
            <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Add Property
            </Button>
          </Link>
        </div>
      </div>

      {/* SUBSCRIPTION INTEGRITY ALERT */}
      {isSubscribed ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                Contact Visibility Status: Unmasked (Live)
              </p>
              <p className="text-xs text-emerald-900 mt-0.5">
                Your direct phone number <span className="font-bold">({user.phone})</span> is displayed to all prospective buyers on all your listings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-emerald-200 text-emerald-800">
              {subscription.daysRemaining} Days Left
            </span>
            <Link to="/dealer/subscription">
              <Button variant="primary" size="sm">
                Manage Plan
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-5 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-bold shadow-xs">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                Dealer Phone Masked (+91 ****)
              </p>
              <p className="text-xs text-amber-800 mt-0.5 max-w-xl">
                You do not have an active dealer plan. Per platform policy, your phone number is masked from buyers. You can still list properties, but you need a plan for telephone visibility.
              </p>
            </div>
          </div>

          <Link to="/dealer/subscription" className="shrink-0">
            <Button variant="amber" size="md">
              <Sparkles className="w-4 h-4 mr-1.5" />
              Subscribe to Reveal Phone
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Portfolio Size</span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            {properties.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Listed properties</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Leads Inquiries</span>
            <Inbox className="w-4 h-4 text-sky-600" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            {inquiries.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Buyer inquiries</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Active Plan</span>
            <Crown className="w-4 h-4 text-amber-500" />
          </div>
          <p className="mt-2 text-base font-extrabold text-slate-900 truncate">
            {subscription.planName || 'No Active Plan'}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {isSubscribed ? `${subscription.daysRemaining} days left` : 'Expired / Free'}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Contact Status</span>
            <Phone className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="mt-2 text-base font-extrabold text-slate-900">
            {isSubscribed ? 'Visible to All' : 'Masked (Server)'}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {isSubscribed ? 'Direct calls enabled' : 'Inquiry form only'}
          </span>
        </div>
      </div>

      {/* Recent Leads Preview */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Latest Buyer Inquiries
          </h2>
          <Link
            to="/dealer/inquiries"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            Open CRM ({inquiries.length})
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            No inquiries received yet.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {inquiries.slice(0, 3).map((inq) => (
              <div key={inq.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900">{inq.buyerName} ({inq.buyerPhone})</p>
                  <p className="text-[11px] text-slate-500 truncate">{inq.propertyTitle}</p>
                </div>

                <span className="text-xs font-bold text-slate-700 rounded-md bg-slate-100 px-2 py-0.5">
                  {inq.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
