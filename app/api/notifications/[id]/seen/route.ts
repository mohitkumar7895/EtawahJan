import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import UserNotification from '@/models/UserNotification';
import Notification from '@/models/Notification';

// Mark a notification as seen for a user
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const notificationId = params.id;
    const body = await request.json();
    const userId = body.userId || 'anonymous';
    
    // Verify notification exists
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      );
    }
    
    // Check if already marked as seen
    const existing = await UserNotification.findOne({
      userId,
      notificationId,
    });
    
    if (existing) {
      // Update existing record
      existing.isSeen = true;
      existing.seenAt = new Date();
      await existing.save();
    } else {
      // Create new record
      const userNotification = new UserNotification({
        userId,
        notificationId,
        isSeen: true,
        seenAt: new Date(),
      });
      await userNotification.save();
    }
    
    return NextResponse.json({
      success: true,
      message: 'Notification marked as seen',
    });
  } catch (error: any) {
    console.error('Error marking notification as seen:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to mark notification as seen' },
      { status: 500 }
    );
  }
}

