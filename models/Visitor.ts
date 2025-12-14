import mongoose from 'mongoose';

const VisitorSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  page: {
    type: String,
    required: true,
  },
  referrer: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  device: {
    type: String,
    default: '',
  },
  browser: {
    type: String,
    default: '',
  },
  os: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  firstVisit: {
    type: Date,
    default: Date.now,
  },
  visitCount: {
    type: Number,
    default: 1,
  },
  name: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Index for faster queries
VisitorSchema.index({ sessionId: 1 });
VisitorSchema.index({ lastActivity: -1 });
VisitorSchema.index({ isActive: 1 });

export default mongoose.models.Visitor || mongoose.model('Visitor', VisitorSchema);

