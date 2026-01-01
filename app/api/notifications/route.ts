import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Notification from '@/models/Notification';

/**
 * GET /api/notifications
 * Get notifications for a user (or all global notifications if no userId)
 */
export async function GET(request: NextRequest) {
  try {
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (!mongoUri || mongoUri.trim() === '') {
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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query
    const query: any = {};
    
    if (userId) {
      query.$or = [
        { userId: userId },
        { isGlobal: true }
      ];
    } else {
      query.isGlobal = true;
    }

    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Count unread notifications
    const unreadCount = await Notification.countDocuments({
      ...query,
      isRead: false,
    });

    return NextResponse.json({
      notifications: notifications || [],
      unreadCount,
    });
  } catch (error: any) {
    console.error("❌ Error fetching notifications:", error);
    return NextResponse.json({
      notifications: [],
      unreadCount: 0,
    });
  }
}

/**
 * POST /api/notifications
 * Create a new notification (admin only - called when vacancy/announcement is created)
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
    const { type, title, message, link, relatedId, relatedModel } = body;

    if (!type || !title || !message) {
      return NextResponse.json(
        { error: "Type, title, and message are required" },
        { status: 400 }
      );
    }

    if (!['vacancy', 'announcement'].includes(type)) {
      return NextResponse.json(
        { error: "Invalid notification type" },
        { status: 400 }
      );
    }

    console.log("📝 Creating notification:", { type, title });

    const notification = new Notification({
      type,
      title: title.trim(),
      message: message.trim(),
      link: link ? link.trim() : undefined,
      relatedId: relatedId || undefined,
      relatedModel: relatedModel || (type === 'vacancy' ? 'Vacancy' : 'Announcement'),
      isGlobal: true, // Notifications are global for all users
      isRead: false,
    });

    const savedNotification = await notification.save();
    console.log("✅ Notification created successfully:", savedNotification._id);

    return NextResponse.json({
      ...savedNotification.toObject(),
      id: savedNotification._id.toString(),
    }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error creating notification:", error);
    return NextResponse.json(
      { error: "Failed to create notification", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications
 * Mark notifications as read
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
    const { notificationIds, markAllAsRead } = body;

    if (markAllAsRead) {
      // Mark all global notifications as read
      await Notification.updateMany(
        { isGlobal: true, isRead: false },
        { isRead: true, readAt: new Date() }
      );
      
      return NextResponse.json({ 
        message: "All notifications marked as read",
        updated: true 
      });
    }

    if (notificationIds && Array.isArray(notificationIds) && notificationIds.length > 0) {
      await Notification.updateMany(
        { _id: { $in: notificationIds } },
        { isRead: true, readAt: new Date() }
      );
      
      return NextResponse.json({ 
        message: "Notifications marked as read",
        updated: true 
      });
    }

    return NextResponse.json(
      { error: "No notification IDs provided" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("❌ Error updating notifications:", error);
    return NextResponse.json(
      { error: "Failed to update notifications", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications
 * Delete all notifications (clear database)
 */
export async function DELETE(request: NextRequest) {
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

    // Delete ALL notifications from database
    const result = await Notification.deleteMany({});
    
    console.log(`🗑️ Deleted ${result.deletedCount} notifications from database`);

    return NextResponse.json({ 
      message: "All notifications deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    console.error("❌ Error deleting notifications:", error);
    return NextResponse.json(
      { error: "Failed to delete notifications", message: error.message },
      { status: 500 }
    );
  }
}

