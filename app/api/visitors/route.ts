import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Visitor from '@/models/Visitor';
import Subscriber from '@/models/Subscriber';
// Email sending completely removed - NO emails sent for visitors

// Track visitor
export async function POST(request: NextRequest) {
  let sessionId: string | undefined;
  let page: string | undefined;
  let name: string | undefined;
  let email: string | undefined;

  try {
    await connectDB();

    let body: Record<string, unknown> = {};
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      body = {};
    }

    sessionId =
      typeof body.sessionId === 'string' && body.sessionId.trim()
        ? body.sessionId.trim()
        : undefined;
    page = typeof body.page === 'string' && body.page.trim() ? body.page.trim() : '/';
    name = typeof body.name === 'string' ? body.name : undefined;
    email = typeof body.email === 'string' ? body.email : undefined;
    const referrer = typeof body.referrer === 'string' ? body.referrer : '';
    const userAgent = typeof body.userAgent === 'string' ? body.userAgent : '';
    const device = typeof body.device === 'string' ? body.device : '';
    const browser = typeof body.browser === 'string' ? body.browser : '';
    const os = typeof body.os === 'string' ? body.os : '';
    const country = typeof body.country === 'string' ? body.country : '';
    const city = typeof body.city === 'string' ? body.city : '';

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'sessionId is required' },
        { status: 400 },
      );
    }
    
    // Get IP address from request
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // Use findOneAndUpdate with upsert to handle both create and update
    const ip = Array.isArray(ipAddress) ? ipAddress[0] : ipAddress;
    const ua = userAgent || request.headers.get('user-agent') || 'unknown';
    
    // Do not put visitCount in $setOnInsert — MongoDB forbids $inc and $setOnInsert on the same path (conflict → 500).
    const visitor = await Visitor.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          ipAddress: ip,
          userAgent: ua,
          page,
          referrer: referrer || '',
          country: country || '',
          city: city || '',
          device: device || '',
          browser: browser || '',
          os: os || '',
          isActive: true,
          lastActivity: new Date(),
          ...(name && { name }),
          ...(email && { email }),
        },
        $inc: { visitCount: 1 },
        $setOnInsert: {
          firstVisit: new Date(),
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );
    
    // Add visitor to subscribers list if they have email
    if (email && email.trim()) {
      try {
        await Subscriber.findOneAndUpdate(
          { email: email.trim().toLowerCase() },
          {
            email: email.trim().toLowerCase(),
            name: name || visitor.name || '',
            isActive: true,
          },
          { upsert: true, new: true }
        );
        console.log(`✅ Visitor added to subscribers: ${email}`);
      } catch (subError: any) {
        console.error('❌ Error adding visitor to subscribers:', subError);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: visitor.visitCount === 1 ? 'Visitor tracked' : 'Visitor updated',
      visitor 
    });
  } catch (error: any) {
    // Ignore connection reset errors (common when client disconnects)
    if (error.code === 'ECONNRESET' || error.message?.includes('aborted') || error.message?.includes('ECONNRESET')) {
      // Client disconnected, silently ignore
      return NextResponse.json({ success: true, message: 'Connection closed' }, { status: 200 });
    }
    
    // Handle duplicate key errors (race condition - visitor already exists)
    if (error.code === 11000 || error.codeName === 'DuplicateKey') {
      // Try to fetch and return existing visitor
      try {
        const existingVisitor = await Visitor.findOne({ sessionId });
        if (existingVisitor && sessionId) {
          // Update it
          existingVisitor.lastActivity = new Date();
          if (page) existingVisitor.page = page;
          existingVisitor.isActive = true;
          existingVisitor.visitCount = (existingVisitor.visitCount || 0) + 1;
          if (name) existingVisitor.name = name;
          if (email) existingVisitor.email = email;
          await existingVisitor.save();
          
          return NextResponse.json({ 
            success: true, 
            message: 'Visitor updated',
            visitor: existingVisitor 
          });
        }
      } catch (retryError) {
        // If retry also fails, return success anyway to avoid breaking the page
        return NextResponse.json({ success: true, message: 'Visitor tracked (duplicate)' }, { status: 200 });
      }
    }
    
    // Log other errors but don't fail the request
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
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayVisitors = await Visitor.countDocuments({
      firstVisit: { $gte: todayStart }
    });
    
    return NextResponse.json({
      success: true,
      activeVisitors: activeVisitors.map((v: any) => ({
        ...v,
        _id: v._id?.toString(),
        id: v._id?.toString(),
        firstVisit: v.firstVisit || v.createdAt || new Date(),
        lastActivity: v.lastActivity || v.updatedAt || new Date(),
        visitCount: v.visitCount || 1,
        isActive: v.isActive !== undefined ? v.isActive : true,
      })),
      allVisitors: allVisitors.slice(0, 100).map((v: any) => ({
        ...v,
        _id: v._id?.toString(),
        id: v._id?.toString(),
        firstVisit: v.firstVisit || v.createdAt || new Date(),
        lastActivity: v.lastActivity || v.updatedAt || new Date(),
        visitCount: v.visitCount || 1,
        isActive: v.isActive !== undefined ? v.isActive : false,
      })),
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

