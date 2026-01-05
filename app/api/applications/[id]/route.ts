import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Application from '@/models/Application';

// GET application by tracking ID or mobile
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isDBConnected()) {
      await connectDB();
    }

    const { searchParams } = new URL(request.url);
    const trackingIdParam = params.id === 'search' ? null : params.id;
    const trackingId = trackingIdParam || searchParams.get('id');
    const mobile = searchParams.get('mobile');

    if (!trackingId && !mobile) {
      return NextResponse.json(
        { error: 'Tracking ID or mobile number is required' },
        { status: 400 }
      );
    }

    let application;
    if (trackingId && trackingId !== 'search') {
      application = await Application.findOne({ trackingId: trackingId.trim() });
    } else if (mobile) {
      // Get latest application for this mobile number
      application = await Application.findOne({ mobile: mobile.trim() })
        .sort({ submittedAt: -1 });
    }

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found. Please check your Tracking ID or Mobile Number.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application: {
        trackingId: application.trackingId,
        name: application.name,
        service_type: application.service_type,
        status: application.status,
        remarks: application.remarks,
        submittedAt: application.submittedAt,
        updatedAt: application.updatedAt,
        completedAt: application.completedAt,
      },
    });
  } catch (error: any) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

