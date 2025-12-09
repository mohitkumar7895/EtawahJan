import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Announcement from '@/models/Announcement';

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

