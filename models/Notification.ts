import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['vacancy', 'announcement', 'update', 'general'],
    default: 'general',
  },
  link: {
    type: String,
    default: '',
  },
  relatedId: {
    type: String,
    default: null, // ID of related vacancy/announcement
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    default: null, // Optional expiration date
  },
}, {
  timestamps: true,
});

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

