# How to Change Address and Phone Number

## 📋 Quick Reference

**Current Values:**
- Address: Surabaya, East Java, Indonesia
- Phone: +62 812-3456-7890
- WhatsApp: 6281234567890

**Replace with your actual information!**

---

## 📝 Files to Edit (6 files total)

### 1. Footer Component (Shows on ALL pages)
**File:** `/app/components/Footer.js`

**Line 98:** Change address
```javascript
<span className="text-sm">Surabaya, East Java, Indonesia</span>
```
To:
```javascript
<span className="text-sm">Your Address Here</span>
```

**Line 102:** Change phone
```javascript
<span className="text-sm">+62 812-3456-7890</span>
```
To:
```javascript
<span className="text-sm">Your Phone Number</span>
```

**Line 106:** Change email (optional)
```javascript
<span className="text-sm">info@gangsarunitech.com</span>
```

---

### 2. Contact Page
**File:** `/app/app/contact/page.js`

**Lines 54-56:** Change address display
```javascript
Surabaya<br />
East Java<br />
Indonesia
```

**Line 76:** Change phone link
```javascript
<a href="tel:+6281234567890" className="hover:text-[#1E8E5A]">
  +62 812-3456-7890
</a>
```
Change both the `href="tel:+6281234567890"` and the displayed number.

**Line 79:** Change time zone reference (optional)
```javascript
Mon-Fri: 8AM-5PM WIB
```

**Line 144:** Change WhatsApp number in button
```javascript
onClick={() => window.open('https://wa.me/6281234567890', '_blank')}
```

**Line 162:** Change phone number in button
```javascript
onClick={() => window.location.href = 'tel:+6281234567890'}
```

---

### 3. WhatsApp Button Component (Floating button)
**File:** `/app/components/WhatsAppButton.js`

**Line 10:** Change WhatsApp number
```javascript
const phoneNumber = '6281234567890'; // Replace with actual WhatsApp number
```
To:
```javascript
const phoneNumber = 'YOUR_WHATSAPP_NUMBER'; // Format: 628123456789 (no + or spaces)
```

---

### 4. Product Detail Page
**File:** `/app/app/products/[slug]/page.js`

**Line 65:** Change WhatsApp number
```javascript
window.open(`https://wa.me/6281234567890?text=${message}`, '_blank');
```

---

### 5. Cart Context (WhatsApp inquiry)
**File:** `/app/contexts/CartContext.js`

**Line 70:** Change WhatsApp number
```javascript
const phoneNumber = '6281234567890'; // Replace with actual WhatsApp number
```

---

### 6. Homepage & About (optional descriptions)
**File:** `/app/app/page.js`
- Line 89: Mentions "Surabaya" in hero text
- Line 109: Mentions "Surabaya" in company intro

**File:** `/app/app/about/page.js`
- Line 40: Mentions "Surabaya, East Java, Indonesia"

**File:** `/app/app/layout.js` (SEO metadata)
- Line 12: Title mentions "Surabaya"
- Line 13: Description mentions "Surabaya"

---

## 🚀 Quick Replace Script

You can use this command to replace all at once:

```bash
# Replace phone number (be in /app directory)
cd /app

# Replace phone display format
find . -type f -name "*.js" -not -path "./node_modules/*" -not -path "./.next/*" \
  -exec sed -i 's/+62 812-3456-7890/YOUR_NEW_PHONE/g' {} \;

# Replace WhatsApp number (no + or spaces)
find . -type f -name "*.js" -not -path "./node_modules/*" -not -path "./.next/*" \
  -exec sed -i 's/6281234567890/YOUR_WHATSAPP_NUMBER/g' {} \;

# Replace address
find . -type f -name "*.js" -not -path "./node_modules/*" -not -path "./.next/*" \
  -exec sed -i 's/Surabaya, East Java, Indonesia/YOUR_ADDRESS/g' {} \;
```

---

## ✅ Recommended: Edit These Key Files

**Priority 1 (Must change):**
1. `/app/components/Footer.js` - Line 98 (address), Line 102 (phone)
2. `/app/components/WhatsAppButton.js` - Line 10 (WhatsApp number)
3. `/app/contexts/CartContext.js` - Line 70 (WhatsApp number)

**Priority 2 (Important):**
4. `/app/app/contact/page.js` - Lines 54-56, 76, 144, 162
5. `/app/app/products/[slug]/page.js` - Line 65

**Priority 3 (Optional - SEO/Text):**
6. `/app/app/page.js` - Lines 89, 109
7. `/app/app/about/page.js` - Line 40
8. `/app/app/layout.js` - Lines 12-14

---

## 📱 Phone Number Formats

**For Display:** `+62 812-3456-7890` (with + and spaces)
**For WhatsApp:** `6281234567890` (no + or spaces, just numbers)
**For tel: links:** `+6281234567890` (with + but no spaces)

**Example:**
If your number is +62 821-5555-6666:
- Display format: `+62 821-5555-6666`
- WhatsApp format: `6282155556666`
- Tel link format: `+6282155556666`

---

## 🔄 After Making Changes

### If working locally:
```bash
# Server will auto-reload
```

### If deployed on Vercel:
```bash
git add .
git commit -m "Update contact information"
git push
```

Vercel will automatically redeploy with new information.

---

## 💡 Pro Tip

Create a file with your contact info as constants:

**Create:** `/app/lib/constants.js`
```javascript
export const CONTACT_INFO = {
  address: 'Your Full Address Here',
  city: 'Your City',
  phone: {
    display: '+62 821-5555-6666',
    tel: '+6282155556666',
    whatsapp: '6282155556666'
  },
  email: 'info@gangsarunitech.id',
  businessHours: 'Monday - Friday: 8:00 AM - 5:00 PM WIB'
};
```

Then import and use in all files:
```javascript
import { CONTACT_INFO } from '@/lib/constants';
// Use: {CONTACT_INFO.phone.display}
```

This way you only need to change in one place!
