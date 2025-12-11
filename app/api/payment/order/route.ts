import { NextRequest, NextResponse } from 'next/server';

// Import Razorpay
const Razorpay = require('razorpay');

/**
 * POST /api/payment/order
 * Create a Razorpay order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt } = body;

    // Validate amount
    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum amount is ₹1' },
        { status: 400 }
      );
    }

    // Check if Razorpay keys are configured
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!keyId || !keySecret) {
      console.error('❌ Razorpay keys not configured');
      return NextResponse.json(
        { 
          success: false,
          error: 'Payment gateway not configured. Please contact support.',
          message: 'RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables are required.'
        },
        { status: 500 }
      );
    }

    // Log payment mode (for debugging - remove in production)
    const isLiveMode = keyId.startsWith('rzp_live_');
    console.log(`💰 Payment Mode: ${isLiveMode ? 'LIVE (Real Payments)' : 'TEST (Test Mode)'}`);

    // Initialize Razorpay
    const razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Convert amount to paise (Razorpay uses smallest currency unit)
    const amountInPaise = Math.round(amount * 100);

    // Create order options
    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    // Create order
    const order = await razorpayInstance.orders.create(options);

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error creating payment order:', error);
    return NextResponse.json(
      {
        error: 'Failed to create payment order',
        message: error.message || 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

