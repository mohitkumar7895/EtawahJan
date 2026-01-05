import mongoose from 'mongoose';

const governmentLinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    default: '🔗',
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  category: {
    type: String,
    default: 'General',
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
governmentLinkSchema.index({ isActive: 1, order: 1 });
governmentLinkSchema.index({ category: 1 });

export default mongoose.models.GovernmentLink || mongoose.model('GovernmentLink', governmentLinkSchema);

