/**
 * GharDekho MongoDB Initialization Script
 * -------------------------------------------------------------
 * You can execute this file directly in:
 * 1. MongoDB Compass (via embedded MongoSH terminal at bottom)
 * 2. MongoDB Atlas (via "Connect" -> "MongoSH")
 * 3. Command line: mongosh "<YOUR_MONGODB_URI>" < init-mongo.js
 * -------------------------------------------------------------
 */

// Switch to ghardekho database
db = db.getSiblingDB('ghardekho');

print("🚀 Initializing 'ghardekho' Database...");

// 1. Create 'users' collection with indexes
print("📦 Creating 'users' collection & indexes...");
db.users.drop();
db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ customId: 1 });

db.users.insertMany([
  {
    customId: 'usr_buyer_1',
    name: 'Aarav Mehta',
    email: 'buyer@ghardekho.com',
    role: 'BUYER',
    phone: '+91 98200 11223',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    savedProperties: ['prop_1', 'prop_3'],
    city: 'Mumbai',
    createdAt: new Date('2026-01-15T10:00:00Z'),
    updatedAt: new Date('2026-01-15T10:00:00Z')
  },
  {
    customId: 'usr_owner_1',
    name: 'Dr. Ramesh Kulkarni',
    email: 'owner@ghardekho.com',
    role: 'OWNER',
    phone: '+91 98450 99887',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    city: 'Pune',
    createdAt: new Date('2026-02-10T12:00:00Z'),
    updatedAt: new Date('2026-02-10T12:00:00Z')
  },
  {
    customId: 'usr_dealer_unsub',
    name: 'Vikram Sethi',
    agencyName: 'Sethi Prime Properties',
    email: 'dealer.unsub@ghardekho.com',
    role: 'DEALER',
    phone: '+91 98111 22334',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    city: 'Delhi NCR',
    subscription: {
      planId: null,
      planName: null,
      isActive: false,
      isExpired: false,
      startedAt: null,
      expiresAt: null,
      daysRemaining: 0
    },
    createdAt: new Date('2026-03-01T08:00:00Z'),
    updatedAt: new Date('2026-03-01T08:00:00Z')
  },
  {
    customId: 'usr_dealer_sub',
    name: 'Sunita & Rajesh Singhania',
    agencyName: 'Apex Realty Solutions',
    email: 'dealer.sub@ghardekho.com',
    role: 'DEALER',
    phone: '+91 98201 44556',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    city: 'Mumbai',
    subscription: {
      planId: 'plan_6m',
      planName: 'Half-Year Momentum',
      isActive: true,
      isExpired: false,
      startedAt: new Date('2026-08-01T00:00:00Z'),
      expiresAt: new Date('2027-02-01T00:00:00Z'),
      daysRemaining: 127
    },
    createdAt: new Date('2026-01-20T14:00:00Z'),
    updatedAt: new Date('2026-01-20T14:00:00Z')
  },
  {
    customId: 'usr_admin_1',
    name: 'Priya Nambiar (Admin)',
    email: 'admin@ghardekho.com',
    role: 'ADMIN',
    phone: '+91 99000 88888',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    city: 'Bengaluru',
    createdAt: new Date('2025-11-01T00:00:00Z'),
    updatedAt: new Date('2025-11-01T00:00:00Z')
  }
]);

// 2. Create 'plans' collection & indexes
print("📦 Creating 'plans' collection & indexes...");
db.plans.drop();
db.createCollection('plans');
db.plans.createIndex({ planId: 1 }, { unique: true });

db.plans.insertMany([
  {
    planId: 'plan_3m',
    name: 'Quarterly Growth',
    durationMonths: 3,
    durationLabel: '3 Months',
    price: 4999,
    originalPrice: 5999,
    savingsPercent: 16,
    isPopular: false,
    tagline: 'Ideal for independent dealers testing property velocity.',
    features: [
      'Unmasked Phone Number on all listings',
      'Direct WhatsApp inquiry button for buyers',
      'Unlimited property listings',
      'Instant lead notification alerts',
      'Standard search placement',
      'Basic inquiry dashboard'
    ],
    createdAt: new Date()
  },
  {
    planId: 'plan_6m',
    name: 'Half-Year Momentum',
    durationMonths: 6,
    durationLabel: '6 Months',
    price: 8999,
    originalPrice: 11999,
    savingsPercent: 25,
    isPopular: true,
    tagline: 'Best balance of sustained buyer visibility and cost efficiency.',
    features: [
      'Unmasked Phone Number on all listings',
      'Direct WhatsApp inquiry button for buyers',
      'Unlimited property listings',
      'Priority lead notifications',
      'Featured placement in locality searches',
      'Advanced lead analytics & conversion CRM',
      'Dedicated support line'
    ],
    createdAt: new Date()
  },
  {
    planId: 'plan_12m',
    name: 'Annual Dominance',
    durationMonths: 12,
    durationLabel: '12 Months',
    price: 14999,
    originalPrice: 23999,
    savingsPercent: 37,
    isPopular: false,
    tagline: 'Maximum ROI for established real estate agencies and top brokers.',
    features: [
      'Unmasked Phone Number on all listings',
      'Direct WhatsApp inquiry button for buyers',
      'Unlimited property listings',
      'Top-tier search priority & home page spotlight',
      'Verified Dealer badge across all properties',
      'Instant SMS & WhatsApp lead delivery',
      'Unlimited CRM inquiries export (CSV/Excel)',
      'Quarterly performance report from account manager'
    ],
    createdAt: new Date()
  }
]);

