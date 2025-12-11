# 🚀 Quick Start: Payment Setup

## Error: "Payment gateway not configured"

This error means Razorpay keys are missing. Follow these steps:

## Step-by-Step Setup

### 1. Open `.env.local` file
   - Location: Root folder (same as `package.json`)
   - If file doesn't exist, create it

### 2. Add these lines to `.env.local`:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
```

### 3. Get Razor: Get Razorpay Keys

**Option A: If you already have Razorpay account**
1. Go to: https://dashboard.razorpay.com
2. Login
3. Settings → API Keys
4. Click "Generate Test Keys"
5. Copy Key ID and Key Secret

**Option B: Create new Razorpay account**
1. Sign up: https://razorpay.com
2. Complete verification
3. Go to Dashboard → Settings → API Keys
4. Generate Test Keys
5. Copy both keys

### Step 4: Update `.env.local`

Replace the placeholder values:
```env
RAZORPAY_KEY_ID=rzp_test_1234567890abcdef  ← Your actual Key ID
RAZORPAY_KEY_SECRET=abcd1234efgh5678ijkl  ← Your actual Key Secret
```

### Step 5: Restart Server

**IMPORTANT:** After adding keys, restart:
1. Stop server (Ctrl+C in terminal)
2. Run: `npm run dev`
3. Refresh browser

### Step 6: Test Payment

1. Go to: http://localhost:3000/payment
2. Enter amount: 100
3. Click "Pay Now"
4. Use test card:
   - Card: 4111 1111 1111 1111
   - CVV: Any 3 digits (123)
   - Expiry: Any future date (12/25)

## ✅ Success!

If payment popup opens, setup is complete!

## ❌ Still Getting Error?

1. Check `.env.local` file name (exactly `.env.local`, not `.env.local.txt`)
2. Check no spaces around `=` sign
3. Check keys don't have quotes
4. Restart dev server
5. Check terminal for errors

## Need Help?

Contact: 9193898182

