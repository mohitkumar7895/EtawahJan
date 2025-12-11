# 💰 Real Payment Setup Guide

## Abhi Test Mode Chal Raha Hai

Currently **TEST KEYS** configured hain - isse test payments hote hain, real paise nahi aate.

## Real Payments Ke Liye Ye Steps Follow Karo:

### Step 1: Razorpay Account Verification (Important!)

1. **Login** karo: https://dashboard.razorpay.com
2. **Settings** → **Account & Settings** pe jao
3. **Business Verification** complete karo:
   - Business name, address, phone
   - Bank account details (jahan paise aayenge)
   - KYC documents upload karo
   - GST number (agar hai to)

**Note**: Verification 1-2 days mein complete hota hai.

### Step 2: Live Keys Generate Karo

1. **Settings** → **API Keys** pe jao
2. **"Generate Live Keys"** button click karo (Test Keys nahi!)
3. **Live Key ID** copy karo (starts with `rzp_live_`)
4. **Live Key Secret** copy karo

### Step 3: `.env.local` File Update Karo

Test keys ko live keys se replace karo:

```env
# Live Razorpay Keys (Real Payments)
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET_KEY_HERE
```

**Example:**
```env
RAZORPAY_KEY_ID=rzp_live_1234567890abcdef
RAZORPAY_KEY_SECRET=abcd1234efgh5678ijkl9012mnop3456
```

### Step 4: Server Restart Karo

```bash
# Terminal mein Ctrl+C press karo
npm run dev
```

## ⚠️ Important Points:

1. **Account Verification Zaroori Hai**: Bina verification ke live keys nahi milengi
2. **Real Money**: Live mode mein real paise transfer honge
3. **Settlement**: Paise 2-3 din mein bank account mein aayenge
4. **Charges**: Razorpay ~2% charge karta hai per transaction
5. **Security**: Live Key Secret kabhi share mat karo

## 💡 Current Status:

- ✅ Payment system ready hai
- ✅ Test mode working hai
- ⏳ Live mode ke liye: Account verification + Live keys chahiye

## 🎯 Quick Checklist:

- [ ] Razorpay account verified hai?
- [ ] Live keys generate kiye?
- [ ] `.env.local` mein live keys add kiye?
- [ ] Server restart kiya?
- [ ] Test payment kiya (small amount se)?

## 📞 Help:

- Razorpay Support: support@razorpay.com
- Phone: 9193898182

---

**Abhi Test Mode Chal Raha Hai** - Real payments ke liye upar wale steps follow karo!

