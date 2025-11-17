# 🔧 Vercel Environment Variables Setup

## Required Environment Variables

Vercel Dashboard में आपको **2 environment variables** set करने हैं:

### 1. `MONGODB_URI` ⚠️ **REQUIRED (यही missing है!)**

**Value:** MongoDB Atlas connection string
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/adminjanseva?retryWrites=true&w=majority
```

**कैसे मिलेगा:**
- MongoDB Atlas → Database → Connect → Connect your application
- Connection string copy करें
- Database name (`adminjanseva`) add करें

**⚠️ Important:** 
- `localhost:27017` production में काम नहीं करेगा
- MongoDB Atlas या कोई cloud MongoDB service चाहिए

---

### 2. `RESEND_API_KEY` ✅ (Already set होना चाहिए)

**Value:** Your Resend API key for email sending

**कैसे check करें:**
- Resend Dashboard → API Keys
- अगर already set है तो छोड़ दें

---

## 📝 Vercel में कैसे Set करें:

### Step 1: Vercel Dashboard खोलें
1. https://vercel.com/dashboard
2. अपना project select करें

### Step 2: Environment Variables Add करें
1. **Settings** tab पर click करें
2. Left sidebar में **Environment Variables** click करें
3. **Add New** button click करें

### Step 3: `MONGODB_URI` Add करें
- **Key:** `MONGODB_URI`
- **Value:** MongoDB Atlas connection string
- **Environments:** 
  - ✅ Production
  - ✅ Preview  
  - ✅ Development
  (सभी 3 select करें)

### Step 4: Save और Redeploy
1. **Save** button click करें
2. **Deployments** tab पर जाएं
3. Latest deployment पर **"..."** → **"Redeploy"**

---

## ✅ Verification

### Check 1: Health Endpoint
```
https://etawah-jan-a6ol.vercel.app/api/health
```

Response में यह दिखना चाहिए:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

### Check 2: Vercel Logs
1. Vercel Dashboard → Functions → Logs
2. Check करें: `✅ MongoDB Connected successfully` message दिखना चाहिए

---

## 🔍 Current Status Check

अगर आप check करना चाहते हैं कि कौन सी variables set हैं:

1. Vercel Dashboard → Settings → Environment Variables
2. List में देखें:
   - `MONGODB_URI` - **MUST BE SET** ✅
   - `RESEND_API_KEY` - Should be set ✅

---

## ⚠️ Common Issues

### Issue 1: Still getting 500 error
- **Solution:** `MONGODB_URI` check करें - MongoDB Atlas connection string होना चाहिए, `localhost` नहीं

### Issue 2: Database shows "disconnected" in health check
- **Solution:** 
  1. MongoDB Atlas में Network Access check करें (0.0.0.0/0 allow होना चाहिए)
  2. Database user credentials सही हैं या नहीं verify करें
  3. Connection string में database name (`adminjanseva`) included है या नहीं check करें

### Issue 3: Environment variable not updating
- **Solution:** 
  1. Variable save करने के बाद **Redeploy** करना जरूरी है
  2. Old deployment में नई variable नहीं दिखेगी

---

## 📋 Summary

**Vercel में Set करना है:**
1. ✅ `MONGODB_URI` - MongoDB Atlas connection string (REQUIRED)
2. ✅ `RESEND_API_KEY` - Resend API key (Already set होना चाहिए)

**Local `.env` file में:**
- Local development के लिए `.env` file में same variables set करें
- Local में `mongodb://localhost:27017/adminjanseva` use कर सकते हैं

