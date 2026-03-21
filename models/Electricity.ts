import mongoose from 'mongoose';

const electricitySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    name: { type: String, required: true, trim: true },
    id: { type: String, required: true, trim: true },
    password: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    baki: { type: Number, default: 0 },
    address: { type: String, default: '' },
    contact: { type: String, default: '' },
  },
  { timestamps: true, id: false }
);

export default mongoose.models.Electricity || mongoose.model('Electricity', electricitySchema);
