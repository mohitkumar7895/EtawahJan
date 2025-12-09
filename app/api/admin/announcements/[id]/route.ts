import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Announcement from '@/models/Announcement';

/**
 * PUT /api/admin/announcements/:id
 * Update an existing announcement (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (!mongoUri || mongoUri.trim() === '') {
        return NextResponse.json(
          {
            error: "Database not configured",
            message: "MONGODB_URI environment variable is not set."
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
            error: "Database not available",
            message: "Please check MongoDB connection string in environment variables"
          },
          { status: 503 }
        );
      }

      if (!isDBConnected()) {
        return NextResponse.json(
          {
            error: "Database not available",
            message: "MongoDB connection could not be established"
          },
          { status: 503 }
        );
      }
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Announcement ID is required" }, { status: 400 });
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (title !== undefined) {
      if (!title || !title.trim()) {
        return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
      }
      updateData.title = title.trim();
    }
    if (description !== undefined) {
      if (!description || !description.trim()) {
        return NextResponse.json({ error: "Description cannot be empty" }, { status: 400 });
      }
      updateData.description = description.trim();
    }
    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    console.log("📝 Updating announcement:", id, updateData);

    const announcement = await Announcement.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return NextResponse.json(
        {
          error: "Announcement not found",
          message: "The announcement you are trying to update does not exist."
        },
        { status: 404 }
      );
    }

    console.log("✅ Announcement updated successfully:", announcement._id);
    return NextResponse.json({
      message: "Announcement updated successfully",
      announcement: announcement
    });
  } catch (error: any) {
    console.error("❌ Error updating announcement:", error);

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

    if (error.name === 'CastError') {
      return NextResponse.json(
        {
          error: "Invalid announcement ID format"
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update announcement",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/announcements/:id
 * Delete an announcement (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Announcement ID is required" }, { status: 400 });
    }

    console.log("🗑️ Deleting announcement:", id);

    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
      return NextResponse.json(
        {
          error: "Announcement not found",
          message: "The announcement you are trying to delete does not exist."
        },
        { status: 404 }
      );
    }

    console.log("✅ Announcement deleted successfully:", id);

    return NextResponse.json({ 
      message: "Announcement deleted successfully",
      id: id 
    }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error deleting announcement:", error);

    return NextResponse.json(
      {
        error: "Failed to delete announcement",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

