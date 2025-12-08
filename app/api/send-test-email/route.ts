import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/emailService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const toEmail = searchParams.get('to') || 'mohitporwal596@gmail.com';
    
    const testSubject = "🧪 Test Email - Jan Seva Kendra";
    const testHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(to right, #1e40af, #3b82f6);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background-color: #ffffff;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .success {
            color: #10b981;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✅ Email Test Successful!</h1>
        </div>
        <div class="content">
          <div class="success">🎉 Email Service is Working! 🎉</div>
          <p>Namaste! This is a test email from <strong>Jan Seva Kendra</strong>.</p>
          <p>If you received this email, it means:</p>
          <ul>
            <li>✅ Resend API is configured correctly</li>
            <li>✅ Email service is working</li>
            <li>✅ Form submissions will send emails successfully</li>
          </ul>
          <hr style="margin: 20px 0; border: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            <strong>Test Time:</strong> ${new Date().toLocaleString('en-IN', { 
              timeZone: 'Asia/Kolkata',
              dateStyle: 'full',
              timeStyle: 'long'
            })}
          </p>
          <p style="color: #6b7280; font-size: 12px;">
            <strong>Recipient:</strong> ${toEmail}
          </p>
        </div>
      </body>
      </html>
    `;

    console.log(`\n🧪 TEST EMAIL REQUEST 🧪`);
    console.log(`📧 Sending test email to: ${toEmail}`);
    
    const result = await sendEmail({ 
      to: toEmail, 
      subject: testSubject, 
      html: testHtml 
    });

    console.log(`\n📊 TEST RESULT:`, result);
    console.log(`🧪 ==========================================\n`);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `✅ Test email sent successfully to ${toEmail}`,
        method: result.method,
        messageId: result.id,
        details: "Check your inbox (and spam folder) for the test email"
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `❌ Failed to send test email to ${toEmail}`,
        error: result.error,
        details: result.details,
        hint: "Check server logs for more details"
      }, { status: 500 });
    }
  } catch (err: any) {
    console.error("💥 TEST EMAIL ERROR:", err);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
      details: err.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Same as GET
  return GET(request);
}






