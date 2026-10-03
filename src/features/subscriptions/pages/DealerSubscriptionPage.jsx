import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { subscriptionApi } from '../../../services/api/propertyApi';
import { PlanCard } from '../components/PlanCard';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { formatDate } from '../../../utils/dateFormatter';
import { formatCurrencyINR } from '../../../utils/currencyFormatter';
import { toast } from 'sonner';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CreditCard,
  CheckCircle2,
  Calendar,
  Lock,
  Phone,
  Clock,
  ArrowRight,
} from 'lucide-react';

export function DealerSubscriptionPage() {
  const { user, updateUserSubscription } = useAuth();
  const [plans, setPlans] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Checkout modal
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI / Razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const subscription = user?.subscription || { isActive: false };
  const isSubscribed = Boolean(subscription.isActive);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [plansData, txnsData] = await Promise.all([
          subscriptionApi.getPlans(),
          subscriptionApi.getTransactions(),
        ]);
        setPlans(plansData);
        setTransactions(txnsData.filter((t) => t.dealerId === user?.id));
      } catch (err) {
        console.error('Failed to load subscription info', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const handleOpenCheckout = (plan) => {
    setSelectedPlan(plan);
  };

  const handleCompletePayment = async () => {
    if (!selectedPlan) return;
    setIsProcessing(true);

    try {
      const result = await subscriptionApi.purchasePlan(
        user.id,
        selectedPlan.id,
        paymentMethod
      );

      // Update in global state
      updateUserSubscription(result.subscription);
      setTransactions((prev) => [result.transaction, ...prev]);

      toast.success(
        `Subscription Activated! Your phone number is now visible to all buyers for ${selectedPlan.durationLabel}.`
      );
      setSelectedPlan(null);
    } catch (err) {
      toast.error(err.message || 'Payment processing failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Dealer Subscription & Contact Visibility
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Manage your dealership plan to unlock direct telephone visibility and WhatsApp leads across all your listings.
        </p>
      </div>

      {/* CURRENT STATUS HERO BANNER */}
      {isSubscribed ? (
        <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white mb-3">
                <ShieldCheck className="w-3.5 h-3.5" /> Active Dealer Subscription
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Plan: {subscription.planName || 'Active Tier'}
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Your direct phone number <span className="font-bold text-slate-900">({user.phone})</span> is currently unmasked and visible to all verified buyers.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Expires on: <span className="font-bold">{formatDate(subscription.expiresAt)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  Remaining: <span className="font-bold text-emerald-700">{subscription.daysRemaining} days</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <span className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-100 px-4 py-2.5 text-xs font-bold text-emerald-800">
                <Phone className="w-4 h-4" /> Direct Phone Live
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-amber-300 bg-amber-50/70 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-slate-950 mb-3">
                <AlertTriangle className="w-3.5 h-3.5" /> No Active Subscription
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950">
                Your Phone Number is Currently Hidden From Buyers
              </h2>
              <p className="mt-1 text-xs text-amber-800 leading-relaxed max-w-2xl">
                As per GharDekho's dealer policy, real estate dealers without an active quarterly, semi-annual, or annual plan have their contact phone numbers masked. Select a plan below to reveal your telephone number and allow instant direct calls.
              </p>
            </div>

            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-200/80 px-4 py-2.5 text-xs font-bold text-amber-950">
                <Lock className="w-4 h-4" /> Phone Masked (+91 ****)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* PLAN COMPARISON TIERS (3, 6, 12 Months) */}
      <div>
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Available Dealer Growth Plans
          </h2>
          <p className="text-xs text-slate-500">
            Choose from flexible 3-month, 6-month, or 12-month packages with instant activation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={isSubscribed && subscription.planId === plan.id}
              onSelect={handleOpenCheckout}
            />
          ))}
        </div>
      </div>

      {/* INVOICE & TRANSACTION HISTORY */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-4 tracking-tight">
          Subscription Invoices & Payment Logs
        </h3>

        {transactions.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No previous subscription payments recorded.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Invoice / Ref ID</th>
                  <th className="py-3 px-4">Plan Purchased</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {txn.referenceId || txn.id}
                    </td>
                    <td className="py-3 px-4">{txn.planName}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatCurrencyINR(txn.amount)}
                    </td>
                    <td className="py-3 px-4">{txn.paymentMethod}</td>
                    <td className="py-3 px-4">{formatDate(txn.createdAt)}</td>
                    <td className="py-3 px-4">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CHECKOUT SIMULATION MODAL */}
      {selectedPlan && (
        <Modal
          isOpen={Boolean(selectedPlan)}
          onClose={() => setSelectedPlan(null)}
          title="Confirm Subscription Checkout"
          description={`Activating ${selectedPlan.name} for ${selectedPlan.durationLabel}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">{selectedPlan.name}</span>
                <span className="text-xl font-extrabold text-emerald-800">
                  {formatCurrencyINR(selectedPlan.price)}
                </span>
              </div>
              <p className="mt-1 text-xs text-emerald-900">
                Duration: <span className="font-semibold">{selectedPlan.durationLabel}</span>
              </p>
              <p className="mt-2 text-[11px] text-slate-600">
                Included: Unmasked phone number, direct WhatsApp button, and unlimited property listings.
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Choose Payment Option
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['UPI / Razorpay', 'Credit / Debit Card', 'Net Banking'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`rounded-xl border p-2.5 text-center text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === method
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Instant activation: Contact visibility updates immediately on payment.</span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPlan(null)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCompletePayment}
                isLoading={isProcessing}
                leftIcon={<CreditCard className="w-4 h-4" />}
              >
                Pay {formatCurrencyINR(selectedPlan.price)}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
