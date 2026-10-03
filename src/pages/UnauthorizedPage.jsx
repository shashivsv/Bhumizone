import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { getRoleDashboardPath } from '../routes/roleRedirects';

export function UnauthorizedPage() {
  const { user, role } = useAuth();
  const dashboardPath = getRoleDashboardPath(role);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-4">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        403 - Access Restricted
      </h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
        Your current account persona ({role || 'Guest'}) does not have permission to access this internal portal view.
      </p>

      <div className="mt-6 flex gap-3">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Public Portal
          </Button>
        </Link>
        {user && (
          <Link to={dashboardPath}>
            <Button variant="primary" size="sm">
              Go to Your Dashboard
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <h1 className="text-5xl font-extrabold text-slate-900">404</h1>
      <h2 className="mt-2 text-xl font-bold text-slate-800">Page Not Found</h2>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">
        The link you followed may be broken or the property may have been removed.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="primary" size="sm">
          Return to Homepage
        </Button>
      </Link>
    </div>
  );
}
