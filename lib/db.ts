import mongoose from 'mongoose';

// Global connection cache for serverless (Vercel/Netlify)
let cachedConnection: typeof mongoose | null = null;
let isConnecting = false;

// Function to get MongoDB URI from environment variables
function getMongoDBURI() {
  return process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
}

export async function connectDB() {
  // Return cached connection if available and connected
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  // If already connecting, wait for it
  if (isConnecting) {
    return new Promise((resolve, reject) => {
      const checkConnection = setInterval(() => {
        if (mongoose.connection.readyState === 1) {
          clearInterval(checkConnection);
          resolve(cachedConnection);
        } else if (!isConnecting) {
          clearInterval(checkConnection);
          reject(new Error('Connection failed'));
        }
      }, 100);
      
      setTimeout(() => {
        clearInterval(checkConnection);
        reject(new Error('Connection timeout'));
      }, 3000);
    });
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
    console.error('⚠️ Please set MONGODB_URI environment variable in .env.local file.');
    console.error('💡 Create .env.local file in root directory with: MONGODB_URI=your_connection_string');
    throw new Error('MongoDB connection string not configured. Please set MONGODB_URI environment variable.');
  }

  // Validate URI format
  if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
    console.error('❌ Invalid MongoDB URI format!');
    console.error('⚠️ URI should start with mongodb:// or mongodb+srv://');
    throw new Error('Invalid MongoDB connection string format.');
  }

  isConnecting = true;

  try {
    // Ultra-optimized for serverless (Vercel) - very fast timeouts
    const options: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 3000, // 3 seconds max
      socketTimeoutMS: 5000, // 5 seconds
      connectTimeoutMS: 3000, // 3 seconds connection timeout
      maxPoolSize: 1, // Single connection for serverless
      minPoolSize: 0,
      retryWrites: true,
      w: 'majority' as const,
      // Optimize for serverless
      bufferCommands: false,
      // Fast connection options
      directConnection: false,
      // Reduce DNS lookup time
      family: 4 // Force IPv4
    };

    console.log('🔄 Attempting fast MongoDB connection...');
    
    // Add connection string optimizations
    let optimizedUri = MONGODB_URI;
    // Ensure retryWrites is in URI if not present
    if (!optimizedUri.includes('retryWrites')) {
      optimizedUri += (optimizedUri.includes('?') ? '&' : '?') + 'retryWrites=true&w=majority';
    }
    
    await mongoose.connect(optimizedUri, options);
    cachedConnection = mongoose;
    isConnecting = false;
    
    console.log('✅ MongoDB Connected successfully');
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      cachedConnection = null;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      cachedConnection = null;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      cachedConnection = mongoose;
    });

    return cachedConnection;
  } catch (error: any) {
    isConnecting = false;
    cachedConnection = null;
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
}

export function isDBConnected() {
  return mongoose.connection.readyState === 1 && cachedConnection !== null;
}

