import mongoose from 'mongoose';

const portfolioProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    default: 'Project',
  },
  photoUrl: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  liveUrl: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.PortfolioProject || mongoose.model('PortfolioProject', portfolioProjectSchema);
