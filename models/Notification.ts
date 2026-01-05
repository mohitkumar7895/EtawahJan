import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['vacancy'],
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  link: {
    type: String,
    trim: true,
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedModel',
    index: true,
  },
  relatedModel: {
    type: String,
    enum: ['Vacancy'],
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  readAt: {
    type: Date,
  },
  userId: {
    type: String,
    index: true,
  },
  isGlobal: {
    type: Boolean,
    default: true, // If true, notification is for all users
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
notificationSchema.index({ isRead: 1, createdAt: -1 });
notificationSchema.index({ isGlobal: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);