// 3. Create 'properties' collection & indexes
print("📦 Creating 'properties' collection & search indexes...");
db.properties.drop();
db.createCollection('properties');
db.properties.createIndex({ slug: 1 }, { unique: true });
db.properties.createIndex({ customId: 1 });
db.properties.createIndex({ city: 1, status: 1 });
db.properties.createIndex({ type: 1, category: 1, price: 1 });
db.properties.createIndex({ listedByUserId: 1 });
db.properties.createIndex(
  {
    title: 'text',
    locality: 'text',
    city: 'text',
    address: 'text',
    description: 'text'
  },
  { name: 'property_text_search_index' }
);

db.properties.insertMany([
  {
    customId: 'prop_1',
    title: '3 BHK Sea-View Luxury Apartment in Worli',
    slug: '3-bhk-sea-view-luxury-apartment-worli-mumbai',
    type: 'BUY',
    category: 'Apartment',
    price: 48500000,
    pricePerSqFt: 28500,
    carpetArea: 1700,
    superBuiltUpArea: 2150,
    bhk: '3 BHK',
    bathrooms: 3,
    balconies: 2,
    furnishing: 'Fully Furnished',
    floor: 24,
    totalFloors: 35,
    facing: 'West',
    possessionStatus: 'Ready to Move',
    ageOfProperty: '0-1 Years',
    city: 'Mumbai',
    locality: 'Worli',
    address: 'Lodha Park Tower, Pandurang Budhkar Marg, Worli, Mumbai',
    coordinates: { lat: 18.9986, lng: 72.8174 },
    status: 'PUBLISHED',
    isFeatured: true,
    isVerified: true,
    listedByUserId: 'usr_dealer_sub',
    amenities: ['parking', 'security', 'lift', 'gym', 'pool', 'power_backup', 'clubhouse', 'garden', 'ev_charging'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&auto=format&fit=crop'
    ],
    description: 'Breathtaking Arabian Sea view apartment in Worli. Designed with bespoke Italian marble flooring, VRV air conditioning, automated smart home lighting, and a panoramic deck. Ultra-luxury clubhouse with Olympic-sized pool and concierge services.',
    viewsCount: 1420,
    inquiriesCount: 18,
    createdAt: new Date('2026-09-10T11:00:00Z'),
    updatedAt: new Date('2026-09-10T11:00:00Z')
  },
  {
    customId: 'prop_2',
    title: '4 BHK Independent Designer Villa in Whitefield',
    slug: '4-bhk-independent-designer-villa-whitefield-bengaluru',
    type: 'BUY',
    category: 'Villa',
    price: 32000000,
    pricePerSqFt: 8800,
    carpetArea: 3600,
    superBuiltUpArea: 4200,
    bhk: '4 BHK',
    bathrooms: 4,
    balconies: 3,
    furnishing: 'Semi-Furnished',
    floor: 1,
    totalFloors: 2,
    facing: 'East',
    possessionStatus: 'Ready to Move',
    ageOfProperty: '1-3 Years',
    city: 'Bengaluru',
    locality: 'Whitefield',
    address: 'Palm Meadows Gated Community, Varthur Road, Whitefield, Bengaluru',
    coordinates: { lat: 12.9698, lng: 77.7499 },
    status: 'PUBLISHED',
    isFeatured: true,
    isVerified: true,
    listedByUserId: 'usr_dealer_unsub',
    amenities: ['parking', 'security', 'gym', 'pool', 'power_backup', 'clubhouse', 'garden', 'water_supply'],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1000&auto=format&fit=crop'
    ],
    description: 'Magnificent Mediterranean-style private villa within a prestigious gated community. Features a landscaped private lawn, modular kitchen with Bosch appliances, private car porch for 3 vehicles, and solar heating.',
    viewsCount: 890,
    inquiriesCount: 12,
    createdAt: new Date('2026-09-15T09:30:00Z'),
    updatedAt: new Date('2026-09-15T09:30:00Z')
  },
  {
    customId: 'prop_3',
    title: '2 BHK Modern Sunlit Flat near Metro',
    slug: '2-bhk-modern-sunlit-flat-kothrud-pune',
    type: 'BUY',
    category: 'Apartment',
    price: 9200000,
    pricePerSqFt: 9200,
    carpetArea: 850,
    superBuiltUpArea: 1000,
    bhk: '2 BHK',
    bathrooms: 2,
    balconies: 2,
    furnishing: 'Semi-Furnished',
    floor: 6,
    totalFloors: 14,
    facing: 'North-East',
    possessionStatus: 'Ready to Move',
    ageOfProperty: '2 Years',
    city: 'Pune',
    locality: 'Kothrud',
    address: 'Near Ideal Colony Metro Station, Paud Road, Kothrud, Pune',
    coordinates: { lat: 18.5074, lng: 73.8077 },
    status: 'PUBLISHED',
    isFeatured: false,
    isVerified: true,
    listedByUserId: 'usr_owner_1',
    amenities: ['parking', 'security', 'lift', 'power_backup', 'water_supply', 'gas_pipeline'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1000&auto=format&fit=crop'
    ],
    description: 'Direct owner sale. Well-maintained 2 BHK apartment with abundant natural ventilation. Walking distance from Kothrud Metro. Clear titles, society share certificate available. No brokerage fee.',
    viewsCount: 650,
    inquiriesCount: 9,
    createdAt: new Date('2026-09-18T16:00:00Z'),
    updatedAt: new Date('2026-09-18T16:00:00Z')
  },
  {
    customId: 'prop_4',
    title: 'Spacious 3 BHK for Rent in Cyber City Corridor',
    slug: '3-bhk-spacious-flat-dlf-phase-5-gurgaon',
    type: 'RENT',
    category: 'Apartment',
    price: 65000,
    carpetArea: 1650,
    superBuiltUpArea: 2000,
    bhk: '3 BHK',
    bathrooms: 3,
    balconies: 3,
    furnishing: 'Fully Furnished',
    floor: 12,
    totalFloors: 22,
    facing: 'North',
    possessionStatus: 'Immediate',
    ageOfProperty: '3-5 Years',
    city: 'Delhi NCR',
    locality: 'DLF Phase 5',
    address: 'The Crest, Golf Course Road, DLF Phase 5, Gurugram',
    coordinates: { lat: 28.4595, lng: 77.0266 },
    status: 'PUBLISHED',
    isFeatured: true,
    isVerified: true,
    listedByUserId: 'usr_dealer_sub',
    amenities: ['parking', 'security', 'lift', 'gym', 'pool', 'power_backup', 'clubhouse', 'gas_pipeline'],
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502005229762-ee1a511e031a?w=1000&auto=format&fit=crop'
    ],
    description: 'Executive rental home situated on Golf Course Road. Fully furnished with leather recliners, smart televisions, King-size orthopedic beds, and central heating/cooling.',
    viewsCount: 420,
    inquiriesCount: 7,
    createdAt: new Date('2026-09-20T10:15:00Z'),
    updatedAt: new Date('2026-09-20T10:15:00Z')
  },
  {
    customId: 'prop_5',
    title: 'Grade-A Commercial Office Space in Hitec City',
    slug: 'grade-a-commercial-office-space-hitec-city-hyderabad',
    type: 'RENT',
    category: 'Commercial Office',
    price: 180000,
    pricePerSqFt: 75,
    carpetArea: 2400,
    superBuiltUpArea: 3200,
    bhk: 'Commercial Office',
    bathrooms: 4,
    balconies: 0,
    furnishing: 'Fully Furnished',
    floor: 8,
    totalFloors: 18,
    facing: 'East',
    possessionStatus: 'Immediate',
    ageOfProperty: '1 Year',
    city: 'Hyderabad',
    locality: 'Hitec City',
    address: 'Cyber Pearl Tech Park, Madhapur, Hitec City, Hyderabad',
    coordinates: { lat: 17.4474, lng: 78.3762 },
    status: 'PENDING_APPROVAL',
    isFeatured: false,
    isVerified: false,
    listedByUserId: 'usr_dealer_unsub',
    amenities: ['parking', 'security', 'lift', 'power_backup', 'ev_charging', 'wifi'],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1000&auto=format&fit=crop'
    ],
    description: 'Plug-and-play corporate IT office space equipped with 40 workstations, 2 conference rooms with video-conferencing screens, 1 executive cabin, and a pantry cafeteria. 100% DG backup.',
    viewsCount: 110,
    inquiriesCount: 1,
    createdAt: new Date('2026-09-25T14:30:00Z'),
    updatedAt: new Date('2026-09-25T14:30:00Z')
  },
  {
    customId: 'prop_6',
    title: 'Prime Gated Villa Plot with RERA Approval',
    slug: 'prime-gated-villa-plot-devenahalli-bengaluru',
    type: 'BUY',
    category: 'Plot',
    price: 6800000,
    pricePerSqFt: 2833,
    carpetArea: 2400,
    superBuiltUpArea: 2400,
    bhk: 'Plot',
    bathrooms: 0,
    balconies: 0,
    furnishing: 'Unfurnished',
    floor: 0,
    totalFloors: 0,
    facing: 'North-East',
    possessionStatus: 'Immediate',
    ageOfProperty: 'New',
    city: 'Bengaluru',
    locality: 'Devanahalli',
    address: 'Near Kempegowda International Airport, Devanahalli, Bengaluru',
    coordinates: { lat: 13.2458, lng: 77.7126 },
    status: 'DRAFT',
    isFeatured: false,
    isVerified: false,
    listedByUserId: 'usr_owner_1',
    amenities: ['security', 'clubhouse', 'garden', 'water_supply'],
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1000&auto=format&fit=crop'],
    description: 'BIAAPA & RERA approved residential plot ready for villa construction. Wide 40ft blacktop internal roads, underground drainage, street lighting, and dedicated electricity line.',
    viewsCount: 45,
    inquiriesCount: 0,
    createdAt: new Date('2026-09-26T08:00:00Z'),
    updatedAt: new Date('2026-09-26T08:00:00Z')
  }
]);

