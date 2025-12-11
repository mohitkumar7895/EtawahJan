import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  razorpayOrderId: {
    type: String,
    required: true,
    index: true,
  },
  razorpayPaymentId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  razorpaySignature: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending',
  },
  customerName: {
    type: String,
    default: '',
  },
  customerEmail: {
    type: String,
    default: '',
  },
  customerPhone: {
    type: String,
    default: '',
  },
  receipt: {
    type: String,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
paymentSchema.index({ paymentDate: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ razorpayPaymentId: 1 });

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

