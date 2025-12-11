import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDBConnected } from '@/lib/db';
import Payment from '@/models/Payment';

// Force dynamic rendering since we use request.url
export const dynamic = 'force-dynamic';

/**
 * GET /api/payments
 * Get all payments
 */
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (!mongoUri || mongoUri.trim() === '') {
        return NextResponse.json(
          { error: 'Database not configured' },
          { status: 503 }
        );
      }
      
      try {
        await connectDB();
      } catch (connError: any) {
        console.error('❌ Connection failed:', connError.message);
        return NextResponse.json(
          { error: 'Database connection error' },
          { status: 503 }
        );
      }

      if (!isDBConnected()) {
        return NextResponse.json(
          { error: 'Database not available' },
          { status: 503 }
        );
      }
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const status = searchParams.get('status');

    // Build query
    const query: any = {};
    if (status && ['pending', 'success', 'failed'].includes(status)) {
      query.status = status;
    }

    // Fetch payments
    const payments = await Payment.find(query)
      .sort({ paymentDate: -1 }) // Latest first
      .limit(limit)
      .lean();

    // Calculate total amount
    const totalAmount = payments
      .filter((p: any) => p.status === 'success')
      .reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

    return NextResponse.json({
      payments: payments || [],
      total: payments.length,
      totalAmount: totalAmount,
    });
  } catch (error: any) {
    console.error('❌ Error fetching payments:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch payments',
        message: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}


