import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Application from '@/models/Application';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!isDBConnected()) {
      await connectDB();
    }

    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get('filter') || 'all'; // 'weekly', 'monthly', 'yearly', 'all'
    const status = searchParams.get('status');

    let query: any = {};

    // Apply time-based filtering
    if (filter !== 'all') {
      const now = new Date();
      let startDate = new Date();

      if (filter === 'weekly') {
        startDate.setDate(now.getDate() - 7);
      } else if (filter === 'monthly') {
        startDate.setDate(now.getDate() - 30);
      } else if (filter === 'yearly') {
        startDate.setDate(now.getDate() - 365);
      }
      query.submittedAt = { $gte: startDate };
    }

    // Apply status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Fetch applications sorted by submission date descending
    const list = await Application.find(query).sort({ submittedAt: -1 }).lean();

    // Map _id to id for easier client utilization
    const applications = list.map((item: any) => ({
      id: item._id.toString(),
      name: item.name,
      email: item.email || '',
      mobile: item.mobile,
      address: item.address,
      service_type: item.service_type,
      status: item.status,
      trackingId: item.trackingId,
      remarks: item.remarks || '',
      adminNotes: item.adminNotes || '',
      submittedAt: item.submittedAt,
      updatedAt: item.updatedAt,
      completedAt: item.completedAt || null,
    }));

    return NextResponse.json(applications, { status: 200 });
  } catch (err: any) {
    console.error('💥 Error fetching admin applications:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isDBConnected()) {
      await connectDB();
    }

    const body = await request.json();
    const { id, status, remarks, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing required field: id' }, { status: 400 });
    }

    const updateFields: any = { updatedAt: new Date() };
    if (status) {
      updateFields.status = status;
      if (status === 'completed') {
        updateFields.completedAt = new Date();
      }
    }
    if (remarks !== undefined) updateFields.remarks = remarks;
    if (adminNotes !== undefined) updateFields.adminNotes = adminNotes;

    const application = await Application.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Application updated successfully',
      application: {
        id: application._id.toString(),
        status: application.status,
        remarks: application.remarks,
        adminNotes: application.adminNotes,
      }
    }, { status: 200 });
  } catch (err: any) {
    console.error('💥 Error updating admin application:', err);
    return NextResponse.json(
      { error: 'Internal server error', details: err.message },
      { status: 500 }
    );
  }
}
