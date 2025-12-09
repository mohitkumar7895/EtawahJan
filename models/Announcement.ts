import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  // Keep isImportant for backward compatibility (optional field)
  isImportant: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // This automatically adds createdAt and updatedAt
});

export default mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);

