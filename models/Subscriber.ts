import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    index: true,
  },
  mobile: {
    type: String,
    trim: true,
    index: true,
  },
  name: {
    type: String,
    trim: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  lastNotifiedAt: {
    type: Date,
  },
  notificationCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for faster queries
subscriberSchema.index({ email: 1 });
subscriberSchema.index({ mobile: 1 });
subscriberSchema.index({ isActive: 1 });

export default mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);

