# 🔧 Fix 503 Service Unavailable Error

## Problem
503 error आ रहा है क्योंकि **MongoDB connection नहीं हो रहा** production में।

## ✅ Solution (5 मिनट)

### Step 1: MongoDB Atlas Setup (अगर नहीं है)

1. **MongoDB Atlas Account बनाएं:**
   - https://www.mongodb.com/cloud/atlas/register
   - Free tier select करें

2. **Cluster बनाएं:**
   - "Build a Database" → "FREE" tier
   - Region choose करें
   - Cluster name: `Cluster0` (default)

3. **Database User बनाएं:**
   - "Database Access" → "Add New Database User"
   - Username और Password set करें (⚠️ SAVE करें!)
   - "Read and write to any database" select करें

4. **Network Access:**
   - "Network Access" → "Add IP Address"
   - "Allow Access from Anywhere" (0.0.0.0/0) select करें

5. **Connection String लें:**
   - "Database" → "Connect" → "Connect your application"
   - Connection string copy करें:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Database name add करें:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/adminjanseva?retryWrites=true&w=majority
     ```

### Step 2: Vercel में Environment Variable Set करें

1. **Vercel Dashboard खोलें:**
   - https://vercel.com/dashboard
   - अपना project select करें

2. **Settings → Environment Variables:**
   - "Add New" button click करें

3. **Add Variable:**
   - **Key:** `MONGODB_URI`
   - **Value:** MongoDB Atlas connection string (Step 1 से)
   - **Environments:** 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - **Save** करें

### Step 3: Redeploy

1. **Deployments** tab पर जाएं
2. Latest deployment पर **"..."** → **"Redeploy"**
3. Wait करें deployment complete होने तक

### Step 4: Verify

1. **Health Check:**
   ```
   https://etawah-jan-a6ol.vercel.app/api/health
   ```
   Response में `"database": "connected"` दिखना चाहिए

2. **Vercel Logs Check करें:**
   - Vercel Dashboard → Functions → Logs
   - `✅ MongoDB Connected successfully` message दिखना चाहिए

3. **Admin Panel Test करें:**
   - Admin panel में vacancy add करें
   - अब 503 error नहीं आना चाहिए

---

## 🔍 Troubleshooting

### Issue 1: Still getting 503 after setup
- **Check:** Vercel में `MONGODB_URI` variable set है या नहीं
- **Check:** Connection string में database name (`adminjanseva`) included है या नहीं
- **Check:** MongoDB Atlas में Network Access allow है या नहीं (0.0.0.0/0)

### Issue 2: Connection string format
- ✅ Correct: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/adminjanseva?retryWrites=true&w=majority`
- ❌ Wrong: `mongodb://localhost:27017/adminjanseva` (production में काम नहीं करेगा)

### Issue 3: Environment variable not updating
- **Solution:** Variable save करने के बाद **Redeploy** करना जरूरी है
- Old deployment में नई variable नहीं दिखेगी

---

## 📋 Quick Checklist

- [ ] MongoDB Atlas account बना लिया
- [ ] Cluster बना लिया
- [ ] Database user बना लिया (username/password save किया)
- [ ] Network Access allow किया (0.0.0.0/0)
- [ ] Connection string copy किया (database name included)
- [ ] Vercel में `MONGODB_URI` environment variable set किया
- [ ] Backend redeploy किया
- [ ] Health check test किया (`/api/health`)
- [ ] Admin panel में vacancy add test किया

---

## 💡 Important Notes

1. **Local Development:** Local में `mongodb://localhost:27017/adminjanseva` use कर सकते हैं
2. **Production:** Production में MongoDB Atlas या कोई cloud MongoDB service चाहिए
3. **Security:** Connection string में password secure रखें, कभी भी code में commit न करें

---

## ✅ Success Indicators

अगर सब कुछ सही है तो:
- ✅ `/api/health` endpoint में `"database": "connected"` दिखेगा
- ✅ Admin panel में vacancy add/update/delete काम करेगा
- ✅ 503 error नहीं आएगा
- ✅ Vercel logs में `✅ MongoDB Connected successfully` दिखेगा

