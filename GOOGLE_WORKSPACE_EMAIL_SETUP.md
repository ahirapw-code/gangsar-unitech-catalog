# Gmail Business (Google Workspace) Email Setup Guide

## ✅ Your Configuration

**Email:** info@gangsarunitech.id  
**SMTP Server:** smtp.gmail.com  
**Port:** 587 (STARTTLS)

---

## 📧 Step-by-Step Setup for Google Workspace

### Step 1: Enable IMAP in Gmail

1. Log in to your Google Workspace email: **info@gangsarunitech.id**
2. Click the **gear icon** (⚙️) → **See all settings**
3. Go to **Forwarding and POP/IMAP** tab
4. Under **IMAP access**, select **Enable IMAP**
5. Click **Save Changes**

### Step 2: Generate App-Specific Password

**Important:** You CANNOT use your regular email password. You must create an App Password.

#### Option A: If 2-Step Verification is Already Enabled

1. Go to your Google Account: https://myaccount.google.com
2. Click **Security** in the left menu
3. Under "How you sign in to Google", find **2-Step Verification**
4. Scroll down to **App passwords**
5. Click **App passwords**
6. Select:
   - **App:** Mail
   - **Device:** Other (Custom name)
   - Enter: "Gangsar Unitech Website"
7. Click **Generate**
8. **Copy the 16-character password** (no spaces)
9. Use this password in your `.env` file

#### Option B: If 2-Step Verification is NOT Enabled

1. Go to: https://myaccount.google.com/security
2. Find **2-Step Verification** and click **Get started**
3. Follow the setup process (use your phone number)
4. Once 2-Step Verification is active, follow **Option A** above

### Step 3: Update Environment Variables

Your `.env` file has been updated with:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@gangsarunitech.id
SMTP_PASS=your-app-specific-password
ADMIN_EMAIL=info@gangsarunitech.id
```

**Replace `your-app-specific-password` with the 16-character password from Step 2**

Example:
```env
SMTP_PASS=abcd efgh ijkl mnop  # Remove spaces: abcdefghijklmnop
```

### Step 4: Restart the Server

After updating the password in `.env`:

```bash
sudo supervisorctl restart nextjs
```

Or for external hosting:
```bash
# Restart your application to reload environment variables
```

---

## 🧪 Test Email Sending

### Test 1: Submit RFQ from Website

1. Go to your website
2. Navigate to `/rfq`
3. Fill in the RFQ form
4. Submit
5. Check your inbox: **info@gangsarunitech.id**

### Test 2: Check Server Logs

```bash
tail -f /var/log/supervisor/nextjs.out.log | grep -i email
```

You should see:
- ✅ "Email sent successfully to info@gangsarunitech.id"
- ❌ If error, check the error message

---

## 🔧 Troubleshooting

### Issue 1: "Invalid credentials" or "Username and Password not accepted"

**Solution:**
- Verify you're using the **App Password**, not your regular password
- App Password should be 16 characters with no spaces
- Make sure IMAP is enabled in Gmail settings

### Issue 2: "Authentication failed" or "SMTP not working"

**Solution:**
- Verify 2-Step Verification is enabled
- Generate a new App Password
- Update `.env` with new password
- Restart server

### Issue 3: "Connection timeout" or "Could not connect to server"

**Solution:**
- Check if port 587 is open on your server
- Verify SMTP_HOST is exactly: `smtp.gmail.com`
- Verify SMTP_PORT is exactly: `587`

### Issue 4: Email sends but doesn't arrive

**Solution:**
- Check spam/junk folder
- Verify recipient email in ADMIN_EMAIL
- Check Google Workspace admin console for email delivery logs

---

## 📋 Configuration Checklist

Before deploying, verify:

- [ ] IMAP enabled in Gmail settings
- [ ] 2-Step Verification enabled on info@gangsarunitech.id
- [ ] App Password generated (16 characters)
- [ ] `.env` file updated with App Password (no spaces)
- [ ] `SMTP_USER` = info@gangsarunitech.id
- [ ] `SMTP_HOST` = smtp.gmail.com
- [ ] `SMTP_PORT` = 587
- [ ] `ADMIN_EMAIL` = info@gangsarunitech.id
- [ ] Server restarted after `.env` changes
- [ ] Test RFQ submission works

---

## ✅ What Happens When Email is Configured

**When a customer submits an RFQ:**

1. Form data is saved to MongoDB database
2. Email notification is sent to: **info@gangsarunitech.id**
3. Email includes:
   - Customer name and company
   - Contact details (phone, email)
   - List of requested products with SKU and quantities
   - Additional notes from customer

**Email Subject:** "New RFQ from [Company Name]"

**You can then:**
- View full details in Admin Dashboard at `/admin/rfq`
- Respond directly to customer via email
- Update RFQ status (pending → processing → completed)

---

## 🎯 Important Notes

### Google Workspace vs Regular Gmail

✅ **Your setup (Google Workspace with custom domain) is BETTER because:**
- Professional appearance (info@gangsarunitech.id vs gangsarunitech@gmail.com)
- Better deliverability
- More storage and features
- Same SMTP settings as regular Gmail

### Security Best Practices

- ✅ Use App Password (never use real password in code)
- ✅ Keep `.env` file secure (never commit to git)
- ✅ Change App Password if compromised
- ✅ Monitor email logs for suspicious activity

### Rate Limits

Google Workspace has higher limits than free Gmail:
- **Free Gmail:** 500 emails/day
- **Google Workspace:** 2,000 emails/day

For a B2B catalog website, this is more than sufficient.

---

## 📞 Need Help?

### Google Workspace Support
- Admin Console: https://admin.google.com
- Help: https://support.google.com/a/

### Check Configuration
Run this test in your terminal:
```bash
cd /app
node -e "console.log('SMTP User:', process.env.SMTP_USER); console.log('SMTP Host:', process.env.SMTP_HOST);"
```

Should output:
```
SMTP User: info@gangsarunitech.id
SMTP Host: smtp.gmail.com
```

---

## 🎉 Summary

**Your email system is ready!** Just need to:
1. Generate App Password from Google Account
2. Update `.env` with the password
3. Restart server
4. Test by submitting an RFQ

**Email will be sent from and to:** info@gangsarunitech.id

This gives your customers a professional experience and you'll receive all RFQ notifications directly to your business email.
