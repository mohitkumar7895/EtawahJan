import mongoose from 'mongoose';

const sitemapLinkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  changeFrequency: {
    type: String,
    default: 'weekly',
    enum: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'],
    trim: true,
  },
  priority: {
    type: Number,
    default: 0.5,
    min: 0.0,
    max: 1.0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
sitemapLinkSchema.index({ isActive: 1 });
sitemapLinkSchema.index({ url: 1 });

export default mongoose.models.SitemapLink || mongoose.model('SitemapLink', sitemapLinkSchema);
