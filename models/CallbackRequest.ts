import mongoose from 'mongoose';

const callbackRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    jobTitle: { type: String, default: '', trim: true },
    jobSlug: { type: String, default: '', trim: true },
    category: { type: String, default: '', trim: true },
    source: { type: String, default: 'notification', trim: true },
    status: {
      type: String,
      enum: ['pending', 'contacted'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.CallbackRequest ||
  mongoose.model('CallbackRequest', callbackRequestSchema);
