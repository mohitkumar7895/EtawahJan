import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import User from '@/models/User';

/**
 * GET /api/users
 * Get all users or get user by phone number
 */
export async function GET(request: NextRequest) {
  try {
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (!mongoUri || mongoUri.trim() === '') {
        return NextResponse.json(
          { error: "Database not configured" },
          { status: 503 }
        );
      }
      
      try {
        await connectDB();
      } catch (connError: any) {
        console.error("❌ Connection failed:", connError.message);
        return NextResponse.json(
          { error: "Database connection error" },
          { status: 503 }
        );
      }

      if (!isDBConnected()) {
        return NextResponse.json(
          { error: "Database not available" },
          { status: 503 }
        );
      }
    }

    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get('phoneNumber');
    const isAdmin = searchParams.get('admin') === 'true';

    // If phoneNumber is provided, return that specific user
    if (phoneNumber) {
      const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
      const user = await User.findOne({ phoneNumber: cleanPhone });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({
        _id: user._id,
        id: user._id.toString(),
        phoneNumber: user.phoneNumber,
        firstChatAt: user.firstChatAt,
        lastActiveAt: user.lastActiveAt,
        messageCount: user.messageCount,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }

    // If admin, return all users
    if (isAdmin) {
      const users = await User.find()
        .sort({ lastActiveAt: -1 })
        .select('phoneNumber firstChatAt lastActiveAt messageCount isActive createdAt updatedAt');
      
      return NextResponse.json(users.map((user) => ({
        _id: user._id,
        id: user._id.toString(),
        phoneNumber: user.phoneNumber,
        firstChatAt: user.firstChatAt,
        lastActiveAt: user.lastActiveAt,
        messageCount: user.messageCount,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })));
    }

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users
 * Create or update user information
 */
export async function POST(request: NextRequest) {
  try {
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (!mongoUri || mongoUri.trim() === '') {
        return NextResponse.json(
          { error: "Database not configured" },
          { status: 503 }
        );
      }
      
      try {
        await connectDB();
      } catch (connError: any) {
        console.error("❌ Connection failed:", connError.message);
        return NextResponse.json(
          { error: "Database connection error" },
          { status: 503 }
        );
      }

      if (!isDBConnected()) {
        return NextResponse.json(
          { error: "Database not available" },
          { status: 503 }
        );
      }
    }

    const body = await request.json();
    const { phoneNumber } = body;

    // Validation
    if (!phoneNumber || !phoneNumber.trim()) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Validate phone number (Indian format: 10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phoneNumber.trim().replace(/\D/g, ''); // Remove non-digits
    if (cleanPhone.length !== 10 || !phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { error: "Invalid phone number. Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await User.findOne({ phoneNumber: cleanPhone });

    if (!user) {
      // Create new user
      user = new User({
        phoneNumber: cleanPhone,
        firstChatAt: new Date(),
        lastActiveAt: new Date(),
        messageCount: 0,
        isActive: true,
      });
      await user.save();
      console.log("✅ New user created:", cleanPhone);
    } else {
      // Update existing user - update last active time
      user.lastActiveAt = new Date();
      user.isActive = true;
      await user.save();
      console.log("✅ User updated:", cleanPhone);
    }

    return NextResponse.json(
      {
        message: "User saved successfully",
        user: {
          _id: user._id,
          id: user._id.toString(),
          phoneNumber: user.phoneNumber,
          firstChatAt: user.firstChatAt,
          lastActiveAt: user.lastActiveAt,
          messageCount: user.messageCount,
          isActive: user.isActive,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error saving user:", error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save user", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users
 * Update user information (like message count, last active)
 */
export async function PUT(request: NextRequest) {
  try {
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (!mongoUri || mongoUri.trim() === '') {
        return NextResponse.json(
          { error: "Database not configured" },
          { status: 503 }
        );
      }
      
      try {
        await connectDB();
      } catch (connError: any) {
        console.error("❌ Connection failed:", connError.message);
        return NextResponse.json(
          { error: "Database connection error" },
          { status: 503 }
        );
      }

      if (!isDBConnected()) {
        return NextResponse.json(
          { error: "Database not available" },
          { status: 503 }
        );
      }
    }

    const body = await request.json();
    const { phoneNumber, messageCount, lastActiveAt } = body;

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');
    const user = await User.findOne({ phoneNumber: cleanPhone });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update fields
    if (messageCount !== undefined) {
      user.messageCount = messageCount;
    }
    if (lastActiveAt !== undefined) {
      user.lastActiveAt = new Date(lastActiveAt);
    } else {
      user.lastActiveAt = new Date();
    }

    await user.save();

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        id: user._id.toString(),
        phoneNumber: user.phoneNumber,
        firstChatAt: user.firstChatAt,
        lastActiveAt: user.lastActiveAt,
        messageCount: user.messageCount,
        isActive: user.isActive,
      },
    });
  } catch (error: any) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user", message: error.message },
      { status: 500 }
    );
  }
}

