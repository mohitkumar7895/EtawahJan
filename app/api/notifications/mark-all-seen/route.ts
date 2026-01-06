import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import UserNotification from '@/models/UserNotification';
import Notification from '@/models/Notification';

// Mark all notifications as seen for a user
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const userId = body.userId || 'anonymous';
    
    // Get all active notifications
    const notifications = await Notification.find({ isActive: true });
    const notificationIds = notifications.map(n => n._id);
    
    // Mark all as seen
    for (const notificationId of notificationIds) {
      const existing = await UserNotification.findOne({
        userId,
        notificationId,
      });
      
      if (existing) {
        existing.isSeen = true;
        existing.seenAt = new Date();
        await existing.save();
      } else {
        const userNotification = new UserNotification({
          userId,
          notificationId,
          isSeen: true,
          seenAt: new Date(),
        });
        await userNotification.save();
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'All notifications marked as seen',
    });
  } catch (error: any) {
    console.error('Error marking all notifications as seen:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to mark notifications as seen' },
      { status: 500 }
    );
  }
}

