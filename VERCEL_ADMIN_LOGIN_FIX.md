# Vercel Deployment - Admin Login Fix Guide

## 🔍 Common Issues & Solutions

### Issue 1: Environment Variables Not Set in Vercel

**This is the most common issue!**

Go to your Vercel dashboard and add these environment variables:

**Required Variables:**
```
MONGO_URL=your_mongodb_atlas_connection_string
DB_NAME=gangsar_unitech
NEXT_PUBLIC_BASE_URL=https://your-domain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=admin@gangsarunitech.id
SMTP_PASS=khrzfhqquwdzlqlr
ADMIN_EMAIL=admin@gangsarunitech.id
JWT_SECRET=your-random-secret-string-here-change-this
ADMIN_DEFAULT_EMAIL=admin@gangsarunitech.com
ADMIN_DEFAULT_PASSWORD=Admin@123456
CORS_ORIGINS=*
```

**How to Add in Vercel:**
1. Go to: https://vercel.com/dashboard
2. Select your project (gangsar-unitech-catalog)
3. Go to **Settings** → **Environment Variables**
4. Add each variable above
5. Make sure to select **Production**, **Preview**, and **Development**
6. Click **Save**
7. **Redeploy** your project

---

## Issue 2: MongoDB Connection

**If using local MongoDB (won't work on Vercel!)**

Vercel is serverless, so you need a cloud database.

**Solution: Use MongoDB Atlas (Free)**

1. Go to: https://cloud.mongodb.com
2. Create a free account
3. Create a new cluster (Free M0 tier)
4. Click **Connect** → **Connect your application**
5. Copy the connection string, should look like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gangsar_unitech?retryWrites=true&w=majority
   ```
6. Add this to Vercel as `MONGO_URL`

**Security: Whitelist Vercel IPs**
- In MongoDB Atlas, go to **Network Access**
- Click **Add IP Address**
- Click **Allow Access from Anywhere** (0.0.0.0/0)
- This allows Vercel's serverless functions to connect

---

## Issue 3: Admin User Not Created

**In serverless environment, initialization might not run**

Create a manual API route to initialize admin:

**Create file: `/app/app/api/init-admin/route.js`**

```javascript
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function GET(request) {
  try {
    const db = await getDb();
    
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@gangsarunitech.com';
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123456';
    
    // Check if admin exists
    const existing = await db.collection('users').findOne({ email: adminEmail });
    
    if (existing) {
      return NextResponse.json({ 
        message: 'Admin already exists',
        email: adminEmail 
      });
    }
    
    // Create admin
    const hashedPassword = await hashPassword(adminPassword);
    await db.collection('users').insertOne({
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date()
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Admin user created successfully',
      email: adminEmail
    });
    
  } catch (error) {
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
```

**Then visit:** `https://your-domain.com/api/init-admin`

This will create the admin user.

---

## Issue 4: JWT Secret Not Set

**If JWT_SECRET is missing, login will fail**

In Vercel Environment Variables, add:
```
JWT_SECRET=gangsar-unitech-production-secret-2026-change-this-to-something-random
```

**Important:** Generate a strong random string for production!

You can generate one with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Issue 5: CORS Issues

If you see CORS errors in browser console:

**In Vercel, add:**
```
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

Or for now, use `*` to allow all origins during testing.

---

## 🔧 Step-by-Step Fix

### 1. Set Up MongoDB Atlas

```bash
# Your connection string should look like:
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/gangsar_unitech
```

### 2. Add All Environment Variables in Vercel

Go to: `https://vercel.com/[your-username]/gangsar-unitech-catalog/settings/environment-variables`

Add each variable listed at the top of this guide.

### 3. Redeploy

After adding environment variables:
- Go to **Deployments** tab
- Click **⋯** (three dots) on latest deployment
- Click **Redeploy**

Or commit and push to trigger new deployment:
```bash
git commit --allow-empty -m "Redeploy with env vars"
git push
```

### 4. Initialize Admin

Visit: `https://your-domain.com/api/init-admin`

Should return:
```json
{
  "success": true,
  "message": "Admin user created successfully",
  "email": "admin@gangsarunitech.com"
}
```

### 5. Test Login

Go to: `https://your-domain.com/admin/login`

Login with:
- Email: `admin@gangsarunitech.com`
- Password: `Admin@123456`

---

## 🐛 Debug Login Issues

### Check Browser Console

1. Open your website
2. Press F12 to open Developer Tools
3. Go to **Console** tab
4. Try logging in
5. Look for error messages

### Common Errors:

**"Invalid credentials"**
- Admin user doesn't exist in database
- Visit `/api/init-admin` to create

**"Network error" or "Failed to fetch"**
- Environment variables not set
- MongoDB connection failed
- Check Vercel function logs

**"Unauthorized"**
- JWT_SECRET not set
- Add JWT_SECRET to Vercel env vars

### Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click on latest deployment
4. Go to **Functions** tab
5. Look for `/api/auth/login` logs
6. Check for errors

---

## 📋 Complete Vercel Environment Variables Checklist

Copy these to Vercel Settings → Environment Variables:

```env
# Database (REQUIRED - use MongoDB Atlas)
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/gangsar_unitech
DB_NAME=gangsar_unitech

# Domain (REQUIRED - your actual domain)
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Email (REQUIRED for RFQ notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=admin@gangsarunitech.id
SMTP_PASS=khrzfhqquwdzlqlr
ADMIN_EMAIL=admin@gangsarunitech.id

# Admin Auth (REQUIRED for login)
JWT_SECRET=generate-a-random-secret-here
ADMIN_DEFAULT_EMAIL=admin@gangsarunitech.com
ADMIN_DEFAULT_PASSWORD=Admin@123456

# Optional
CORS_ORIGINS=*
```

---

## 🚀 Quick Fix Commands

**1. Check if site is loading:**
```bash
curl https://your-domain.com
```

**2. Test API endpoint:**
```bash
curl https://your-domain.com/api/categories
```

**3. Initialize admin:**
```bash
curl https://your-domain.com/api/init-admin
```

**4. Test login API:**
```bash
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gangsarunitech.com","password":"Admin@123456"}'
```

Should return:
```json
{
  "token": "...",
  "user": {
    "email": "admin@gangsarunitech.com",
    "role": "admin"
  }
}
```

---

## ✅ Final Checklist

Before admin login works, verify:

- [ ] MongoDB Atlas cluster created and accessible
- [ ] All environment variables added in Vercel
- [ ] Project redeployed after adding env vars
- [ ] `/api/init-admin` visited to create admin user
- [ ] JWT_SECRET is set
- [ ] MONGO_URL points to Atlas (not localhost)
- [ ] Vercel function logs show no errors

---

## 🆘 Still Not Working?

**Share these details for further help:**

1. **Error message** from browser console (F12 → Console)
2. **Vercel function logs** (Deployment → Functions → errors)
3. **What happens** when you try to login (error message, nothing happens, etc.)
4. **URL** of your deployed site

**Most likely issue:** Environment variables not set in Vercel. Double-check this first!

---

## 💡 Pro Tips

1. **Always redeploy** after changing environment variables
2. **Use MongoDB Atlas** not local MongoDB for Vercel
3. **Check function logs** in Vercel for errors
4. **Test API endpoints** directly with curl
5. **Keep JWT_SECRET secret** and random in production

Your admin login should work after following these steps!
