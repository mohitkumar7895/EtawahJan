import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Visitor from '@/models/Visitor';
// Email sending disabled - no emails sent for visitors
// import { sendEmail, getRecipients } from '@/lib/emailService';

// Email notifications DISABLED - no emails will be sent
// Function disabled completely - returns immediately without sending any emails
async function sendVisitorNotificationEmail(visitor: any) {
  // Email sending completely disabled - function returns immediately
  console.log('📧 Email notifications disabled - no email sent for visitor');
  return;
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

