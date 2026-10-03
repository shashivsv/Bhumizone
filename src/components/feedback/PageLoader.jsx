import React from 'react';
import { Home } from 'lucide-react';

export function PageLoader({ message = 'Loading GharDekho...' }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="relative flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
        <div className="absolute flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
          <Home className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-700 animate-pulse">{message}</p>
    </div>
  );
}
