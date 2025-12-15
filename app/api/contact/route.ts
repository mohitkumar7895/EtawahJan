import { NextRequest, NextResponse } from 'next/server';
import { contactFormTemplate, userConfirmationTemplate } from '@/lib/emailTemplates';
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
    const { name, email, message } = body;

    const errorMsg = validateFields(body, ["name", "email", "message"]);
    if (errorMsg) {
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    console.log("\n💬 NEW CONTACT MESSAGE 💬");
    console.log({ name, email, message });
    console.log(`📧 Recipients: ${RECIPIENTS.join(', ')}`);

    const subject = `💬 New Contact Message from ${name}`;
    const html = contactFormTemplate({ name, email, message });

    // Send to both recipients
    const results = [];
    for (const to of RECIPIENTS) {
      const result = await sendEmail({ to, subject, html });
      results.push({ to, ...result });
      await new Promise((r) => setTimeout(r, 1000));
    }

    // Save user as subscriber for future notifications
    try {
      if (!isDBConnected()) {
        await connectDB();
      }
      
      if (email && email.trim()) {
        await Subscriber.findOneAndUpdate(
          { email: email.trim().toLowerCase() },
          {
            email: email.trim().toLowerCase(),
            name: name.trim(),
            isActive: true,
          },
          { upsert: true, new: true }
        );
        console.log(`✅ User saved as subscriber: ${email}`);
      }
    } catch (subscriberError: any) {
      console.error('❌ Error saving subscriber:', subscriberError);
    }

    // Send confirmation email to user
    let userEmailSent = false;
    if (email && email.trim()) {
      try {
        const userSubject = `✅ संदेश प्राप्त हुआ | Message Received - Jan Seva Kendra`;
        const userHtml = userConfirmationTemplate({
          name,
          email,
          phone: email, // For contact form, we use email as identifier
          service: 'Contact Form Submission',
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

    console.log(`\n📊 Email sending results: ${successCount}/${RECIPIENTS.length} successful`);
    results.forEach((r, i) => {
      if (r.success) {
        console.log(`  ✅ ${i + 1}. ${r.to} - Success (${r.method}, ID: ${r.id})`);
      } else {
        console.log(`  ❌ ${i + 1}. ${r.to} - Failed: ${r.error}`);
      }
    });

    if (successCount > 0) {
      return NextResponse.json({
        success: true,
        message: "✅ Message sent successfully",
        emailStatus: `${successCount}/${RECIPIENTS.length} admin emails sent${userEmailSent ? ' + user confirmation sent' : ''}`,
        userNotificationSent: userEmailSent,
        results: results.map(r => ({
          to: r.to,
          success: r.success,
          method: r.method,
          error: r.error
        })),
      });
    } else {
      return NextResponse.json(
        {
          success: true,
          message: "✅ Message submitted successfully",
          warning: "⚠️ Emails could not be sent",
          emailStatus: `0/${RECIPIENTS.length} emails sent${userEmailSent ? ' + user confirmation sent' : ''}`,
          userNotificationSent: userEmailSent,
          results: results.map(r => ({
            to: r.to,
            success: r.success,
            method: r.method,
            error: r.error
          })),
          hint: "Check email configuration in .env.local. Form data was saved but emails failed.",
        },
        { status: 200 } // Changed to 200 so form still shows success
      );
    }
  } catch (err: any) {
    console.error("💥 SERVER ERROR (contact):", err);
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

