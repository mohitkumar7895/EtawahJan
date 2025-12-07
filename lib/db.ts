import mongoose from 'mongoose';

let isConnected = false;

// Function to get MongoDB URI from environment variables
function getMongoDBURI() {
  return process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
}

// Track if we've already tried to connect and failed (to avoid spam)
let connectionAttempted = false;

export async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
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
    // Only log error once to avoid spam
    if (!connectionAttempted) {
      console.error('❌ MONGODB_URI not configured!');
      console.error('⚠️ Please set MONGODB_URI environment variable in .env.local file.');
      console.error('💡 Create .env.local file in root directory with: MONGODB_URI=your_connection_string');
      connectionAttempted = true;
    }
    throw new Error('MongoDB connection string not configured. Please set MONGODB_URI environment variable.');
  }

  // Validate URI format
  if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
    console.error('❌ Invalid MongoDB URI format!');
    console.error('⚠️ URI should start with mongodb:// or mongodb+srv://');
    throw new Error('Invalid MongoDB connection string format.');
  }

  try {
    const options: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority' as const
    };

    console.log('🔄 Attempting to connect to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, options);
    isConnected = true;
    connectionAttempted = false; // Reset on successful connection
    
    console.log('✅ MongoDB Connected successfully');
    
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
  } catch (error: any) {
    console.error('❌ MongoDB Connection Error:', error.message);
    isConnected = false;
    throw error;
  }
}

export function isDBConnected() {
  return mongoose.connection.readyState === 1;
}

