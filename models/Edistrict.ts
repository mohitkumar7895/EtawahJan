import mongoose from 'mongoose';

const edistrictSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    subject: { type: String, required: true, trim: true },
    certificateNumber: { type: String, default: '', trim: true },
    name: { type: String, required: true, trim: true },
    mobile: { type: String, default: '' },
    address: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    jama: { type: Number, default: 0 },
    baki: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Edistrict || mongoose.model('Edistrict', edistrictSchema);
