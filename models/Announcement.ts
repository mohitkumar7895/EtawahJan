import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  link: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

