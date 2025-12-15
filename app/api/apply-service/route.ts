import { NextRequest, NextResponse } from 'next/server';
import { serviceApplicationTemplate, userConfirmationTemplate } from '@/lib/emailTemplates';
import { sendEmail, getRecipients, isEmailConfigured } from '@/lib/emailService';
import { connectDB, isDBConnected } from '@/lib/db';
import Subscriber from '@/models/Subscriber';

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
    // Check if any email service is configured
    if (!isEmailConfigured()) {
      console.error('❌ No email service configured');
      return NextResponse.json(
        { 
          error: "Email service not configured",
          message: "No email service available. Please configure one of the following:",
          options: [
            "Option 1: Set RESEND_API_KEY in .env.local (Get from https://resend.com/api-keys)",
            "Option 2: Set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local (Use Gmail App Password)"
          ],
          hint: "See env.example for configuration details"
        },
        { status: 500 }
      );
    }

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
    const results = [];
    for (const to of RECIPIENTS) {
      const result = await sendEmail({ to, subject, html });
      results.push({ to, ...result });
      await new Promise((r) => setTimeout(r, 1000)); // wait 1s between sends
    }

    // Save user as subscriber for future notifications
    try {
      if (!isDBConnected()) {
        await connectDB();
      }
      
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
    } catch (subscriberError: any) {
      console.error('❌ Error saving subscriber:', subscriberError);
      // Don't fail the request if subscriber save fails
    }

    // Send confirmation email to user if email is provided
    let userEmailSent = false;
    if (email && email.trim()) {
      try {
        const userSubject = `✅ आवेदन प्राप्त - ${cleanService} | Application Received - ${cleanService}`;
        const userHtml = userConfirmationTemplate({
          name,
          phone,
          service,
          email,
        });
        const userResult = await sendEmail({ to: email.trim(), subject: userSubject, html: userHtml });
        userEmailSent = userResult.success;
        if (userEmailSent) {
          console.log(`✅ Confirmation email sent to user: ${email}`);
        } else {
          console.warn(`⚠️ Failed to send confirmation email to user: ${email}`);
        }
      } catch (userEmailError: any) {
        console.error('❌ Error sending user confirmation email:', userEmailError);
        // Don't fail the request if user email fails
      }
    }

    const successCount = results.filter((r) => r.success).length;

    console.log(`\n📊 Email sending results: ${successCount}/${RECIPIENTS.length} successful`);
    results.forEach((r, i) => {
      if (r.success) {
        console.log(`  ✅ ${i + 1}. ${r.to} - Success (${r.method}, ID: ${r.id})`);
      } else {
        console.log(`  ❌ ${i + 1}. ${r.to} - Failed: ${r.error}`);
      }
    });

    // Always show detailed results in response
    const responseData = {
      success: successCount > 0,
      message: successCount > 0 
        ? "✅ Application submitted and emails sent successfully" 
        : "⚠️ Application submitted but emails failed",
      emailStatus: `${successCount}/${RECIPIENTS.length} admin emails sent${userEmailSent ? ' + user confirmation sent' : ''}`,
      userNotificationSent: userEmailSent,
      results: results.map(r => ({
        to: r.to,
        success: r.success,
        method: r.method,
        messageId: r.id,
        error: r.error,
        errorDetails: r.details
      })),
    };

    if (successCount > 0) {
      return NextResponse.json(responseData, { status: 200 });
    } else {
      // Return 200 but with warning
      return NextResponse.json({
        ...responseData,
        warning: "⚠️ All emails failed. Check server logs for details.",
        hint: "Common issues: Invalid API key, unverified domain, or rate limiting"
      }, { status: 200 });
    }
  } catch (err: any) {
    console.error("💥 SERVER ERROR (apply-service):", err);
    console.error("💥 Error stack:", err?.stack);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: err.message,
        stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined
      },
      { status: 500 }
    );
  }
}

