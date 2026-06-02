# Social Media Buttons Update & Database Protection Guide

## ✅ Changes Made

### 1. Footer Social Media Icons Updated

**Changed from:**
- Facebook
- Instagram  
- LinkedIn

**Changed to:**
- 🗺️ Google Maps
- 🛒 Tokopedia

**Location:** `/app/components/Footer.js`

---

## 🗺️ Update Your Links

### Google Maps Link
**Current placeholder:** `https://maps.google.com/?q=Gangsar+Unitech+Surabaya`

**To get your actual link:**
1. Go to Google Maps
2. Search for your business location
3. Click **Share** button
4. Copy the link
5. Update in `/app/components/Footer.js` line 111

**Example:**
```javascript
href="https://maps.app.goo.gl/YOUR_ACTUAL_LINK"
```

### Tokopedia Link
**Current placeholder:** `https://www.tokopedia.com/gangsarunitech`

**To get your actual link:**
1. Go to your Tokopedia store
2. Copy the store URL
3. Update in `/app/components/Footer.js` line 121

**Example:**
```javascript
href="https://www.tokopedia.com/your-actual-store-name"
```

---

## 🛡️ Database Protection - Your Products Are Safe!

### How Database Initialization Works:

The system checks **BEFORE** adding any data:

```javascript
// From /app/lib/initData.js
const categoryCount = await db.collection('categories').countDocuments();

// Only initialize if NO categories exist
if (categoryCount === 0) {
  // Add sample data
}
```

**This means:**
- ✅ If you have products → Nothing is added or deleted
- ✅ Your existing data is **100% safe**
- ✅ Sample products only added to empty database
- ✅ No overwrites, no duplicates

### Your Product Data:
- **Categories:** Safe (won't reinitialize if any exist)
- **Products:** Safe (won't reinitialize if categories exist)
- **RFQs:** Always preserved
- **Admin users:** Only creates if doesn't exist

---

## 📦 How to Push Updated Code to GitHub

### Step 1: Review Changes
```bash
cd /app
git status
```

### Step 2: Add Changes
```bash
git add .
```

### Step 3: Commit with Message
```bash
git commit -m "Update social media links to Google Maps and Tokopedia"
```

### Step 4: Push to GitHub
```bash
git push origin main
```

**Note:** If you're on a different branch, replace `main` with your branch name.

---

## 🔄 Deploy to Vercel

After pushing to GitHub:

1. Vercel will **automatically deploy** (if auto-deploy is enabled)
2. Or manually trigger: Go to Vercel Dashboard → Deployments → Redeploy

**Your products will remain intact** because:
- Database is separate from code
- Initialization only runs on empty database
- Existing data is never deleted

---

## 🎨 Custom Icons

The current icons are simple SVG shapes. If you want better Tokopedia/Google Maps icons:

### Option 1: Use Images
```javascript
<a href="https://www.tokopedia.com/gangsarunitech">
  <img 
    src="/tokopedia-icon.png" 
    alt="Tokopedia" 
    className="h-5 w-5 hover:opacity-80"
  />
</a>
```

### Option 2: Use Official Brand Icons

**For Tokopedia:**
1. Download official Tokopedia brand icon
2. Add to `/public/icons/tokopedia.svg`
3. Use in Footer:
```javascript
<Image 
  src="/icons/tokopedia.svg" 
  width={20} 
  height={20} 
  alt="Tokopedia"
/>
```

**For Google Maps:**
Similar process with Google Maps icon.

---

## ✅ Verification Checklist

After deploying:

- [ ] Homepage footer shows Google Maps and Tokopedia icons
- [ ] Google Maps link opens correct location
- [ ] Tokopedia link opens your store
- [ ] All existing products still display in catalog
- [ ] Product count in admin dashboard unchanged
- [ ] RFQs still accessible
- [ ] No duplicate products created

---

## 🔍 Check Your Products

### Via Admin Dashboard:
1. Go to `https://your-domain.com/admin/login`
2. Login
3. Go to **Product Management**
4. Verify all products are there

### Via API:
```bash
curl https://your-domain.com/api/products?limit=100
```

Should return all your products.

---

## 🎯 Files Modified

1. **`/app/components/Footer.js`**
   - Replaced Facebook, Instagram, LinkedIn with Google Maps and Tokopedia
   - Removed unused icon imports
   - Added custom SVG icons

2. **`/app/lib/initData.js`** (No changes needed)
   - Already has database protection
   - Won't overwrite your products

---

## 💡 Additional Customization

### Change Icon Colors
In `/app/components/Footer.js`, modify the hover color:

```javascript
className="hover:text-[#1E8E5A] transition-colors"
// Change #1E8E5A to your preferred color
```

### Add More Links
Add additional social/marketplace links:

```javascript
<a 
  href="https://shopee.co.id/your-store" 
  target="_blank"
  rel="noopener noreferrer"
  className="hover:text-[#1E8E5A] transition-colors"
>
  {/* Add Shopee icon here */}
</a>
```

---

## 🆘 If Something Goes Wrong

### Products Missing?
**Don't worry!** Database is separate from code deployment.

**Check:**
1. Is MongoDB Atlas connection working?
2. Environment variable `MONGO_URL` correct?
3. Try refreshing the page

### Icons Not Showing?
**Check:**
1. Browser console (F12) for errors
2. SVG paths are correct
3. Links are properly formatted

### Want to Rollback?
```bash
git log  # Find previous commit
git revert HEAD  # Undo last commit
git push
```

---

## 📞 Support

If you need help:
1. Check browser console for errors (F12)
2. Check Vercel deployment logs
3. Verify MongoDB connection
4. Test API endpoints directly

Your product database is **completely safe** and separate from code changes! 🎉
