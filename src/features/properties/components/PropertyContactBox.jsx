import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ROLES } from '../../../config/roles';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import {
  Phone,
  MessageCircle,
  Mail,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Sparkles,
  Building,
  User,
} from 'lucide-react';

export function PropertyContactBox({ property, onOpenInquiry }) {
  const { user } = useAuth();
  const listedBy = property?.listedBy;
  const contactInfo = listedBy?.contactInfo || {};

  const isDealer = listedBy?.role === ROLES.DEALER;
  const isOwner = listedBy?.role === ROLES.OWNER;
  const isSelf = listedBy?.isSelf || (user && user.id === listedBy?.id);

  // Phone masking status from API
  const isPhoneHidden = contactInfo.contactHidden || !contactInfo.phone;
  const rawPhone = contactInfo.phone;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">
          {isOwner ? 'Contact Property Owner' : 'Contact Real Estate Agent'}
        </h3>
        <Badge variant={isOwner ? 'indigo' : 'amber'} size="sm">
          {isOwner ? 'Direct Owner' : 'Certified Dealer'}
        </Badge>
      </div>

      {/* Representative Profile */}
      <div className="mt-4 flex items-center gap-3.5">
        <div className="relative">
          <img
            src={
              listedBy?.avatar ||
              'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120'
            }
            alt={listedBy?.name || 'Seller'}
            className="h-14 w-14 rounded-2xl object-cover border border-slate-200"
          />
          <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-slate-900 truncate">
            {listedBy?.name || 'Property Representative'}
          </h4>
          {listedBy?.agencyName && (
            <p className="text-xs font-semibold text-slate-600 truncate flex items-center gap-1 mt-0.5">
              <Building className="w-3 h-3 text-slate-400 shrink-0" />
              {listedBy.agencyName}
            </p>
          )}
          <p className="text-[11px] text-slate-500 mt-0.5">
            Member of GharDekho Verified Network
          </p>
        </div>
      </div>

      {/* DEALER SPECIFIC: SELF-VIEW WARNING */}
      {isDealer && isSelf && isPhoneHidden && (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Your Phone Number is Hidden from Buyers</span>
          </div>
          <p className="mt-1 text-[11px] text-amber-800 leading-relaxed">
            Because your dealer subscription is currently inactive, buyers cannot see your direct phone number. Upgrade your subscription to unlock instant buyer calls.
          </p>
          <Link to="/dealer/subscription" className="mt-2.5 block">
            <Button variant="amber" size="sm" className="w-full">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Upgrade to Reveal Contact (+91)
            </Button>
          </Link>
        </div>
      )}

      {/* CONTACT INFORMATION DISPLAY AREA */}
      <div className="mt-5 space-y-3">
        {/* CASE 1: PHONE IS MASKED / HIDDEN (SERVER DID NOT RETURN PHONE) */}
        {isPhoneHidden ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-500 mb-2">
              <Lock className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-slate-800">Phone Number Hidden</p>
            <p className="mt-1 text-[11px] text-slate-500 leading-snug">
              Direct telephone contact is protected for this dealer listing. You can send a direct inquiry lead below.
            </p>
          </div>
        ) : (
          /* CASE 2: PHONE IS UNMASKED (ACTIVE DEALER OR OWNER) */
          <div className="space-y-2">
            <a
              href={`tel:${rawPhone}`}
              className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 hover:bg-emerald-50 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Direct Phone Call
                  </p>
                  <p className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-700">
                    {rawPhone}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 underline">Call Now</span>
            </a>

            {/* Direct WhatsApp Action */}
            <a
              href={`https://wa.me/${rawPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hi, I am interested in your property on GharDekho: ${property?.title}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        )}

        {/* IN-APP INQUIRY FORM CTA (Always available so leads are never lost) */}
        <Button
          variant={isPhoneHidden ? 'primary' : 'outline'}
          className="w-full"
          size="md"
          onClick={onOpenInquiry}
        >
          <Mail className="w-4 h-4 mr-1.5" />
          Send Inquiry Message
        </Button>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>Strict anti-spam policy. Your info is safe.</span>
      </div>
    </div>
  );
}
