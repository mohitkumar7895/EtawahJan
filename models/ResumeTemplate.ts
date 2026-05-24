import mongoose from 'mongoose';

const resumeTemplateSchema = new mongoose.Schema(
  {
    templateId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    category: String,
    layout: String,
    isPremium: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.ResumeTemplate ||
  mongoose.model('ResumeTemplate', resumeTemplateSchema);
