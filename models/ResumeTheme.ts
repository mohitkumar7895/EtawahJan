import mongoose from 'mongoose';

const resumeThemeSchema = new mongoose.Schema(
  {
    themeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} },
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.ResumeTheme || mongoose.model('ResumeTheme', resumeThemeSchema);
