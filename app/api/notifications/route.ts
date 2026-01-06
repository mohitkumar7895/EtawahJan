import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Notification from '@/models/Notification';
import UserNotification from '@/models/UserNotification';

// Get notifications for a user (unseen notifications)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get userId from query params or generate from session
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'anonymous';
    
    // Get all active notifications
    const notifications = await Notification.find({ 
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    }).sort({ createdAt: -1 });
    
    // Get seen notification IDs for this user
    const seenNotifications = await UserNotification.find({
      userId,
      isSeen: true,
    }).select('notificationId');
    
    const seenIds = new Set(seenNotifications.map(sn => sn.notificationId.toString()));
    
    // Filter out seen notifications and remove duplicates based on relatedId
    const unseenNotifications = notifications.filter(notif => !seenIds.has(notif._id.toString()));
    
    // Remove duplicates - if same relatedId exists, keep only the latest one
    const uniqueNotifications = unseenNotifications.reduce((acc: any[], notif) => {
      if (notif.relatedId) {
        const existingIndex = acc.findIndex(n => n.relatedId === notif.relatedId);
        if (existingIndex >= 0) {
          // Keep the newer one
          if (new Date(notif.createdAt) > new Date(acc[existingIndex].createdAt)) {
            acc[existingIndex] = notif;
          }
        } else {
          acc.push(notif);
        }
      } else {
        acc.push(notif);
      }
      return acc;
    }, []);
    
    return NextResponse.json({
      success: true,
      notifications: uniqueNotifications,
      count: uniqueNotifications.length,
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// Create a new notification (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, message, type, link, relatedId, expiresAt } = body;
    
    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: 'Title and message are required' },
        { status: 400 }
      );
    }
    
    const notification = new Notification({
      title: title.trim(),
      message: message.trim(),
      type: type || 'general',
      link: link || '',
      relatedId: relatedId || null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: true,
    });
    
    await notification.save();
    
    return NextResponse.json({
      success: true,
      notification,
      message: 'Notification created successfully',
    });
  } catch (error: any) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create notification' },
      { status: 500 }
    );
  }
}

