import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    aadharNumber: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    withdrawal: { type: String, default: '' },
    remains: { type: Number, default: 0 },
    signature: { type: String, default: '' },
    mobileNumber: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Withdrawal || mongoose.model('Withdrawal', withdrawalSchema);
