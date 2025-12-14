# Gmail SMTP Setup - Email Bhejne Ke Liye

## Problem
Resend testing mode mein sirf verified email (`mohitporwal596@gmail.com`) ko email bhej sakta hai. 
Dusre emails ko bhejne ke liye Gmail SMTP setup karna hoga.

## Solution: Gmail App Password Setup

### Step 1: Gmail Account Se App Password Generate Karo

1. **Google Account Settings** mein jao:
   - https://myaccount.google.com/security

2. **2-Step Verification** enable karo (agar nahi hai):
   - Security section mein "2-Step Verification" enable karo

3. **App Passwords** generate karo:
   - https://myaccount.google.com/apppasswords
   - Ya Security section mein "App passwords" dhundho
   - "Select app" mein "Mail" choose karo
   - "Select device" mein "Other (Custom name)" choose karo
   - Name dalo: "Jan Seva Kendra"
   - "Generate" button click karo
   - **16-character password copy karo** (yeh sirf ek baar dikhega!)

### Step 2: .env.local File Mein Add Karo

`.env.local` file mein yeh add karo:

```env
# Gmail SMTP Configuration
GMAIL_USER=mohitporwal596@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password-here

# Resend (optional - testing ke liye)
RESEND_API_KEY=re_TBmzHAZy_6yrBUkugesh69sMtAo6DLvDq

# Recipients
RECIPIENT_EMAILS=dhaniramsingh711@gmail.com,mohitporwal596@gmail.com
```

### Step 3: Server Restart Karo

```bash
# Server stop karo (Ctrl+C)
# Phir restart karo
npm run dev
```

### Step 4: Test Karo

Browser mein jao:
```
http://localhost:3000/api/test-email
```

Ya form submit karo - ab dono emails ko email jayega!

## Important Notes

- **App Password** = Regular password nahi hai
- App Password sirf ek baar generate hota hai - safely save karo
- Agar password bhool gaye, naya generate karo
- Gmail se 500 emails/day limit hai (free account)

## Alternative: Resend Domain Verify Karo

Agar production mein jana hai, to:
1. Resend dashboard mein domain verify karo
2. Domain se email bhejo (e.g., `noreply@yourdomain.com`)









