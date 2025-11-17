import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adminjanseva';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log('✅ MongoDB already connected');
    return;
  }

  try {
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    };

    await mongoose.connect(MONGODB_URI, options);
    isConnected = true;
    console.log('✅ MongoDB Connected:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      isConnected = false;
    });
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    isConnected = false;
    throw error;
  }
}

export function isDBConnected() {
  return mongoose.connection.readyState === 1;
}

