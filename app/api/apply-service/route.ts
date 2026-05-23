import { NextRequest, NextResponse } from 'next/server';
import { serviceApplicationTemplate, userConfirmationTemplate } from '@/lib/emailTemplates';
import { sendEmail, getRecipients, isEmailConfigured } from '@/lib/emailService';
import { connectDB, isDBConnected } from '@/lib/db';
import Subscriber from '@/models/Subscriber';
import Application from '@/models/Application';

const RECIPIENTS = getRecipients();

function validateFields(obj: any, requiredFields: string[]) {
  for (const field of requiredFields) {
    if (!obj[field]) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      mobile: phone,
      service_type: service,
      address,
    } = body;

    const errorMsg = validateFields(body, [
      "name",
      "mobile",
      "service_type",
      "address",
    ]);
    if (errorMsg) {
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    console.log("\n🔥 NEW SERVICE APPLICATION 🔥");
    console.log({ name, email, phone, service, address });

    // Save application to database and user as subscriber FIRST (non-blocking)
    let trackingId = '';
    try {
      if (!isDBConnected()) {
        await connectDB();
      }
      
      // Generate tracking ID: JSK + timestamp + random 4 digits
      const timestamp = Date.now().toString().slice(-8);
      const random = Math.floor(1000 + Math.random() * 9000);
      const generatedTrackingId = `JSK${timestamp}${random}`;

      // Save application to database
      const application = new Application({
        name: name.trim(),
        email: email ? email.trim().toLowerCase() : '',
        mobile: phone.trim(),
        address: address.trim(),
        service_type: service.trim(),
        status: 'pending',
        trackingId: generatedTrackingId,
      });
      await application.save();
      trackingId = application.trackingId;
      console.log(`✅ Application saved with tracking ID: ${trackingId}`);
      
      // Save user as subscriber for future notifications
      if (email && email.trim()) {
        // Save or update subscriber with email
        await Subscriber.findOneAndUpdate(
          { email: email.trim().toLowerCase() },
          {
            email: email.trim().toLowerCase(),
            mobile: phone.trim(),
            name: name.trim(),
            isActive: true,
            $inc: { notificationCount: 0 }, // Don't increment on subscription
          },
          { upsert: true, new: true }
        );
        console.log(`✅ User saved as subscriber: ${email}`);
      } else if (phone && phone.trim()) {
        // Save subscriber with mobile only
        await Subscriber.findOneAndUpdate(
          { mobile: phone.trim() },
          {
            mobile: phone.trim(),
            name: name.trim(),
            isActive: true,
          },
          { upsert: true, new: true }
        );
        console.log(`✅ User saved as subscriber: ${phone}`);
      }
    } catch (dbError: any) {
      console.error('❌ Error saving application/subscriber:', dbError);
      return NextResponse.json(
        { error: "Database save failed", details: dbError.message },
        { status: 500 }
      );
    }

    // Now handle emails if configured (non-blocking to submission status)
    let emailSentSuccessfully = false;
    const results = [];
    let userEmailSent = false;

    if (isEmailConfigured()) {
      console.log(`📧 Recipients: ${RECIPIENTS.join(', ')}`);
      // Remove emojis and spam trigger words from subject for better deliverability
      const cleanService = service.replace(/[🔔]/g, '').trim();
      const subject = `नया सेवा आवेदन - ${cleanService} | New Service Application - ${cleanService}`;
      const html = serviceApplicationTemplate({
        name,
        email,
        phone,
        service,
        address,
      });

      // Send emails sequentially to admin recipients
      for (const to of RECIPIENTS) {
        const result = await sendEmail({ to, subject, html });
        results.push({ to, ...result });
        await new Promise((r) => setTimeout(r, 1000)); // wait 1s between sends
      }

      // Send confirmation email to user if email is provided
      if (email && email.trim()) {
        try {
          const userSubject = `✅ आवेदन प्राप्त - ${cleanService} | Application Received - ${cleanService}`;
          const userHtml = userConfirmationTemplate({
            name,
            phone,
            service,
            email,
            trackingId: trackingId || 'N/A',
          });
          const userResult = await sendEmail({ to: email.trim(), subject: userSubject, html: userHtml });
          userEmailSent = userResult.success;
          if (userEmailSent) {
            console.log(`✅ Confirmation email sent to user: ${email}`);
          }
        } catch (userEmailError: any) {
          console.error('❌ Error sending user confirmation email:', userEmailError);
        }
      }
      const successCount = results.filter((r) => r.success).length;
      emailSentSuccessfully = successCount > 0;
    } else {
      console.warn('⚠️ No email service configured. Skipping email notifications, but data was saved safely in MongoDB.');
    }

    return NextResponse.json({
      success: true,
      message: emailSentSuccessfully 
        ? "✅ Application submitted and emails sent successfully" 
        : "✅ Application saved successfully (Email skipped/not configured)",
      trackingId: trackingId,
      emailStatus: isEmailConfigured() ? "Sent" : "Skipped"
    }, { status: 200 });

  } catch (err: any) {
    console.error("💥 SERVER ERROR (apply-service):", err);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: err.message,
      },
      { status: 500 }
    );
  }
}

