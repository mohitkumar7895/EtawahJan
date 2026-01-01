import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Subscriber from '@/models/Subscriber';
import { sendEmail, isEmailConfigured } from '@/lib/emailService';
import { websiteUpdateTemplate } from '@/lib/emailTemplates';

/**
 * POST /api/notifications/send
 * Send notifications to all subscribers (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    if (!isDBConnected()) {
      await connectDB();
    }

    if (!isEmailConfigured()) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { title, message, description } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!message && !description) {
      return NextResponse.json({ error: 'Message or description is required' }, { status: 400 });
    }

    const notificationMessage = message || description || '';

    // Get all active subscribers with email
    const subscribers = await Subscriber.find({
      isActive: true,
      email: { $exists: true, $ne: '' },
    }).limit(200); // Limit to prevent too many emails

    console.log(`📧 Sending notifications to ${subscribers.length} subscribers...`);

    let successCount = 0;
    let failCount = 0;

    for (const subscriber of subscribers) {
      if (subscriber.email && subscriber.email.trim()) {
        try {
          const subject = `🔔 ${title} | Jan Seva Kendra Update`;
          const html = websiteUpdateTemplate({
            title,
            message: notificationMessage,
            description: notificationMessage,
          });

          const result = await sendEmail({
            to: subscriber.email.trim(),
            subject,
            html,
          });

          if (result.success) {
            successCount++;
            // Update subscriber's last notified time
            await Subscriber.findByIdAndUpdate(subscriber._id, {
              lastNotifiedAt: new Date(),
              $inc: { notificationCount: 1 },
            });
          } else {
            failCount++;
          }

          // Small delay to avoid rate limiting
          await new Promise((r) => setTimeout(r, 500));
        } catch (emailError: any) {
          console.error(`❌ Failed to send to ${subscriber.email}:`, emailError);
          failCount++;
        }
      }
    }

    console.log(`✅ Notifications sent: ${successCount} successful, ${failCount} failed`);

    return NextResponse.json({
      success: true,
      message: `Notifications sent to ${successCount} subscribers`,
      sent: successCount,
      failed: failCount,
      total: subscribers.length,
    });
  } catch (error: any) {
    console.error('❌ Error sending notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications', message: error.message },
      { status: 500 }
    );
  }
}


