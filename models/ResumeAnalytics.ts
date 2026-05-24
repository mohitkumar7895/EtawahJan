import mongoose from 'mongoose';

const resumeAnalyticsSchema = new mongoose.Schema(
  {
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'ResumeBuilderUser', index: true },
    event: {
      type: String,
      enum: ['create', 'edit', 'export_pdf', 'share_view', 'template_change', 'ai_summary', 'ai_ats'],
      required: true,
    },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

resumeAnalyticsSchema.index({ createdAt: -1 });

export default mongoose.models.ResumeAnalytics ||
  mongoose.model('ResumeAnalytics', resumeAnalyticsSchema);
