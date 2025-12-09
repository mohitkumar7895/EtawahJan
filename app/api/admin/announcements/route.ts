import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Announcement from '@/models/Announcement';

/**
 * GET /api/admin/announcements
 * Get all announcements (admin only - for management)
 */
export async function GET() {
  try {
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (!mongoUri || mongoUri.trim() === '') {
        console.warn("⚠️ MONGODB_URI not configured - returning empty announcements array");
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
      // Get all announcements sorted by newest first (for admin management)
      const announcements = await Announcement.find()
        .sort({ createdAt: -1 });
      console.log(`✅ Fetched ${announcements.length} announcements`);
      return NextResponse.json(announcements || []);
    } catch (queryError: any) {
      console.error("❌ Error querying announcements:", queryError);
      return NextResponse.json([]);
    }
  } catch (error: any) {
    console.error("❌ Error fetching announcements:", error);
    return NextResponse.json([]);
  }
}

/**
 * POST /api/admin/announcements
 * Create a new announcement (admin only)
 */
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
    const { title, description, isActive } = body;

    // Validation: title and description are required
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!description || !description.trim()) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    console.log("📝 Creating announcement:", { title, isActive });

    const announcement = new Announcement({
      title: title.trim(),
      description: description.trim(),
      isActive: isActive !== undefined ? isActive : true, // Default to true
    });

    const validationError = announcement.validateSync();
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

    const savedAnnouncement = await announcement.save();
    console.log("✅ Announcement created successfully:", savedAnnouncement._id);

    return NextResponse.json(
      {
        message: "Announcement created successfully",
        announcement: savedAnnouncement
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error creating announcement:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          error: "Duplicate announcement",
          message: "An announcement with this title already exists."
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create announcement",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

