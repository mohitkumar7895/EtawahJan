import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adminjanseva';

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected:', MONGODB_URI);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    throw error;
  }
}

