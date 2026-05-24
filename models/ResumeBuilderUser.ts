import mongoose from 'mongoose';

const resumeBuilderUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    googleId: { type: String, sparse: true },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    resumeCount: { type: Number, default: 0 },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

resumeBuilderUserSchema.index({ googleId: 1 }, { sparse: true });

export default mongoose.models.ResumeBuilderUser ||
  mongoose.model('ResumeBuilderUser', resumeBuilderUserSchema);
