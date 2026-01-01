import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Notification from '@/models/Notification';

/**
 * PUT /api/notifications/[id]
 * Mark a specific notification as read
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...notification.toObject(),
      id: notification._id.toString(),
    });
  } catch (error: any) {
    console.error("❌ Error updating notification:", error);
    return NextResponse.json(
      { error: "Failed to update notification", message: error.message },
      { status: 500 }
    );
  }
}

