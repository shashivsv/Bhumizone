import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { inquiryApi } from '../../../services/api/propertyApi';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { formatDate, formatRelativeTime } from '../../../utils/dateFormatter';
import { PageLoader } from '../../../components/feedback/PageLoader';
import { EmptyState } from '../../../components/feedback/EmptyState';
import { toast } from 'sonner';
import {
  Inbox,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  Clock,
  User,
  Building,
} from 'lucide-react';

const STATUS_CONFIG = {
  NEW: { label: 'New Lead', variant: 'emerald' },
  CONTACTED: { label: 'Contacted', variant: 'sky' },
  CLOSED: { label: 'Deal Closed', variant: 'indigo' },
  DROPPED: { label: 'Dropped', variant: 'slate' },
};

export function InquiriesPage() {
  const { user, role } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const isBuyer = role === 'BUYER';

  useEffect(() => {
    async function loadInquiries() {
      setLoading(true);
      try {
        const data = await inquiryApi.getMyInquiries(user.id, role);
        setInquiries(data);
      } catch (err) {
        console.error('Failed to load inquiries', err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) {
      loadInquiries();
    }
  }, [user, role]);

  const handleUpdateStatus = async (inquiryId, newStatus) => {
    try {
      await inquiryApi.updateStatus(inquiryId, newStatus);
      setInquiries((prev) =>
        prev.map((i) => (i.id === inquiryId ? { ...i, status: newStatus } : i))
      );
      toast.success(`Inquiry status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update inquiry status.');
    }
  };

  if (loading) {
    return <PageLoader message="Loading inquiries..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {isBuyer ? 'My Sent Inquiries' : 'Lead CRM & Inquiries Received'}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          {isBuyer
            ? 'Track your contact requests and conversation status with property sellers.'
            : 'Respond promptly to high-intent buyer inquiries to maximize your deal closing rate.'}
        </p>
      </div>

      {inquiries.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No inquiries found"
          description={
            isBuyer
              ? 'You have not submitted any inquiries yet. Find a property you love and contact the representative.'
              : 'You have not received any buyer inquiries yet. Keep your listings updated with attractive pricing.'
          }
        />
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => {
            const statusConfig = STATUS_CONFIG[inq.status] || {
              label: inq.status,
              variant: 'slate',
            };

            return (
              <div
                key={inq.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4"
              >
                {/* Top Row: Property Title & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Inquiry for Property
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {inq.propertyTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      {formatRelativeTime(inq.createdAt)}
                    </span>
                    <Badge variant={statusConfig.variant} size="sm">
                      {statusConfig.label}
                    </Badge>
                  </div>
                </div>

                {/* Sender / Lead Info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{inq.buyerName}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <a
                        href={`tel:${inq.buyerPhone}`}
                        className="flex items-center gap-1 hover:text-emerald-700 font-semibold"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {inq.buyerPhone}
                      </a>
                      <a
                        href={`mailto:${inq.buyerEmail}`}
                        className="flex items-center gap-1 hover:text-emerald-700"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {inq.buyerEmail}
                      </a>
                    </div>
                  </div>

                  {/* Seller Status Controls (Owners & Dealers only) */}
                  {!isBuyer && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">Update Status:</span>
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateStatus(inq.id, e.target.value)}
                        className="rounded-lg border border-slate-200 bg-slate-50 py-1 px-2.5 text-xs font-bold text-slate-800 cursor-pointer"
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="CLOSED">Closed (Won)</option>
                        <option value="DROPPED">Dropped</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Message Body */}
                <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-slate-800 mb-0.5">Buyer Message:</p>
                  "{inq.message}"
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
