import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'ResumeBuilderUser', required: true, index: true },
    title: { type: String, default: 'My Resume' },
    templateId: { type: String, default: 'modern' },
    theme: { type: mongoose.Schema.Types.Mixed, default: {} },
    sections: { type: [mongoose.Schema.Types.Mixed], default: [] },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    completionPercent: { type: Number, default: 0 },
    atsScore: { type: Number, default: 0 },
    version: { type: Number, default: 1 },
    shareSlug: { type: String, unique: true, sparse: true },
    isPublic: { type: Boolean, default: false },
    history: { type: [mongoose.Schema.Types.Mixed], default: [] },
    lastAutoSavedAt: { type: Date },
  },
  { timestamps: true }
);

resumeSchema.index({ userId: 1, updatedAt: -1 });
resumeSchema.index({ shareSlug: 1 });

export default mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
