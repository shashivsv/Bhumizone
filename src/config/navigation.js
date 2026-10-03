import { ROLES } from './roles';

export const PUBLIC_NAV_LINKS = [
  { label: 'Buy', path: '/properties?type=BUY' },
  { label: 'Rent', path: '/properties?type=RENT' },
  { label: 'Commercial', path: '/properties?category=Commercial%20Office' },
  { label: 'Plots', path: '/properties?category=Plot' },
  { label: 'Dealer Plans', path: '/pricing' },
];

export const ROLE_NAV_LINKS = {
  [ROLES.BUYER]: [
    { label: 'Saved Properties', path: '/saved-properties', icon: 'Heart' },
    { label: 'My Inquiries', path: '/my-inquiries', icon: 'MessageSquare' },
  ],
  [ROLES.OWNER]: [
    { label: 'Overview', path: '/owner/dashboard', icon: 'LayoutDashboard' },
    { label: 'My Properties', path: '/owner/properties', icon: 'Building2' },
    { label: 'Post New Property', path: '/owner/properties/new', icon: 'PlusCircle' },
    { label: 'Leads Received', path: '/owner/inquiries', icon: 'Inbox' },
  ],
  [ROLES.DEALER]: [
    { label: 'Overview', path: '/dealer/dashboard', icon: 'LayoutDashboard' },
    { label: 'Inventory', path: '/dealer/properties', icon: 'Building2' },
    { label: 'Post Property', path: '/dealer/properties/new', icon: 'PlusCircle' },
    { label: 'Leads CRM', path: '/dealer/inquiries', icon: 'Inbox' },
    { label: 'Subscription', path: '/dealer/subscription', icon: 'Crown' },
  ],
  [ROLES.ADMIN]: [
    { label: 'Metrics', path: '/admin/dashboard', icon: 'BarChart3' },
    { label: 'Moderation Queue', path: '/admin/moderation', icon: 'CheckSquare' },
    { label: 'All Properties', path: '/admin/properties', icon: 'Building2' },
    { label: 'User Directory', path: '/admin/users', icon: 'Users' },
    { label: 'Subscription Plans', path: '/admin/plans', icon: 'Crown' },
    { label: 'Transactions', path: '/admin/transactions', icon: 'CreditCard' },
    { label: 'Lead Activity', path: '/admin/inquiries', icon: 'Inbox' },
  ],
};
