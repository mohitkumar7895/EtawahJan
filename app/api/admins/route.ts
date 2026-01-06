import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Admin from '@/models/Admin';

export async function GET() {
  try {
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (!mongoUri || mongoUri.trim() === '') {
        console.warn("⚠️ MONGODB_URI not configured - returning empty admins array");
        return NextResponse.json([]);
      }
      
      try {
        await connectDB();
      } catch (connError: any) {
        console.error("❌ Connection failed:", connError.message);
        return NextResponse.json([]);
      }

      if (!isDBConnected()) {
        return NextResponse.json([]);
      }
    }

    try {
      const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
      console.log(`✅ Fetched ${admins.length} admins`);
      return NextResponse.json(admins || []);
    } catch (queryError: any) {
      console.error("❌ Error querying admins:", queryError);
      return NextResponse.json([]);
    }
  } catch (error: any) {
    console.error("❌ Error fetching admins:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (!mongoUri || mongoUri.trim() === '') {
        return NextResponse.json(
          {
            error: "Database not configured",
            message: "MONGODB_URI is not set.",
          },
          { status: 503 }
        );
      }
      
      try {
        await connectDB();
      } catch (connError: any) {
        console.error("❌ Connection failed:", connError.message);
        return NextResponse.json(
          {
            error: "Database connection error",
            message: "Failed to connect to database.",
          },
          { status: 503 }
        );
      }

      if (!isDBConnected()) {
        return NextResponse.json(
          {
            error: "Database not available",
            message: "MongoDB connection could not be established.",
          },
          { status: 503 }
        );
      }
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !username.trim()) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }
    if (!password || !password.trim()) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    console.log("📝 Creating admin:", { username });

    const admin = new Admin({
      username: username.trim(),
      password: password.trim(),
    });

    const validationError = admin.validateSync();
    if (validationError) {
      const errors = Object.values(validationError.errors).map((e: any) => e.message);
      return NextResponse.json(
        {
          error: "Validation error",
          details: errors.join(', ')
        },
        { status: 400 }
      );
    }

    const savedAdmin = await admin.save();
    console.log("✅ Admin created successfully:", savedAdmin._id);

    // Return admin without password
    const adminObj = savedAdmin.toObject();
    delete adminObj.password;

    return NextResponse.json({
      ...adminObj,
      id: savedAdmin._id.toString()
    }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error creating admin:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          error: "Username already exists",
          message: "An admin with this username already exists."
        },
        { status: 400 }
      );
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json(
        {
          error: "Validation error",
          details: errors.join(', ')
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create admin",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}












