import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    customId: { type: String, sparse: true, index: true },
    propertyId: { type: String, required: true, index: true },
    propertyTitle: { type: String, default: '' },
    buyerId: { type: String, default: null, index: true },
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    ownerId: { type: String, required: true, index: true },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'CLOSED'],
      default: 'NEW',
    },
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

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
