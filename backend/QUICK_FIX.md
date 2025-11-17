# 🚨 Quick Fix for 500 Error

## Problem
Production (Vercel) पर MongoDB connection fail हो रहा है क्योंकि `localhost:27017` production में काम नहीं करता।

## ✅ Solution (5 मिनट में)

### Option 1: MongoDB Atlas (Recommended - FREE)

1. **MongoDB Atlas Account बनाएं:**
   - https://www.mongodb.com/cloud/atlas/register
   - Free tier select करें

2. **Cluster बनाएं:**
   - "Build a Database" → "FREE" tier select करें
   - Region choose करें (closest to you)
   - Cluster name: `Cluster0` (default)

3. **Database User बनाएं:**
   - "Database Access" → "Add New Database User"
   - Username और Password set करें (save करें!)
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

6. **Vercel में Environment Variable Set करें:**
   - Vercel Dashboard → Your Project
   - Settings → Environment Variables
   - Add new:
     - **Key:** `MONGODB_URI`
     - **Value:** Your connection string (step 5 से)
     - **Environment:** Production, Preview, Development (सभी select करें)
   - Save करें

7. **Redeploy:**
   - Vercel Dashboard → Deployments
   - Latest deployment पर "..." → "Redeploy"

### Option 2: MongoDB Compass Connection (अगर आपके पास remote MongoDB है)

अगर आप MongoDB Compass में connection string है:
1. Vercel → Settings → Environment Variables
2. `MONGODB_URI` add करें
3. Redeploy करें

## ✅ Test करें

1. Health check:
   ```
   https://etawah-jan-a6ol.vercel.app/api/health
   ```
   Response में `"database": "connected"` दिखना चाहिए

2. Admin panel में vacancy add करके test करें

## 🔍 Debug

अगर अभी भी error आए:
1. Vercel Dashboard → Functions → Logs check करें
2. `/api/health` endpoint check करें
3. Environment variable सही है या नहीं verify करें

