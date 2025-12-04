import mongoose from 'mongoose';

let isConnected = false;

// Function to get MongoDB URI from environment variables
function getMongoDBURI() {
  return process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
}

export async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('✅ MongoDB already connected');
    return;
  }

  // Get MongoDB URI (read from env at runtime, not module load time)
  let MONGODB_URI = getMongoDBURI();

  // Trim whitespace if present
  if (MONGODB_URI) {
    MONGODB_URI = MONGODB_URI.trim();
    // Remove quotes if present
    if ((MONGODB_URI.startsWith('"') && MONGODB_URI.endsWith('"')) || 
        (MONGODB_URI.startsWith("'") && MONGODB_URI.endsWith("'"))) {
      MONGODB_URI = MONGODB_URI.slice(1, -1);
    }
  }

  // Check if MONGODB_URI is set
  if (!MONGODB_URI || MONGODB_URI === '') {
    console.error('❌ MONGODB_URI not configured!');
    console.error('⚠️ Please set MONGODB_URI environment variable with your MongoDB Atlas connection string.');
    
    // Different messages for Vercel vs local
    if (process.env.VERCEL) {
      console.error('💡 For Vercel: Go to Vercel Dashboard → Settings → Environment Variables');
      console.error('💡 Add MONGODB_URI with your MongoDB Atlas connection string');
      console.error('💡 Then redeploy your backend');
    } else {
      console.error('💡 Check your .env file in the backend directory');
    }
    
    console.error('💡 Format: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority');
    console.error('💡 Make sure there are NO spaces around the = sign');
    throw new Error('MongoDB connection string not configured. Please set MONGODB_URI environment variable.');
  }

  // Validate URI format
  if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
    console.error('❌ Invalid MongoDB URI format!');
    console.error('⚠️ URI should start with mongodb:// or mongodb+srv://');
    throw new Error('Invalid MongoDB connection string format.');
  }

  // Note: localhost MongoDB is fine for local development
  if (MONGODB_URI.includes('localhost')) {
    console.log('ℹ️ Using localhost MongoDB (for local development)');
  }

  try {
    const options = {
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout for Atlas
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    };

    console.log('🔄 Attempting to connect to MongoDB...');
    
    // Show connection string preview (first 30 chars + last 20 chars)
    const uriPreview = MONGODB_URI.length > 50 
      ? MONGODB_URI.substring(0, 30) + '...' + MONGODB_URI.substring(MONGODB_URI.length - 20)
      : MONGODB_URI.substring(0, 20) + '...';
    console.log('📍 Connection string:', uriPreview);
    
    await mongoose.connect(MONGODB_URI, options);
    isConnected = true;
    
    // Hide credentials in logs
    const safeUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log('✅ MongoDB Connected successfully');
    console.log('📍 Connection string:', safeUri);
    console.log('📊 Database:', mongoose.connection.db?.databaseName || 'Unknown');
    
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

