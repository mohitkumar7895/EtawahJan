import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
    // Index defined separately below
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  service_type: {
    type: String,
    required: true,
    trim: true,
    // Index defined separately below
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'rejected'],
    default: 'pending',
    // Index defined separately below
  },
  trackingId: {
    type: String,
    unique: true,
    required: true,
    // Index defined separately below
  },
  applicationId: {
    type: String,
    // Kept to satisfy legacy unique indexes in MongoDB environments
  },
  remarks: {
    type: String,
    default: '',
  },
  adminNotes: {
    type: String,
    default: '',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
// Note: trackingId already has unique: true which creates an index automatically
applicationSchema.index({ mobile: 1, submittedAt: -1 });
applicationSchema.index({ status: 1, submittedAt: -1 });
applicationSchema.index({ service_type: 1 });

// Generate unique tracking ID before saving
applicationSchema.pre('save', async function(next) {
  if (this.isNew && !this.trackingId) {
    // Generate tracking ID: JSK + timestamp + random 4 digits
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.trackingId = `JSK${timestamp}${random}`;
  }
  // Safeguard: satisfy any legacy unique database index constraints on applicationId
  if (this.isNew || !this.applicationId) {
    this.applicationId = this.trackingId;
  }
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Application || mongoose.model('Application', applicationSchema);

