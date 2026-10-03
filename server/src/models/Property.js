import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    customId: { type: String, sparse: true, index: true },
    title: { type: String, required: [true, 'Property title is required'], trim: true },
    slug: { type: String, unique: true, index: true },
    type: { type: String, enum: ['BUY', 'RENT'], required: true },
    category: {
      type: String,
      enum: [
        'Apartment',
        'Independent House',
        'Villa',
        'Plot',
        'Commercial Office',
        'Commercial Retail',
      ],
      default: 'Apartment',
    },
    price: { type: Number, required: [true, 'Property price is required'] },
    pricePerSqFt: { type: Number, default: null },
    carpetArea: { type: Number, default: null },
    superBuiltUpArea: { type: Number, default: null },
    bhk: { type: String, default: '2 BHK' },
    bathrooms: { type: Number, default: 1 },
    balconies: { type: Number, default: 0 },
    furnishing: {
      type: String,
      enum: ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'],
      default: 'Unfurnished',
    },
    floor: { type: Number, default: 0 },
    totalFloors: { type: Number, default: 1 },
    facing: { type: String, default: 'East' },
    possessionStatus: { type: String, default: 'Ready to Move' },
    ageOfProperty: { type: String, default: '0-1 Years' },
    city: { type: String, required: true, index: true },
    locality: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number, default: 19.076 },
      lng: { type: Number, default: 72.8777 },
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'PUBLISHED', 'REJECTED'],
      default: 'PENDING_APPROVAL',
      index: true,
    },
    isFeatured: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    listedByUserId: { type: String, required: true, index: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    description: { type: String, default: '' },
    viewsCount: { type: Number, default: 0 },
    inquiriesCount: { type: Number, default: 0 },
    rejectionReason: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.customId || ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create text index for full-text search
propertySchema.index({
  title: 'text',
  locality: 'text',
  city: 'text',
  address: 'text',
  description: 'text',
});

// Auto-generate slug before saving
propertySchema.pre('validate', function (next) {
  if (!this.slug && this.title) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    this.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
  }
  next();
});

export const Property = mongoose.model('Property', propertySchema);
