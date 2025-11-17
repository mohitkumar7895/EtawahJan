# MongoDB Setup for Production

## Problem
Vercel serverless functions cannot connect to `localhost:27017`. You need a cloud MongoDB service.

## Solution: MongoDB Atlas (Free Tier Available)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (Free tier M0 is sufficient)

### Step 2: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/adminjanseva?retryWrites=true&w=majority
   ```

### Step 3: Set Environment Variable in Vercel
1. Go to your Vercel project dashboard
2. Go to Settings → Environment Variables
3. Add new variable:
   - **Name**: `MONGODB_URI`
   - **Value**: Your MongoDB Atlas connection string
4. Redeploy your backend

### Step 4: Update Database Name
Make sure your connection string includes the database name:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/adminjanseva?retryWrites=true&w=majority
```

## Alternative: Use MongoDB Compass Connection
If you're using MongoDB Compass with a local/remote connection, you can use that connection string in the `MONGODB_URI` environment variable.

## Testing
After setting up, test the connection by:
1. Deploying the backend to Vercel
2. Checking Vercel function logs for: `✅ MongoDB Connected`
3. Trying to create a vacancy from the admin panel

