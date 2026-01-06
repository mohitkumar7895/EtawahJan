import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/emailService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const toEmail = searchParams.get('to') || 'mohitporwal596@gmail.com';
    
    const testSubject = "🚨 TEST EMAIL - Jan Seva Kendra - Check Karo!";
    const testHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            margin: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          }
          .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
          }
          .content {
            padding: 40px;
            text-align: center;
          }
          .success-icon {
            font-size: 80px;
            margin: 20px 0;
          }
          .message {
            font-size: 24px;
            color: #333;
            margin: 20px 0;
            font-weight: bold;
          }
          .details {
            background: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #3b82f6;
          }
          .details p {
            margin: 10px 0;
            font-size: 16px;
            color: #1e40af;
          }
          .footer {
            background: #1e40af;
            color: white;
            padding: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ EMAIL AA GAYA!</h1>
            <h2 style="margin: 10px 0 0 0; font-size: 20px;">Email Successfully Received!</h2>
          </div>
          <div class="content">
            <div class="success-icon">🎉📧✅</div>
            <div class="message">
              Namaste! Aapka email successfully bhej diya gaya hai!
            </div>
            <div class="details">
              <p><strong>📧 To:</strong> ${toEmail}</p>
              <p><strong>⏰ Time:</strong> ${new Date().toLocaleString('en-IN', { 
                timeZone: 'Asia/Kolkata',
                dateStyle: 'full',
                timeStyle: 'long'
              })}</p>
              <p><strong>✅ Status:</strong> Email Sent Successfully!</p>
            </div>
            <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px;">
              <h3 style="color: #92400e; margin-top: 0;">⚠️ Important:</h3>
              <p style="color: #78350f; font-size: 16px; margin: 10px 0;">
                Agar email inbox mein nahi dikh raha, to <strong>SPAM FOLDER</strong> check karo!
              </p>
              <p style="color: #78350f; font-size: 16px; margin: 10px 0;">
                Gmail mein: Left side menu → "Spam" folder check karo
              </p>
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0; font-size: 18px; font-weight: bold;">Jan Seva Kendra - Etawah</p>
            <p style="margin: 10px 0 0 0;">📞 9193898182</p>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log(`\n🚨 IMMEDIATE TEST EMAIL 🚨`);
    console.log(`📧 Sending highly visible test email to: ${toEmail}`);
    
    const result = await sendEmail({ 
      to: toEmail, 
      subject: testSubject, 
      html: testHtml 
    });

    console.log(`\n📊 RESULT:`, result);
    console.log(`🚨 ==========================================\n`);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `✅ Email bhej diya gaya hai ${toEmail} ko!`,
        method: result.method,
        messageId: result.id,
        instructions: [
          "1. Apna Gmail inbox check karo",
          "2. Agar nahi dikha, to SPAM folder check karo (left side menu)",
          "3. Email subject: '🚨 TEST EMAIL - Jan Seva Kendra - Check Karo!'",
          "4. Agar phir bhi nahi dikha, to 2-3 minutes wait karo (delivery delay ho sakta hai)"
        ],
        checkSpam: true
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `❌ Email bhejne mein problem aayi`,
        error: result.error,
        details: result.details
      }, { status: 500 });
    }
  } catch (err: any) {
    console.error("💥 ERROR:", err);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
      details: err.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}













