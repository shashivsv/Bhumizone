import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { subscriptionApi } from '../../../services/api/propertyApi';
import { useAuth } from '../../../context/AuthContext';
import { PlanCard } from '../components/PlanCard';
import { Button } from '../../../components/ui/Button';
import { Sparkles, ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';

export function PublicPricingPage() {
  const [plans, setPlans] = useState([]);
  const { user, role, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPlans() {
      try {
        const data = await subscriptionApi.getPlans();
        setPlans(data);
      } catch (err) {
        console.error('Failed to load plans', err);
      }
    }
    loadPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    if (!isAuthenticated) {
      navigate('/register?role=DEALER');
    } else if (role === 'DEALER') {
      navigate('/dealer/subscription');
    } else {
      navigate('/dealer/subscription');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200 mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Transparent Pricing for Real Estate Dealers
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Supercharge Your Property Dealership with GharDekho
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-500">
          List your properties without an upfront gate. Activate a quarterly, half-yearly, or annual dealer package to display unmasked telephone contact info and direct WhatsApp connections to high-intent buyers.
        </p>
      </div>

      {/* Plan Cards Grid (3, 6, 12 Months) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onSelect={handleSelectPlan}
          />
        ))}
      </div>

      {/* Feature Comparison / Value Prop */}
      <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Business Model & Transparency
            </span>
            <h3 className="mt-2 text-2xl font-extrabold text-white">
              Why do we protect Dealer Phone Numbers?
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              To prevent broker spam and maintain genuine buyer trust, GharDekho enforces a strict server-side masking rule. Certified dealers who invest in an active subscription receive verified placement and direct, instantaneous buyer calls.
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Unmasked +91 Phone displayed across all your listings</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Direct WhatsApp button allowing one-tap buyer conversations</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Listings are NOT deleted even if your subscription expires</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Zero commission / brokerage on closed property sales</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
