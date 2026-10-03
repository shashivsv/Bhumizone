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
  Clock,
  CheckCircle2,
  TrendingUp,
  Eye,
} from 'lucide-react';
import { PageLoader } from '../../../components/feedback/PageLoader';

export function OwnerDashboardPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [propsData, inqsData] = await Promise.all([
          propertyApi.getMyProperties(user.id),
          inquiryApi.getMyInquiries(user.id, 'OWNER'),
        ]);
        setProperties(propsData);
        setInquiries(inqsData);
      } catch (err) {
        console.error('Error loading owner dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) {
      loadData();
    }
  }, [user]);

  if (loading) {
    return <PageLoader message="Loading owner metrics..." />;
  }

  const publishedCount = properties.filter((p) => p.status === 'PUBLISHED').length;
  const pendingCount = properties.filter((p) => p.status === 'PENDING_APPROVAL').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Owner Operations Hub
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Welcome back, {user.name}. As an individual owner, your direct contact details are shared with verified buyers.
          </p>
        </div>

        <Link to="/owner/properties/new">
          <Button variant="primary" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Post Free Listing
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Properties</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            {properties.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">In your owner account</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Published Live</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-700">
            {publishedCount}
          </p>
          <span className="text-[11px] text-emerald-600 mt-1 block">Active on search</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Under Moderation</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-amber-600">
            {pendingCount}
          </p>
          <span className="text-[11px] text-amber-700 mt-1 block">Pending admin review</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Buyer Inquiries</span>
            <Inbox className="w-4 h-4 text-sky-600" />
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
            {inquiries.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Direct leads received</span>
        </div>
      </div>

      {/* Recent Properties Section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Recent Property Listings
          </h2>
          <Link
            to="/owner/properties"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            View All ({properties.length})
          </Link>
        </div>

        {properties.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            No properties posted yet. Click "Post Free Listing" to begin.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {properties.slice(0, 3).map((prop) => (
              <div key={prop.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={prop.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100'}
                    alt={prop.title}
                    className="h-10 w-14 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{prop.title}</p>
                    <p className="text-[11px] text-slate-500">
                      {prop.locality}, {prop.city} • {formatCurrencyINR(prop.price, prop.type === 'RENT')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={prop.status} />
                  <Link to={`/properties/${prop.slug || prop.id}`}>
                    <Button variant="ghost" size="xs">
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
