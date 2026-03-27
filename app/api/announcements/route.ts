import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Announcement from '@/models/Announcement';
import Notification from '@/models/Notification';

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
      const announcements = await Announcement.find({ isActive: true })
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

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, description, link, imageUrl, videoUrl, expiresAt } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    console.log("📝 Creating announcement:", { title });

    const announcement = new Announcement({
      title: title.trim(),
      description: description ? description.trim() : '',
      link: link ? link.trim() : '',
      imageUrl: typeof imageUrl === 'string' ? imageUrl.trim() : '',
      videoUrl: typeof videoUrl === 'string' ? videoUrl.trim() : '',
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: true,
    });

    const savedAnnouncement = await announcement.save();
    console.log("✅ Announcement created successfully:", savedAnnouncement._id);

    // Create in-app notification
    try {
      const notificationMessage = savedAnnouncement.description 
        ? `${savedAnnouncement.title} - ${savedAnnouncement.description.substring(0, 100)}${savedAnnouncement.description.length > 100 ? '...' : ''}`
        : savedAnnouncement.title;
      
      const notificationLink = savedAnnouncement.link || '';
      
      const notification = new Notification({
        title: `New Announcement: ${savedAnnouncement.title}`,
        message: notificationMessage,
        type: 'announcement',
        link: notificationLink,
        relatedId: savedAnnouncement._id.toString(),
        isActive: true,
      });
      
      await notification.save();
      console.log("✅ In-app notification created:", notification._id);
    } catch (notifError: any) {
      console.error('❌ Error creating in-app notification:', notifError);
    }

    return NextResponse.json({
      ...savedAnnouncement.toObject(),
      id: savedAnnouncement._id.toString()
    }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error creating announcement:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create announcement" },
      { status: 500 }
    );
  }
}