// 4. Create 'inquiries' collection & indexes
print("📦 Creating 'inquiries' collection & indexes...");
db.inquiries.drop();
db.createCollection('inquiries');
db.inquiries.createIndex({ propertyId: 1 });
db.inquiries.createIndex({ buyerId: 1 });
db.inquiries.createIndex({ ownerId: 1 });

db.inquiries.insertMany([
  {
    customId: 'inq_1',
    propertyId: 'prop_1',
    propertyTitle: '3 BHK Sea-View Luxury Apartment in Worli',
    buyerId: 'usr_buyer_1',
    buyerName: 'Aarav Mehta',
    buyerEmail: 'aarav.mehta@gmail.com',
    buyerPhone: '+91 98200 11223',
    ownerId: 'usr_dealer_sub',
    message: 'Hello, I am interested in scheduling a site visit this coming Saturday afternoon. Is price negotiable?',
    status: 'NEW',
    createdAt: new Date('2026-09-25T11:20:00Z')
  },
  {
    customId: 'inq_2',
    propertyId: 'prop_2',
    propertyTitle: '4 BHK Independent Designer Villa in Whitefield',
    buyerId: 'usr_buyer_1',
    buyerName: 'Aarav Mehta',
    buyerEmail: 'aarav.mehta@gmail.com',
    buyerPhone: '+91 98200 11223',
    ownerId: 'usr_dealer_unsub',
    message: 'Can you provide the floor plan and RERA registration documents? Interested for self-use.',
    status: 'CONTACTED',
    createdAt: new Date('2026-09-24T15:45:00Z')
  }
]);

// 5. Create 'transactions' collection & indexes
print("📦 Creating 'transactions' collection & indexes...");
db.transactions.drop();
db.createCollection('transactions');
db.transactions.createIndex({ dealerId: 1 });
db.transactions.createIndex({ referenceId: 1 });

db.transactions.insertMany([
  {
    customId: 'txn_101',
    dealerId: 'usr_dealer_sub',
    dealerName: 'Sunita & Rajesh Singhania',
    agencyName: 'Apex Realty Solutions',
    planId: 'plan_6m',
    planName: 'Half-Year Momentum (6 Months)',
    amount: 8999,
    paymentMethod: 'UPI / Razorpay',
    status: 'SUCCESS',
    referenceId: 'RZP_PAY_9812487123',
    createdAt: new Date('2026-08-01T00:05:00Z')
  }
]);

print("✨ MongoDB Database 'ghardekho' created and populated successfully!");
print("📊 Collections in 'ghardekho':");
printjson(db.getCollectionNames());
