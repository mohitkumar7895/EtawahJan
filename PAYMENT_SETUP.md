# Payment System Setup Guide

This document explains how to set up the Razorpay payment integration for Jan Seva Kendra.

## Prerequisites

1. A Razorpay account (Sign up at https://razorpay.com)
2. Razorpay API keys (Key ID and Key Secret)

## Environment Variables

Add the following environment variables to your `.env.local` file (or your deployment platform's environment variables):

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
```

## Getting Razorpay Keys

1. Log in to your Razorpay Dashboard: https://dashboard.razorpay.com
2. Go to **Settings** → **API Keys**
3. Generate **Test Keys** for development or **Live Keys** for production
4. Copy the **Key ID** and **Key Secret**
5. Add them to your environment variables

## Testing

### Test Mode
- Use Razorpay Test Keys for development
- Test card numbers are available in Razorpay Dashboard → Settings → API Keys → Test Data

### Common Test Cards
- **Success**: 4111 1111 1111 1111
- **Failure**: Any card number starting with 4000
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## Payment Flow

1. User clicks "Make Payment" button on homepage
2. User is redirected to `/payment` page
3. User enters amount and clicks "Pay Now"
4. Razorpay checkout popup opens
5. User completes payment
6. Payment is verified on server
7. User is redirected to success/failure page

## API Routes

### POST `/api/payment/order`
Creates a Razorpay order
- **Request Body**: `{ amount: number, currency: string, receipt: string }`
- **Response**: `{ success: true, orderId: string, amount: number, currency: string, keyId: string }`

### POST `/api/payment/verify`
Verifies payment signature
- **Request Body**: `{ razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }`
- **Response**: `{ success: true, message: string, orderId: string, paymentId: string }`

## Pages

- `/payment` - Payment page with amount input
- `/payment/success` - Success page after payment
- `/payment/failed` - Failure page if payment fails

## Security Notes

1. **Never expose Key Secret** in frontend code
2. Always verify payment signature on server
3. Use HTTPS in production
4. Keep your Key Secret secure and never commit it to version control

## Deployment

### Vercel
1. Add environment variables in Vercel Dashboard → Settings → Environment Variables
2. Redeploy your application

### Other Platforms
1. Add environment variables in your platform's settings
2. Restart your application

## Support

For Razorpay support:
- Documentation: https://razorpay.com/docs/
- Support: support@razorpay.com

For application support:
- Contact: 7895094129, 9193898182









