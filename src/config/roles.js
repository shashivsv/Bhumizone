export const ROLES = {
  BUYER: 'BUYER',
  OWNER: 'OWNER',
  DEALER: 'DEALER',
  ADMIN: 'ADMIN',
};

export const ROLE_LABELS = {
  [ROLES.BUYER]: 'Buyer / Tenant',
  [ROLES.OWNER]: 'Property Owner',
  [ROLES.DEALER]: 'Real Estate Dealer',
  [ROLES.ADMIN]: 'Platform Administrator',
};

export const ROLE_BADGE_COLORS = {
  [ROLES.BUYER]: 'bg-sky-50 text-sky-700 border-sky-200',
  [ROLES.OWNER]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  [ROLES.DEALER]: 'bg-amber-50 text-amber-700 border-amber-200',
  [ROLES.ADMIN]: 'bg-rose-50 text-rose-700 border-rose-200',
};
