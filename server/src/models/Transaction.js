import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    customId: { type: String, sparse: true, index: true },
    dealerId: { type: String, required: true, index: true },
    dealerName: { type: String, required: true },
    agencyName: { type: String, default: null },
    planId: { type: String, required: true },
    planName: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'UPI / Razorpay' },
    status: {
      type: String,
      enum: ['SUCCESS', 'PENDING', 'FAILED'],
      default: 'SUCCESS',
    },
    referenceId: { type: String, required: true },
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

export const Transaction = mongoose.model('Transaction', transactionSchema);
