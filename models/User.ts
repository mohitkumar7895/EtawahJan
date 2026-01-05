import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    // Index defined separately below
  },
  firstChatAt: {
    type: Date,
    default: Date.now,
  },
  lastActiveAt: {
    type: Date,
    default: Date.now,
  },
  messageCount: {
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
// Note: phoneNumber already has unique: true which creates an index automatically
userSchema.index({ lastActiveAt: -1 });

export default mongoose.models.User || mongoose.model('User', userSchema);

