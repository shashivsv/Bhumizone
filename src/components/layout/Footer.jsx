import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { POPULAR_CITIES } from '../../config/propertyConstants';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-bold">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Ghar<span className="text-emerald-400">Dekho</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-slate-400 leading-relaxed">
              India's transparent property marketplace. Connecting buyers, verified owners, and certified real estate dealers with zero spam and strict data privacy.
            </p>

            <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> 100% RERA Verified Listings
              </span>
            </div>
          </div>

          {/* Popular Cities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Popular Cities
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {POPULAR_CITIES.slice(0, 6).map((city) => (
                <li key={city}>
                  <Link
                    to={`/properties?city=${encodeURIComponent(city)}`}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Properties in {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Explore
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/properties?type=BUY" className="hover:text-emerald-400 transition-colors">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link to="/properties?type=RENT" className="hover:text-emerald-400 transition-colors">
                  Rent Homes
                </Link>
              </li>
              <li>
                <Link to="/properties?category=Commercial%20Office" className="hover:text-emerald-400 transition-colors">
                  Commercial Properties
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-emerald-400 transition-colors">
                  Dealer Subscription Plans
                </Link>
              </li>
              <li>
                <Link to="/owner/properties/new" className="hover:text-emerald-400 transition-colors">
                  Post Property Free
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Company
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">About GharDekho</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">Privacy & Policy</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">Terms & Conditions</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer">Contact Support</span>
              </li>
            </ul>

            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> +91 (800) 242-7335
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" /> support@ghardekho.com
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-12 border-t border-slate-800 pt-6 text-center sm:flex sm:items-center sm:justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} GharDekho Technologies Pvt Ltd. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Disclaimer: GharDekho is an advertising platform. Real estate buyers must verify all RERA registrations independently.
          </p>
        </div>
      </div>
    </footer>
  );
}
