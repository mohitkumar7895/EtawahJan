import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB, isDBConnected } from '@/lib/db';
import Payment from '@/models/Payment';

/**
 * POST /api/payment/verify
 * Verify Razorpay payment signature
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, receipt, customerName, customerEmail, customerPhone } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification data' },
        { status: 400 }
      );
    }

    // Check if Razorpay secret is configured
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    // Create signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    // Verify signature
    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment verification failed. Invalid signature.',
        },
        { status: 400 }
      );
    }

    // Connect to database
    if (!isDBConnected()) {
      const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGODB_URL;
      if (!mongoUri || mongoUri.trim() === '') {
        // Payment verified but can't save to DB - still return success
        return NextResponse.json(
          {
            success: true,
            message: 'Payment verified successfully',
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            warning: 'Database not configured - payment not saved',
          },
          { status: 200 }
        );
      }
      
      try {
        await connectDB();
      } catch (connError: any) {
        console.error("❌ Database connection failed:", connError.message);
        // Payment verified but can't save - still return success
        return NextResponse.json(
          {
            success: true,
            message: 'Payment verified successfully',
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            warning: 'Database connection failed - payment not saved',
          },
          { status: 200 }
        );
      }
    }

    // Save payment to database
    try {
      const paymentAmount = amount ? amount / 100 : 0; // Convert from paise to rupees
      
      const payment = new Payment({
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        amount: paymentAmount,
        currency: 'INR',
        status: 'success',
        customerName: customerName || '',
        customerEmail: customerEmail || '',
        customerPhone: customerPhone || '',
        receipt: receipt || '',
        paymentDate: new Date(),
      });

      await payment.save();
      console.log('✅ Payment saved to database:', razorpay_payment_id);
    } catch (saveError: any) {
      console.error('❌ Error saving payment to database:', saveError);
      // Don't fail the payment verification if save fails
    }

    // Payment verified successfully
    return NextResponse.json(
      {
        success: true,
        message: 'Payment verified successfully',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('❌ Error verifying payment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify payment',
        message: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

