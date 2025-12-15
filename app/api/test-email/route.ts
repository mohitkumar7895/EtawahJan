import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, getRecipients, isEmailConfigured } from '@/lib/emailService';

export async function GET(request: NextRequest) {
  try {
    // Check if email is configured
    if (!isEmailConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "Email service not configured",
          message: "Please configure email service in .env.local",
          options: [
            "Option 1: Set RESEND_API_KEY (Get from https://resend.com/api-keys)",
            "Option 2: Set GMAIL_USER and GMAIL_APP_PASSWORD (Use Gmail App Password)"
          ],
        },
        { status: 500 }
      );
    }

    const recipients = getRecipients();
    const testSubject = "🧪 Test Email from Jan Seva Kendra";
    const testHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e40af;">Email Test Successful! ✅</h2>
        <p>This is a test email from Jan Seva Kendra.</p>
        <p>If you received this email, your email configuration is working correctly.</p>
        <hr style="margin: 20px 0; border: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          Sent at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        </p>
      </div>
    `;

    const results = [];
    for (const to of recipients) {
      const result = await sendEmail({ to, subject: testSubject, html: testHtml });
      results.push({ to, ...result });
      await new Promise((r) => setTimeout(r, 1000));
    }

    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      success: successCount > 0,
      message: successCount > 0 
        ? `✅ Test email sent successfully to ${successCount}/${recipients.length} recipients`
        : `❌ Failed to send test emails`,
      recipients,
      results: results.map(r => ({
        to: r.to,
        success: r.success,
        method: r.method,
        error: r.error
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: err.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Same as GET for testing
  return GET(request);
}










