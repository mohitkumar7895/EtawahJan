import mongoose, { Schema, Document } from 'mongoose';

export interface ITheme extends Document {
  primaryColorName: string;
  updatedAt: Date;
}

const themeSchema = new Schema<ITheme>({
  primaryColorName: {
    type: String,
    required: true,
    default: 'blue',
  }
}, { timestamps: true });

// We typically only have one theme document for global settings.
const Theme = mongoose.models.Theme || mongoose.model<ITheme>('Theme', themeSchema);

export default Theme;
