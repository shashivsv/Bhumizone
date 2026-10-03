export const PROPERTY_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  PUBLISHED: 'PUBLISHED',
  REJECTED: 'REJECTED',
};

export const PROPERTY_STATUS_CONFIG = {
  [PROPERTY_STATUS.DRAFT]: {
    label: 'Draft',
    color: 'bg-slate-100 text-slate-700 border-slate-300',
    description: 'Listing saved as draft and not visible to public.',
  },
  [PROPERTY_STATUS.PENDING_APPROVAL]: {
    label: 'Pending Approval',
    color: 'bg-amber-50 text-amber-800 border-amber-300',
    description: 'Under review by GharDekho moderation team.',
  },
  [PROPERTY_STATUS.APPROVED]: {
    label: 'Approved',
    color: 'bg-blue-50 text-blue-700 border-blue-300',
    description: 'Approved and ready for publishing.',
  },
  [PROPERTY_STATUS.PUBLISHED]: {
    label: 'Published',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    description: 'Live on GharDekho marketplace.',
  },
  [PROPERTY_STATUS.REJECTED]: {
    label: 'Rejected',
    color: 'bg-rose-50 text-rose-800 border-rose-300',
    description: 'Rejected by admin moderation. Check feedback.',
  },
};

export const TRANSACTION_TYPES = [
  { value: 'BUY', label: 'Buy' },
  { value: 'RENT', label: 'Rent' },
];

export const PROPERTY_CATEGORIES = [
  { value: 'Apartment', label: 'Apartment / Flat' },
  { value: 'Independent House', label: 'Independent House / Builder Floor' },
  { value: 'Villa', label: 'Villa' },
  { value: 'Plot', label: 'Residential Plot / Land' },
  { value: 'Commercial Office', label: 'Commercial Office' },
  { value: 'Commercial Retail', label: 'Commercial Retail / Shop' },
];

export const BHK_OPTIONS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];

export const FURNISHING_OPTIONS = [
  { value: 'Unfurnished', label: 'Unfurnished' },
  { value: 'Semi-Furnished', label: 'Semi-Furnished' },
  { value: 'Fully Furnished', label: 'Fully Furnished' },
];

export const POPULAR_CITIES = [
  'Mumbai',
  'Bengaluru',
  'Delhi NCR',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
];

export const AMENITIES_LIST = [
  { id: 'parking', label: 'Reserved Parking', icon: 'Car' },
  { id: 'security', label: '24x7 Security & CCTV', icon: 'ShieldCheck' },
  { id: 'lift', label: 'High-speed Elevators', icon: 'ArrowUpDown' },
  { id: 'gym', label: 'Fitness Center / Gym', icon: 'Dumbbell' },
  { id: 'pool', label: 'Swimming Pool', icon: 'Waves' },
  { id: 'power_backup', label: '100% Power Backup', icon: 'Zap' },
  { id: 'clubhouse', label: 'Club House', icon: 'Building2' },
  { id: 'garden', label: 'Landscaped Garden / Park', icon: 'Trees' },
  { id: 'water_supply', label: '24x7 Water Supply', icon: 'Droplets' },
  { id: 'gas_pipeline', label: 'Piped Gas Connection', icon: 'Flame' },
  { id: 'ev_charging', label: 'EV Charging Station', icon: 'BatteryCharging' },
  { id: 'wifi', label: 'High-speed Internet', icon: 'Wifi' },
];
