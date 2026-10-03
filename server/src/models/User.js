import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const subscriptionSchema = new mongoose.Schema(
  {
    planId: { type: String, default: null },
    planName: { type: String, default: null },
    isActive: { type: Boolean, default: false },
    isExpired: { type: Boolean, default: false },
    startedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
    daysRemaining: { type: Number, default: 0 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    customId: { type: String, sparse: true, index: true },
    name: { type: String, required: [true, 'Please provide a name'], trim: true },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, 'Please provide a password'], minlength: 6 },
    role: {
      type: String,
      enum: ['BUYER', 'OWNER', 'DEALER', 'ADMIN'],
      default: 'BUYER',
    },
    phone: { type: String, default: '' },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    },
    city: { type: String, default: 'Mumbai' },
    agencyName: { type: String, default: null },
    savedProperties: [{ type: String }],
    subscription: {
      type: subscriptionSchema,
      default: () => ({
        planId: null,
        planName: null,
        isActive: false,
        isExpired: false,
        startedAt: null,
        expiresAt: null,
        daysRemaining: 0,
      }),
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.customId || ret._id.toString();
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
