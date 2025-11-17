import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/adminjanseva';

let isConnected = false;

export async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('✅ MongoDB already connected');
    return;
  }

  // Check if MONGODB_URI is set
  if (!MONGODB_URI || MONGODB_URI.includes('localhost') && process.env.VERCEL) {
    console.error('❌ MONGODB_URI not configured for production!');
    console.error('⚠️ For Vercel deployment, you need MongoDB Atlas or a cloud MongoDB service.');
    throw new Error('MongoDB connection string not configured. Please set MONGODB_URI environment variable.');
  }

  try {
    const options = {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000,
    };

    console.log('🔄 Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI, options);
    isConnected = true;
    
    // Hide credentials in logs
    const safeUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log('✅ MongoDB Connected successfully');
    console.log('📍 Connection string:', safeUri);
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      isConnected = true;
    });
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('Error details:', {
      name: error.name,
      code: error.code,
      message: error.message
    });
    isConnected = false;
    throw error;
  }
}

export function isDBConnected() {
  return mongoose.connection.readyState === 1;
}

