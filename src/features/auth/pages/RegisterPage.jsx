import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ROLES, ROLE_LABELS } from '../../../config/roles';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Select } from '../../../components/ui/Select';
import { POPULAR_CITIES } from '../../../config/propertyConstants';
import { getRoleDashboardPath } from '../../../routes/roleRedirects';
import { toast } from 'sonner';
import { User, Mail, Phone, Lock, Building, MapPin } from 'lucide-react';

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || ROLES.BUYER;

  const [selectedRole, setSelectedRole] = useState(defaultRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    agencyName: '',
    city: 'Mumbai',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newUser = await register({
        ...formData,
        role: selectedRole,
      });

      navigate(getRoleDashboardPath(newUser.role));
    } catch {
      // toast shown in context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Create Your GharDekho Account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Join thousands of buyers, verified individual owners, and real estate agencies.
        </p>
      </div>

      {/* Role Picker */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          Select Account Persona
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[ROLES.BUYER, ROLES.OWNER, ROLES.DEALER].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRole(r)}
              className={`rounded-xl border p-2.5 text-center text-xs font-bold transition-all cursor-pointer ${
                selectedRole === r
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-2xs'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {ROLE_LABELS[r]}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Full Name"
          required
          leftIcon={<User className="w-4 h-4" />}
          placeholder="e.g. Anand Mahindra"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        {selectedRole === ROLES.DEALER && (
          <Input
            label="Agency / Brokerage Name"
            required
            leftIcon={<Building className="w-4 h-4" />}
            placeholder="e.g. Prime Realty Capital"
            value={formData.agencyName}
            onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
            helperText="Display name for all your agency listings."
          />
        )}

        <Input
          label="Email Address"
          type="email"
          required
          leftIcon={<Mail className="w-4 h-4" />}
          placeholder="name@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Phone Number"
            type="tel"
            required
            leftIcon={<Phone className="w-4 h-4" />}
            placeholder="+91 98200 12345"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <Select
            label="Operating City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            options={POPULAR_CITIES.map((c) => ({ value: c, label: c }))}
          />
        </div>

        <Input
          label="Create Password"
          type="password"
          required
          leftIcon={<Lock className="w-4 h-4" />}
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full mt-2"
          isLoading={isSubmitting}
        >
          Complete Registration as {ROLE_LABELS[selectedRole]}
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
          Sign In
        </Link>
      </div>
    </div>
  );
}
