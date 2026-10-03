import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Home, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Column: Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                Ghar<span className="text-emerald-600">Dekho</span>
              </span>
            </Link>
          </div>

          <Outlet />
        </div>
      </div>

      {/* Right Column: Visual Showcase */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop"
          alt="Modern Architecture"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-slate-900/20 flex flex-col justify-end p-12 text-white">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30 backdrop-blur-xs mb-4">
              <ShieldCheck className="w-3.5 h-3.5" /> Direct Owner & Dealer Connect
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Buy, Rent & Manage Properties with Complete Peace of Mind
            </h2>
            <p className="mt-3 text-base text-slate-300">
              Join thousands of buyers, genuine property owners, and certified real estate dealers. Verified titles, zero spam, and transparent pricing.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 text-xs font-medium text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Brokerage Owner Direct</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>RERA Compliant Dealer Portfolio</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Inquiries & WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Strict Contact Privacy Controls</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
