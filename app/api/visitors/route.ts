import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Visitor from '@/models/Visitor';
// Email sending disabled - no emails sent for visitors
// import { sendEmail, getRecipients } from '@/lib/emailService';

// Function to send email notification when new visitor arrives
// IMPORTANT: This function ONLY sends emails to ADMIN, NEVER to visitors
// Visitor emails are collected and sent to admin, but NO emails are sent TO visitors
async function sendVisitorNotificationEmail(visitor: any) {
  try {
    // Get admin recipients - these are the only people who receive emails
    // NEVER send emails to visitor.email - visitors should NOT receive any emails
    const recipients = getRecipients();
    if (recipients.length === 0) {
      console.log('No email recipients configured');
      return;
    }

    const deviceIcon = visitor.device === 'Mobile' ? '📱' : visitor.device === 'Tablet' ? '📱' : '💻';
    const time = new Date().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const emailSubject = visitor.email 
      ? `📧 नया Visitor - Email मिला: ${visitor.email} | New Visitor with Email`
      : `🌐 नया Visitor - ${visitor.device || 'Desktop'} पर Website खोली गई`;

    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
          .info-box { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
          .label { font-weight: bold; color: #667eea; }
          .value { color: #333; margin-left: 10px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>${visitor.email ? '📧 Visitor ने Email दिया है!' : '🌐 नया Visitor आया है!'}</h2>
            <p style="margin: 0;">${visitor.email ? `Visitor का Email: ${visitor.email}` : 'कोई ने आपकी website खोली है'}</p>
          </div>
          <div class="content">
            <div class="info-box">
              <div><span class="label">${deviceIcon} Device:</span><span class="value">${visitor.device || 'Desktop'}</span></div>
            </div>
            <div class="info-box">
              <div><span class="label">🌐 Browser:</span><span class="value">${visitor.browser || 'Unknown'}</span></div>
              <div><span class="label">💻 OS:</span><span class="value">${visitor.os || 'Unknown'}</span></div>
            </div>
            <div class="info-box">
              <div><span class="label">📄 Page:</span><span class="value">${visitor.page || '/'}</span></div>
              ${visitor.referrer ? `<div><span class="label">🔗 Referrer:</span><span class="value">${visitor.referrer}</span></div>` : ''}
            </div>
            ${visitor.city || visitor.country ? `
            <div class="info-box">
              <div><span class="label">📍 Location:</span><span class="value">${visitor.city ? visitor.city + ', ' : ''}${visitor.country || 'Unknown'}</span></div>
            </div>
            ` : ''}
            ${visitor.name || visitor.email ? `
            <div class="info-box" style="background: ${visitor.email ? '#fff3cd' : 'white'}; border-left-color: ${visitor.email ? '#ffc107' : '#667eea'}; border-left-width: ${visitor.email ? '6px' : '4px'}; ${visitor.email ? 'box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3);' : ''}">
              <div><span class="label">👤 Name:</span><span class="value">${visitor.name || 'Not provided'}</span></div>
              ${visitor.email ? `<div style="margin-top: 10px; padding: 10px; background: #fff; border-radius: 5px; border: 2px solid #ffc107;"><span class="label" style="font-size: 16px;">📧 Visitor Email:</span><span class="value" style="color: #d32f2f; font-weight: bold; font-size: 18px; display: block; margin-top: 5px;">${visitor.email}</span></div>` : ''}
            </div>
            ` : ''}
            <div class="info-box">
              <div><span class="label">🕐 Time:</span><span class="value">${time}</span></div>
              <div><span class="label">🆔 Session ID:</span><span class="value" style="font-family: monospace; font-size: 11px;">${visitor.sessionId}</span></div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.jan-seva.site'}/admin" 
                 style="display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                👁️ Admin Panel में देखें
              </a>
            </div>
          </div>
          <div class="footer">
            <p>Jan Seva Kendra - Visitor Tracking System</p>
            <p>यह email automatically भेजा गया है जब कोई आपकी website खोलता है</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to admin recipients ONLY (never to visitors)
    // recipients = admin emails from getRecipients()
    // visitor.email is NEVER used as a recipient - it's only included in the email content
    const emailPromises = recipients.map(recipient => 
      sendEmail({
        to: recipient, // This is admin email, NOT visitor email
        subject: emailSubject,
        html: emailHTML,
      })
    );

    const results = await Promise.allSettled(emailPromises);
    
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    console.log(`✅ Visitor notification email sent to ${successCount}/${recipients.length} recipients`);
    
  } catch (error) {
    console.error('Error sending visitor notification email:', error);
    // Don't throw - we don't want email failures to break visitor tracking
  }
}

// Track visitor
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { sessionId, page, referrer, userAgent, device, browser, os, country, city, name, email } = body;
    
    // Get IP address from request
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // Check if visitor exists
    const existingVisitor = await Visitor.findOne({ sessionId });
    
    if (existingVisitor) {
      // Check if email is being added for the first time
      const hadEmailBefore = !!existingVisitor.email;
      const isAddingEmail = email && !hadEmailBefore;
      
      // Update existing visitor
      existingVisitor.lastActivity = new Date();
      existingVisitor.page = page;
      existingVisitor.referrer = referrer || existingVisitor.referrer;
      existingVisitor.isActive = true;
      existingVisitor.visitCount = (existingVisitor.visitCount || 0) + 1;
      // Update name and email if provided
      if (name) existingVisitor.name = name;
      if (email) existingVisitor.email = email;
      await existingVisitor.save();
      
      // Email notifications disabled - no emails sent
      // if (isAddingEmail) {
      //   sendVisitorNotificationEmail(existingVisitor).catch((err: any) => {
      //     console.error('Failed to send visitor email notification:', err);
      //   });
      // }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Visitor updated',
        visitor: existingVisitor 
      });
    } else {
      // Create new visitor
      const visitor = new Visitor({
        sessionId,
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
        userAgent: userAgent || request.headers.get('user-agent') || 'unknown',
        page,
        referrer: referrer || '',
        country: country || '',
        city: city || '',
        device: device || '',
        browser: browser || '',
        os: os || '',
        name: name || '',
        email: email || '',
        isActive: true,
        lastActivity: new Date(),
        firstVisit: new Date(),
        visitCount: 1,
      });
      
      await visitor.save();
      
      // Email notifications disabled - no emails sent
      // sendVisitorNotificationEmail(visitor).catch((err: any) => {
      //   console.error('Failed to send visitor notification email:', err);
      // });
      
      return NextResponse.json({ 
        success: true, 
        message: 'Visitor tracked',
        visitor 
      });
    }
  } catch (error: any) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to track visitor' },
      { status: 500 }
    );
  }
}

// Get all active visitors
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Mark visitors as inactive if they haven't been active in last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    await Visitor.updateMany(
      { lastActivity: { $lt: fiveMinutesAgo } },
      { isActive: false }
    );
    
    // Get active visitors
    const activeVisitors = await Visitor.find({ isActive: true })
      .sort({ lastActivity: -1 })
      .limit(100);
    
    // Get all visitors (for stats)
    const allVisitors = await Visitor.find()
      .sort({ lastActivity: -1 })
      .limit(500);
    
    // Get stats
    const totalVisitors = await Visitor.countDocuments();
    const activeCount = activeVisitors.length;
    const todayVisitors = await Visitor.countDocuments({
      firstVisit: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });
    
    return NextResponse.json({
      success: true,
      activeVisitors,
      allVisitors: allVisitors.slice(0, 100), // Limit to 100 for performance
      stats: {
        total: totalVisitors,
        active: activeCount,
        today: todayVisitors,
      }
    });
  } catch (error: any) {
    console.error('Error fetching visitors:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch visitors' },
      { status: 500 }
    );
  }
}

