# Environment Variables Setup

## Quick Setup Guide

### Step 1: Create `.env.local` file

Create a file named `.env.local` in the root directory of your project (same folder as `package.json`).

### Step 2: Add Razorpay Keys

Copy this template and add your actual keys:

```env
# Razorpay Payment Configuration
# Get these from https://dashboard.razorpay.com → Settings → API Keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_key_secret_here

# Existing MongoDB Configuration (if you have it)
MONGODB_URI=your_mongodb_uri_here

# Existing Email Configuration (if you have it)
RESEND_API_KEY=your_resend_api_key_here
```

### Step 3: Get Razorpay Test Keys

1. **Sign up/Login** to Razorpay: https://razorpay.com
2. Go to **Dashboard**: https://dashboard.razorpay.com
3. Navigate to **Settings** → **API Keys**
4. Click **Generate Test Keys** (for development)
5. Copy the **Key ID** (starts with `rzp_test_`)
6. Copy the **Key Secret** (long random string)
7. Paste them in your `.env.local` file

### Step 4: Restart Dev Server

After adding the keys, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Test Payment

1. Go to http://localhost:3000/payment
2. Enter any amount (e.g., 100)
3. Click "Pay Now"
4. Use test card: **4111 1111 1111 1111**
5. Use any CVV (e.g., 123) and future expiry date

## Important Notes

- ✅ `.env.local` file is already in `.gitignore` (won't be committed to git)
- ✅ Never share your Key Secret publicly
- ✅ Use Test Keys for development
- ✅ Use Live Keys only in production

## Troubleshooting

If you still get errors after adding keys:

1. Make sure file is named exactly `.env.local` (not `.env.local.txt`)
2. Make sure there are no spaces around `=` sign
3. Make sure keys don't have quotes around them
4. Restart the dev server after adding keys
5. Check console for any typos in variable names


