# Gangsar Unitech - External Hosting Deployment Guide

## 📋 Prerequisites

Before deploying to your own hosting, ensure you have:
- Node.js 18.x or higher
- MongoDB database (local or cloud like MongoDB Atlas)
- A hosting platform that supports Node.js (Vercel, Netlify, Railway, DigitalOcean, AWS, etc.)
- Domain name (optional)

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel?**
- Built for Next.js
- Zero configuration
- Automatic HTTPS
- CDN included
- Free tier available

**Steps:**

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy from project directory:**
```bash
cd /app
vercel
```

4. **Configure Environment Variables in Vercel Dashboard:**
   - Go to your project settings
   - Add all variables from `.env`:
   ```
   MONGO_URL=your_mongodb_connection_string
   DB_NAME=gangsar_unitech
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ADMIN_EMAIL=admin@gangsarunitech.com
   JWT_SECRET=change-this-to-random-string
   ADMIN_DEFAULT_EMAIL=admin@gangsarunitech.com
   ADMIN_DEFAULT_PASSWORD=Admin@123456
   ```

5. **Deploy:**
```bash
vercel --prod
```

**MongoDB Setup for Vercel:**
Use MongoDB Atlas (free tier):
1. Go to https://cloud.mongodb.com
2. Create a cluster
3. Get connection string
4. Replace in Vercel env: `MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/gangsar_unitech`

---

### Option 2: Railway.app

**Steps:**

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login:**
```bash
railway login
```

3. **Initialize project:**
```bash
cd /app
railway init
```

4. **Add MongoDB:**
```bash
railway add --service mongodb
```

5. **Set environment variables:**
```bash
railway variables set MONGO_URL=${{MONGOURL}}
railway variables set DB_NAME=gangsar_unitech
railway variables set SMTP_USER=your-email@gmail.com
railway variables set SMTP_PASS=your-app-password
# ... add all other variables
```

6. **Deploy:**
```bash
railway up
```

---

### Option 3: VPS (DigitalOcean, Linode, AWS EC2)

**For Ubuntu/Debian servers:**

1. **SSH into your server:**
```bash
ssh root@your-server-ip
```

2. **Install Node.js:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
```

3. **Install MongoDB:**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
apt-get update
apt-get install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod
```

4. **Install PM2 (Process Manager):**
```bash
npm install -g pm2
```

5. **Clone or upload your project:**
```bash
cd /var/www
# Upload your project files here
```

6. **Install dependencies:**
```bash
cd /var/www/app
npm install
# or
yarn install
```

7. **Create .env file:**
```bash
nano .env
```
Paste your environment variables:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=gangsar_unitech
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@gangsarunitech.com
JWT_SECRET=your-random-secret-key-here
ADMIN_DEFAULT_EMAIL=admin@gangsarunitech.com
ADMIN_DEFAULT_PASSWORD=Admin@123456
```

8. **Build the application:**
```bash
npm run build
```

9. **Start with PM2:**
```bash
pm2 start npm --name "gangsar-unitech" -- start
pm2 save
pm2 startup
```

10. **Setup Nginx as reverse proxy:**
```bash
apt-get install nginx

# Create Nginx config
nano /etc/nginx/sites-available/gangsar-unitech
```

Nginx config:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/gangsar-unitech /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

11. **Setup SSL with Let's Encrypt:**
```bash
apt-get install certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

### Option 4: Docker Deployment

1. **Create Dockerfile:**

Create `/app/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy application files
COPY . .

# Build application
RUN yarn build

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start application
CMD ["yarn", "start"]
```

2. **Create docker-compose.yml:**
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGO_URL=mongodb://mongo:27017
      - DB_NAME=gangsar_unitech
      - NEXT_PUBLIC_BASE_URL=https://yourdomain.com
    env_file:
      - .env
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

volumes:
  mongo-data:
