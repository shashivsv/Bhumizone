import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    planId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    durationMonths: { type: Number, required: true },
    durationLabel: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: 0 },
    savingsPercent: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
    tagline: { type: String, default: '' },
    features: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.planId;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Plan = mongoose.model('Plan', planSchema);
