# Gangsar Unitech - Admin Guide

## 🔐 Admin Access

**Login URL:** `/admin/login`

**Default Credentials:**
- Email: `admin@gangsarunitech.com`
- Password: `Admin@123456`

⚠️ **Important:** Change these credentials in production!

---

## 📊 Admin Dashboard Features

### Dashboard (`/admin/dashboard`)
- **Overview Statistics:**
  - Total Products
  - Total Categories
  - Total RFQs
  - Pending RFQs
  
- **Quick Access:**
  - Recent products list
  - Recent RFQ requests
  - Direct links to management pages

---

## 🛠️ Management Pages

### 1. Product Management (`/admin/products`)

**Features:**
- ✅ View all products with images
- ✅ Search products by name or SKU
- ✅ Toggle promo status on/off
- ✅ Edit product details (coming soon)
- ✅ Delete products
- ✅ Add new products (coming soon)

**Actions Available:**
- **Set/Remove Promo:** Click "Set Promo" or "Remove Promo" button
- **Edit:** Click "Edit" button (redirects to edit page)
- **Delete:** Click "Delete" button with confirmation
- **Add New:** Click "Add New Product" in header

### 2. RFQ Management (`/admin/rfq`)

**Features:**
- ✅ View all quotation requests
- ✅ See customer details (name, company, email, phone)
- ✅ View requested products with quantities
- ✅ Update RFQ status (pending → processing → completed)
- ✅ View full RFQ details in modal

**RFQ Workflow:**
1. Customer submits RFQ from website
2. Admin receives notification (email if configured)
3. Admin views RFQ in dashboard
4. Click "View Details" to see full information
5. Click "Process" to mark as processing
6. Click "Complete" when quotation is sent

**Status Flow:**
- `pending` → `processing` → `completed`

---

## 📧 Email Configuration

**Location:** `/app/.env`

**Required Settings:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
ADMIN_EMAIL=admin@gangsarunitech.com
```

**To Get Gmail App Password:**
1. Go to Google Account Settings
2. Enable 2-Step Verification
3. Go to Security → App Passwords
4. Generate password for "Mail"
5. Copy password to `.env` file
6. Restart server: `sudo supervisorctl restart nextjs`

**Email Notifications Sent For:**
- New RFQ submissions
- Includes customer details and product list
- Sent to `ADMIN_EMAIL`

---

## 🎨 Website Features (Customer Side)

### Public Pages:
- **Homepage** (`/`) - Hero, promo products, categories
- **Products** (`/products`) - Full catalog with filters
- **Product Detail** (`/products/[slug]`) - Detailed view
- **Cart** (`/cart`) - Shopping cart for inquiry
- **RFQ Form** (`/rfq`) - Formal quotation request
- **About** (`/about`) - Company information
- **Contact** (`/contact`) - Contact details

### Customer Actions:
- Browse products by category
- Search products by name/SKU
- Filter by promo items
- Add products to cart
- Send WhatsApp inquiry directly
- Submit formal RFQ through form

---

## 🔧 Technical Details

### Database Collections:
- `users` - Admin users
- `products` - Product catalog
- `categories` - Product categories
- `rfqs` - Quotation requests
- `sessions` - Admin login sessions

### Sample Data:
- 6 product categories pre-loaded
- 8 sample products pre-loaded
- Admin user auto-created on first run

### Authentication:
- JWT-based authentication
- Token stored in localStorage
- 7-day session expiry
- Secure password hashing (bcrypt)

---

## 🚀 Quick Start Guide

### For Admin:
1. Navigate to `/admin/login`
2. Login with credentials above
3. View dashboard statistics
4. Click "Manage Products" to see all products
5. Click "View All RFQs" to see quotation requests
6. Process RFQs by updating their status

### For Customers:
1. Browse products on website
2. Add items to cart
3. Either:
   - Send WhatsApp inquiry (instant)
   - Submit formal RFQ (tracked in admin)

---

## 📱 WhatsApp Integration

**Current Number:** `+62 812-3456-7890` (placeholder)

**To Update:**
1. Edit `/app/contexts/CartContext.js`
2. Edit `/app/app/products/[slug]/page.js`
3. Edit `/app/components/WhatsAppButton.js`
4. Replace `6281234567890` with your number

**WhatsApp Features:**
- Floating button on all pages
- Cart inquiry with product list
- Direct product inquiry from detail page

---

## 🎯 Next Steps

### Recommended:
1. ✅ Update WhatsApp number
2. ✅ Configure email notifications
3. ✅ Change admin password
4. ✅ Add real product images
5. ✅ Update company contact details

### Coming Soon:
- Add/Edit product forms
- Bulk product upload
- Category management
- Image upload system
- Advanced reporting

---

## 📞 Support

For technical issues or questions, refer to the main README.md or contact the development team.

---

**Last Updated:** June 2025
**Version:** 1.0.0