```

3. **Deploy:**
```bash
docker-compose up -d
```

---

## 🔧 Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017` or `mongodb+srv://user:pass@cluster.mongodb.net` |
| `DB_NAME` | Database name | `gangsar_unitech` |
| `NEXT_PUBLIC_BASE_URL` | Your website URL | `https://yourdomain.com` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Email address | `your-email@gmail.com` |
| `SMTP_PASS` | Email app password | `your-app-specific-password` |
| `ADMIN_EMAIL` | Admin notification email | `admin@gangsarunitech.com` |
| `JWT_SECRET` | Secret for JWT tokens | `random-string-here-change-in-production` |
| `ADMIN_DEFAULT_EMAIL` | Admin login email | `admin@gangsarunitech.com` |
| `ADMIN_DEFAULT_PASSWORD` | Admin login password | `Admin@123456` |
| `CORS_ORIGINS` | Allowed CORS origins | `*` or `https://yourdomain.com` |

**⚠️ Security Notes:**
- Change `JWT_SECRET` to a random string in production
- Change `ADMIN_DEFAULT_PASSWORD` after first login
- Use strong passwords for database and email
- Never commit `.env` file to git

---

## 📝 Pre-Deployment Checklist

Before deploying, make sure you:

- [ ] Updated WhatsApp number in:
  - `/app/contexts/CartContext.js`
  - `/app/app/products/[slug]/page.js`
  - `/app/components/WhatsAppButton.js`

- [ ] Set up MongoDB database (local or Atlas)

- [ ] Created Gmail app-specific password for email notifications

- [ ] Changed default admin password

- [ ] Updated `NEXT_PUBLIC_BASE_URL` to your domain

- [ ] Generated strong `JWT_SECRET`

- [ ] Tested the application locally with production settings

- [ ] Set up domain DNS (if using custom domain)

---

## 🧪 Testing Your Deployment

After deployment, test these features:

1. **Homepage loads** - Visit your domain
2. **Products display** - Navigate to /products
3. **Product detail pages work** - Click on a product
4. **Cart functions** - Add products to cart
5. **RFQ submission works** - Submit a quotation request
6. **Admin login** - Go to /admin/login
7. **Product management** - Add/edit/delete products
8. **RFQ management** - View and update RFQs
9. **WhatsApp buttons work** - Test inquiry buttons
10. **Email notifications** - Submit RFQ and check email

---

## 🐛 Common Deployment Issues

### Issue: "Cannot connect to database"
**Solution:** Check MONGO_URL is correct and database is accessible

### Issue: "500 Internal Server Error"
**Solution:** Check server logs, ensure all environment variables are set

### Issue: "Images not loading"
**Solution:** Ensure image URLs are accessible, check CORS settings

### Issue: "WhatsApp links not working"
**Solution:** Update WhatsApp number in code files (see checklist)

### Issue: "Emails not sending"
**Solution:** Verify SMTP credentials, check Gmail app password

### Issue: "Admin can't login"
**Solution:** Check database connection, verify admin user was created on startup

---

## 📊 Monitoring & Maintenance

**Recommended tools:**
- **Uptime monitoring:** UptimeRobot, Pingdom
- **Error tracking:** Sentry
- **Analytics:** Google Analytics, Plausible
- **Server monitoring:** New Relic, Datadog

**Regular maintenance:**
- Update Node.js and dependencies monthly
- Backup database weekly
- Monitor disk space and server resources
- Review and respond to RFQs daily
- Update product catalog regularly

---

## 🆘 Support & Resources

**Documentation:**
- Next.js: https://nextjs.org/docs
- MongoDB: https://www.mongodb.com/docs/
- Node.js: https://nodejs.org/docs/

**Deployment Platforms:**
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app/
- DigitalOcean: https://docs.digitalocean.com/

**Need help?**
- Check `/app/ADMIN_GUIDE.md` for admin features
- Review error logs for debugging
- Check Next.js documentation for configuration

---

## 🎯 Post-Deployment

After successful deployment:

1. **Change default password** - Login and update admin credentials
2. **Add real products** - Replace sample products with your inventory
3. **Update company info** - Edit contact details and about page
4. **Test all features** - Ensure everything works in production
5. **Set up backups** - Automate database backups
6. **Configure domain** - Point your domain to the deployment
7. **Set up SSL** - Ensure HTTPS is working
8. **Add to Google Search Console** - For SEO
9. **Create XML sitemap** - For better indexing
10. **Monitor performance** - Set up analytics and monitoring

---

**🎉 Congratulations! Your Gangsar Unitech catalog is now live!**

For questions or issues, refer to the main README.md or project documentation.
