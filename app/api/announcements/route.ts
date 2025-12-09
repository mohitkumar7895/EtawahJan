import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Announcement from '@/models/Announcement';

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
      // Get only active announcements, sorted by newest first
      const announcements = await Announcement.find({ isActive: true })
        .sort({ createdAt: -1 });
      console.log(`✅ Fetched ${announcements.length} active announcements`);
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
    const { title, description, isImportant } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!description || !description.trim()) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    console.log("📝 Creating announcement:", { title, isImportant });

    const announcement = new Announcement({
      title: title.trim(),
      description: description.trim(),
      isImportant: isImportant || false,
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

