import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';
import { getRoleDashboardPath } from '../../../routes/roleRedirects';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, quickSwitchRole } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const user = await login(email, password);
      if (redirect) {
        navigate(redirect);
      } else {
        navigate(getRoleDashboardPath(user.role));
      }
    } catch {
      // toast shown in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (roleKey) => {
    quickSwitchRole(roleKey);
    if (roleKey === 'ADMIN') navigate('/admin/dashboard');
    else if (roleKey === 'OWNER') navigate('/owner/dashboard');
    else if (roleKey.startsWith('DEALER')) navigate('/dealer/dashboard');
    else navigate('/saved-properties');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome to GharDekho
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Sign in to manage your listings, view inquiries, or access saved homes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          required
          leftIcon={<Mail className="w-4 h-4" />}
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          required
          leftIcon={<Lock className="w-4 h-4" />}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </form>

      {/* QUICK ROLE DEMO LOGINS */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>One-Click Test Accounts (Instant Role Switch)</span>
        </div>
        <p className="text-[11px] text-amber-800 leading-tight">
          Test any perspective without typing credentials:
        </p>

        <div className="grid grid-cols-1 gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => handleQuickDemo('BUYER')}
            className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 cursor-pointer"
          >
            <span>1. Buyer (Aarav Mehta)</span>
            <Badge variant="sky" size="sm">Buyer</Badge>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('OWNER')}
            className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 cursor-pointer"
          >
            <span>2. Owner (Dr. Ramesh Kulkarni)</span>
            <Badge variant="indigo" size="sm">Owner</Badge>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('DEALER_UNSUB')}
            className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 cursor-pointer"
          >
            <div>
              <span className="block text-left">3. Dealer: Unsubscribed</span>
              <span className="text-[10px] text-rose-600 font-medium block">Phone masked to public</span>
            </div>
            <Badge variant="amber" size="sm">Masked</Badge>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('DEALER_SUB')}
            className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 cursor-pointer"
          >
            <div>
              <span className="block text-left">4. Dealer: Subscribed</span>
              <span className="text-[10px] text-emerald-700 font-medium block">Phone unmasked to public</span>
            </div>
            <Badge variant="emerald" size="sm">Active</Badge>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo('ADMIN')}
            className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-2xs hover:bg-slate-50 cursor-pointer"
          >
            <span>5. Admin (Priya Nambiar)</span>
            <Badge variant="rose" size="sm">Admin</Badge>
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500">
        Don't have an account yet?{' '}
        <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-700">
          Create account
        </Link>
      </div>
    </div>
  );
}
