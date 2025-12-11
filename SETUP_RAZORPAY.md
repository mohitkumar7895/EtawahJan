# 🔧 Razorpay Setup - Step by Step

## ⚠️ Current Error: "Payment gateway not configured"

Yeh error isliye aa raha hai kyunki Razorpay keys `.env.local` file mein nahi hain.

## ✅ Solution: 3 Simple Steps

### Step 1: Razorpay Account Banao (2 minutes)

1. **Website kholo**: https://razorpay.com
2. **"Sign Up"** button click karo
3. Apna email, phone number, password daalo
4. Email verify karo
5. Basic details fill karo (business name, etc.)

### Step 2: Test Keys Generate Karo (1 minute)

1. **Dashboard kholo**: https://dashboard.razorpay.com
2. **Settings** (left sidebar) click karo
3. **API Keys** section mein jao
4. **"Generate Test Keys"** button click karo
5. **Key ID** copy karo (starts with `rzp_test_`)
6. **Key Secret** copy karo (long string)

### Step 3: `.env.local` File Mein Add Karo (30 seconds)

1. Project folder mein `.env.local` file kholo
   - Agar nahi hai to banao (same folder jahan `package.json` hai)

2. Ye lines add karo:

```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY_HERE
```

**Example:**
```env
RAZORPAY_KEY_ID=rzp_test_1234567890abcdef
RAZORPAY_KEY_SECRET=abcd1234efgh5678ijkl9012mnop3456
```

3. **File save karo**

4. **Server restart karo**:
   - Terminal mein `Ctrl+C` press karo
   - Phir `npm run dev` run karo

## ✅ Test Karo

1. Browser refresh karo
2. `/payment` page pe jao
3. Amount daalo (e.g., 100)
4. "Pay Now" click karo
5. Test card use karo:
   - **Card**: 4111 1111 1111 1111
   - **CVV**: 123
   - **Expiry**: 12/25

## ❌ Agar Abhi Bhi Error Aaye

### Check 1: File Name
- ✅ `.env.local` (correct)
- ❌ `.env.local.txt` (wrong)
- ❌ `env.local` (wrong)

### Check 2: Format
```env
# ✅ Correct:
RAZORPAY_KEY_ID=rzp_test_abc123
RAZORPAY_KEY_SECRET=secret123

# ❌ Wrong (quotes nahi):
RAZORPAY_KEY_ID="rzp_test_abc123"

# ❌ Wrong (spaces around =):
RAZORPAY_KEY_ID = rzp_test_abc123
```

### Check 3: Server Restart
- Keys add karne ke baad **zaroor** server restart karo
- Browser refresh se kaam nahi hoga

### Check 4: Terminal Check
- Terminal mein koi error hai?
- Server properly start hua?

## 📞 Help Chahiye?

Contact: 9193898182

---

## 🎯 Quick Checklist

- [ ] Razorpay account bana liya
- [ ] Test keys generate kiye
- [ ] `.env.local` file mein keys add kiye
- [ ] File save kiya
- [ ] Server restart kiya
- [ ] Browser refresh kiya
- [ ] Payment test kiya

Sab tick ho gaya? Phir payment kaam karega! 🎉


