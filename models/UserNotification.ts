import mongoose from 'mongoose';

const userNotificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true, // For faster queries
  },
  notificationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification',
    required: true,
    index: true,
  },
  seenAt: {
    type: Date,
    default: null,
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Compound index for faster queries
userNotificationSchema.index({ userId: 1, notificationId: 1 }, { unique: true });
userNotificationSchema.index({ userId: 1, isSeen: 1 });

export default mongoose.models.UserNotification || mongoose.model('UserNotification', userNotificationSchema);

