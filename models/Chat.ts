import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['customer', 'admin'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'pdf'],
    default: 'text',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

const chatSchema = new mongoose.Schema({
  userPhone: {
    type: String,
    required: true,
    index: true,
  },
  messages: [messageSchema],
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster queries
chatSchema.index({ userPhone: 1, lastMessageAt: -1 });

export default mongoose.models.Chat || mongoose.model('Chat', chatSchema);

