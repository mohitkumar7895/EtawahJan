# 💳 Live Payment Setup - Real Payments

## ⚠️ Important: Live vs Test Mode

**Current Status**: Test Mode (Test Keys)
- Test payments work but no real money is transferred
- Good for testing and development

**Live Mode**: Real Payments
- Real money will be transferred
- Requires Razorpay account verification
- Need Live API Keys

## 🚀 Steps to Enable Live Payments

### Step 1: Razorpay Account Verification

1. **Login** to Razorpay Dashboard: https://dashboard.razorpay.com
2. Go to **Settings** → **Account & Settings**
3. Complete **Business Verification**:
   - Business details
   - Bank account details
   - KYC documents
   - GST details (if applicable)

### Step 2: Generate Live Keys

1. Go to **Settings** → **API Keys**
2. Click **"Generate Live Keys"** (not Test Keys)
3. Copy the **Live Key ID** (starts with `rzp_live_`)
4. Copy the **Live Key Secret**

### Step 3: Update `.env.local` File

Replace test keys with live keys:

```env
# Live Razorpay Keys (Real Payments)
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET_KEY
```

### Step 4: Restart Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

## ⚠️ Important Notes for Live Payments

1. **Account Verification Required**: Razorpay account must be fully verified
2. **Settlement**: Money will be settled to your bank account (usually T+2 days)
3. **Charges**: Razorpay charges ~2% per transaction
4. **Security**: Never share Live Key Secret publicly
5. **Testing**: Always test with small amounts first

## 🔒 Security Checklist

- ✅ Live keys only in `.env.local` (never commit to git)
- ✅ Use HTTPS in production
- ✅ Enable webhook for payment notifications
- ✅ Monitor transactions regularly
- ✅ Keep Key Secret secure

## 📊 Payment Settlement

- **Settlement Time**: Usually 2-3 business days (T+2)
- **Minimum Settlement**: ₹500 (varies)
- **Settlement Account**: Your verified bank account

## 🆘 Support

- Razorpay Support: support@razorpay.com
- Dashboard: https://dashboard.razorpay.com
- Documentation: https://razorpay.com/docs/

---

## Current Configuration

**Mode**: Test Mode (Test Keys)
**Status**: Ready for testing
**Real Payments**: Need Live Keys + Account Verification






