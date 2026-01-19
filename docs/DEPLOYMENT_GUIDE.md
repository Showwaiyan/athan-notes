# Deployment Guide - Athan Notes

Complete step-by-step guide for deploying Athan Notes to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Options](#deployment-options)
4. [Deployment Steps](#deployment-steps)
   - [Option A: Vercel (Recommended)](#option-a-vercel-recommended)
   - [Option B: Netlify](#option-b-netlify)
   - [Option C: Railway](#option-c-railway)
   - [Option D: Docker + VPS](#option-d-docker--vps)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Testing Your Deployment](#testing-your-deployment)
7. [Custom Domain Setup](#custom-domain-setup)
8. [Troubleshooting](#troubleshooting)
9. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

Before deploying, ensure you have:

### Required Accounts

1. **GitHub Account** (for code hosting)
   - Repository: `https://github.com/Showwaiyan/athan-notes`
   - 2FA enabled (recommended)

2. **Google AI Studio Account** (for Gemini API)
   - Get API key: https://makersuite.google.com/app/apikey
   - Free tier available

3. **Notion Account** (for database)
   - Create integration: https://www.notion.so/my-integrations
   - Create database with required schema

4. **Deployment Platform Account** (choose one):
   - Vercel (recommended)
   - Netlify
   - Railway
   - Your own VPS

### Required Information

Gather these before starting:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
NOTION_API_KEY=your_notion_integration_key_here
NOTION_DATABASE_ID=your_database_id_here
APP_USERNAME=your_admin_username
APP_PASSWORD=your_secure_password (will be hashed)
SESSION_SECRET=your_session_secret_64_chars
```

### Local Testing

Verify the app works locally before deploying:

```bash
# Install dependencies
npm install

# Create .env.local file (see Environment Setup)
# Add your environment variables

# Run development server
npm run dev

# Test the app at http://localhost:3000

# Build for production (verify no errors)
npm run build

# Test production build locally
npm start
```

---

## Environment Setup

### 1. Generate Session Secret

Generate a secure 64-character random string for `SESSION_SECRET`:

**Option A: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option B: Using OpenSSL**
```bash
openssl rand -hex 32
```

**Option C: Online Generator**
- Visit: https://generate-secret.vercel.app/32
- Copy the generated hex string

### 2. Hash Your Password

**Generate password hash:**

```bash
# Install bcryptjs temporarily (if not already installed)
npm install bcryptjs

# Create a hash script
node -e "const bcrypt = require('bcryptjs'); const hash = bcrypt.hashSync('YOUR_PASSWORD_HERE', 10); console.log(hash);"
```

**Example output:**
```
$2b$10$RNLyaKjxBEkMi5XiuQGh3uZ6/LDIUhyN2ltHhzxCdigGuVZGSDjHW
```

**IMPORTANT:** When setting this in environment variables:
- **Local (.env.local):** Escape the `$` characters with backslash: `\$2b\$10\$...`
- **Production (Vercel/Netlify):** Use the hash as-is (no escaping): `$2b$10$...`

### 3. Get Notion Database ID

**From Database URL:**

Notion database URL format:
```
https://www.notion.so/workspace/DatabaseName-2ebc0eca76fc80498ca4c45ce5300080?v=...
```

The database ID is: `2ebc0eca76fc80498ca4c45ce5300080`

Or with dashes:
```
https://www.notion.so/workspace/2ebc0eca-76fc-8049-8ca4-c45ce5300080?v=...
```

Use either format (with or without dashes).

### 4. Create .env.local File (Local Development)

Create `.env.local` in your project root:

```bash
# .env.local (for local development)

# Gemini AI API Key
GEMINI_API_KEY=AIzaSy...your_actual_key_here

# Notion Integration
NOTION_API_KEY=ntn_...your_actual_key_here
NOTION_DATABASE_ID=your_database_id_here

# Authentication (Single User)
APP_USERNAME=admin
# IMPORTANT: Escape $ characters with backslash for local development
APP_PASSWORD_HASH=\$2b\$10\$...your_bcrypt_hash_here

# Session Secret (64 characters - generate with: openssl rand -hex 32)
SESSION_SECRET=your_64_character_random_hex_string_here

# Session Duration (in seconds) - 4 days = 345600 seconds
SESSION_MAX_AGE=345600
```

**Verify .env.local is gitignored:**
```bash
# Check .gitignore file contains:
.env*.local
```

---

## Deployment Options

### Comparison Table

| Platform | Difficulty | Cost | Build Time | HTTPS | Custom Domain | Recommendation |
|----------|-----------|------|------------|-------|---------------|----------------|
| **Vercel** | ⭐ Easy | Free tier | ~2 min | Auto | Free | **Best for beginners** |
| **Netlify** | ⭐ Easy | Free tier | ~3 min | Auto | Free | Great alternative |
| **Railway** | ⭐⭐ Medium | Pay-as-you-go | ~4 min | Auto | Paid | Good for scaling |
| **Docker + VPS** | ⭐⭐⭐ Hard | $5-10/mo | ~10 min | Manual | Manual | Full control |

**Recommendation:** Use **Vercel** for easiest deployment with best Next.js support.

---

## Deployment Steps

### Option A: Vercel (Recommended)

**Best for:** Beginners, Next.js apps, free hosting with excellent performance

#### Step 1: Push Code to GitHub

```bash
# Make sure all changes are committed
git status

# If you have uncommitted changes
git add .
git commit -m "Prepare for deployment"

# Push to GitHub
git push origin main
```

#### Step 2: Sign Up for Vercel

1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub account

#### Step 3: Import Project

1. Click "Add New..." → "Project"
2. Find your repository: `athan-notes`
3. Click "Import"

#### Step 4: Configure Project

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `./` (leave default)

**Build Command:** `npm run build` (auto-detected)

**Output Directory:** `.next` (auto-detected)

**Install Command:** `npm install` (auto-detected)

#### Step 5: Add Environment Variables

Click "Environment Variables" section and add:

```bash
# Add these one by one:

GEMINI_API_KEY
Value: your_gemini_api_key_here

NOTION_API_KEY
Value: your_notion_api_key_here

NOTION_DATABASE_ID
Value: your_database_id_here

APP_USERNAME
Value: admin

APP_PASSWORD_HASH
Value: $2b$10$RNLyaKjxBEkMi5XiuQGh3uZ6/LDIUhyN2ltHhzxCdigGuVZGSDjHW
Note: NO backslash escaping on Vercel! Use the hash as-is.

SESSION_SECRET
Value: your_64_character_session_secret_here

SESSION_MAX_AGE
Value: 345600
```

**CRITICAL:** For `APP_PASSWORD_HASH`, do NOT escape the `$` characters on Vercel. Use:
- ✅ `$2b$10$...` (correct)
- ❌ `\$2b\$10\$...` (wrong - only for .env.local)

#### Step 6: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll see: "🎉 Congratulations! Your project has been deployed."

#### Step 7: Get Your URL

Your app is now live at:
```
https://athan-notes-your-username.vercel.app
```

**Test immediately:**
1. Visit the URL
2. Try logging in with your username/password
3. Record a test voice note

---

### Option B: Netlify

**Best for:** Alternative to Vercel, good for static sites

#### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

#### Step 2: Sign Up for Netlify

1. Go to https://app.netlify.com/signup
2. Click "Sign up with GitHub"
3. Authorize Netlify

#### Step 3: Create New Site

1. Click "Add new site" → "Import an existing project"
2. Choose "Deploy with GitHub"
3. Select your repository: `athan-notes`
4. Authorize access if prompted

#### Step 4: Configure Build Settings

**Branch to deploy:** `main`

**Build command:** `npm run build`

**Publish directory:** `.next`

**Note:** Netlify needs the `@netlify/plugin-nextjs` plugin for Next.js

#### Step 5: Add Build Plugin

Add to `netlify.toml` (create in project root):

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Commit and push:
```bash
git add netlify.toml
git commit -m "Add Netlify configuration"
git push origin main
```

#### Step 6: Add Environment Variables

In Netlify dashboard:
1. Go to "Site settings" → "Environment variables"
2. Click "Add a variable"
3. Add each variable (same as Vercel, no escaping for password hash):

```
GEMINI_API_KEY = your_key
NOTION_API_KEY = your_key
NOTION_DATABASE_ID = your_id
APP_USERNAME = admin
APP_PASSWORD_HASH = $2b$10$... (no escaping)
SESSION_SECRET = your_secret
SESSION_MAX_AGE = 345600
```

#### Step 7: Deploy

1. Click "Deploy site"
2. Wait for build to complete
3. Your app will be live at: `https://athan-notes.netlify.app`

---

### Option C: Railway

**Best for:** Apps needing databases, background workers, pay-as-you-go pricing

#### Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Click "Login with GitHub"
3. Authorize Railway

#### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `athan-notes`

#### Step 3: Configure Environment Variables

1. Click on your service
2. Go to "Variables" tab
3. Click "Raw Editor"
4. Paste all variables:

```bash
GEMINI_API_KEY=your_key
NOTION_API_KEY=your_key
NOTION_DATABASE_ID=your_id
APP_USERNAME=admin
APP_PASSWORD_HASH=$2b$10$... (no escaping)
SESSION_SECRET=your_secret
SESSION_MAX_AGE=345600
```

#### Step 4: Deploy

1. Railway auto-deploys on git push
2. Wait for build to complete (3-5 minutes)
3. Click "Generate Domain" to get your public URL

**Your app URL:**
```
https://athan-notes-production.up.railway.app
```

**Pricing Note:** Railway charges based on usage (~$5/month for small apps).

---

### Option D: Docker + VPS

**Best for:** Full control, self-hosting, advanced users

#### Step 1: Create Dockerfile

Create `Dockerfile` in project root:

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

#### Step 2: Update next.config.ts

Add output configuration:

```typescript
const nextConfig: NextConfig = {
  output: 'standalone', // Enable standalone output for Docker
  // ... rest of config
};
```

#### Step 3: Create docker-compose.yml

```yaml
# docker-compose.yml
version: '3.8'

services:
  athan-notes:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - NOTION_API_KEY=${NOTION_API_KEY}
      - NOTION_DATABASE_ID=${NOTION_DATABASE_ID}
      - APP_USERNAME=${APP_USERNAME}
      - APP_PASSWORD_HASH=${APP_PASSWORD_HASH}
      - SESSION_SECRET=${SESSION_SECRET}
      - SESSION_MAX_AGE=${SESSION_MAX_AGE}
    restart: unless-stopped
```

#### Step 4: Create .env File for Docker

Create `.env` (NOT .env.local) in project root:

```bash
GEMINI_API_KEY=your_key
NOTION_API_KEY=your_key
NOTION_DATABASE_ID=your_id
APP_USERNAME=admin
APP_PASSWORD_HASH=$2b$10$... (no escaping)
SESSION_SECRET=your_secret
SESSION_MAX_AGE=345600
```

**Add .env to .gitignore:**
```bash
echo ".env" >> .gitignore
```

#### Step 5: Build and Run Locally

```bash
# Build Docker image
docker-compose build

# Run container
docker-compose up -d

# Check logs
docker-compose logs -f

# Test at http://localhost:3000
```

#### Step 6: Deploy to VPS

**A. Using DigitalOcean Droplet ($6/month)**

1. Create Droplet with Docker pre-installed
2. SSH into server:
   ```bash
   ssh root@your_server_ip
   ```

3. Install Docker (if not pre-installed):
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

4. Clone repository:
   ```bash
   git clone https://github.com/Showwaiyan/athan-notes.git
   cd athan-notes
   ```

5. Create .env file on server:
   ```bash
   nano .env
   # Paste your environment variables
   # Save: Ctrl+X, Y, Enter
   ```

6. Build and run:
   ```bash
   docker-compose up -d
   ```

7. Access at: `http://your_server_ip:3000`

**B. Set Up Reverse Proxy with Nginx (for HTTPS)**

1. Install Nginx:
   ```bash
   apt update
   apt install nginx certbot python3-certbot-nginx -y
   ```

2. Create Nginx config:
   ```bash
   nano /etc/nginx/sites-available/athan-notes
   ```

   Paste:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

3. Enable site:
   ```bash
   ln -s /etc/nginx/sites-available/athan-notes /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

4. Get SSL certificate:
   ```bash
   certbot --nginx -d your-domain.com
   ```

5. Access at: `https://your-domain.com`

---

## Post-Deployment Configuration

### 1. Enable HSTS (HTTPS Strict Transport Security)

**After confirming HTTPS works**, enable HSTS in `next.config.ts`:

```typescript
headers: [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  // ... other headers
]
```

Redeploy after making this change.

### 2. Configure Notion Database Permissions

1. Open your Notion database
2. Click "..." → "Connections" → "Add connection"
3. Select your integration
4. Verify the integration can:
   - Read database
   - Create pages
   - Update pages

### 3. Test All Features

**Login Test:**
1. Go to `/login`
2. Enter credentials
3. Verify successful login

**Voice Recording Test:**
1. Record a 10-second Burmese voice note
2. Click "Process & Save to Notion"
3. Verify page appears in Notion database
4. Check all fields are populated correctly

**Rate Limiting Test:**
1. Logout
2. Try logging in with wrong password 6 times
3. Verify you see: "Too many login attempts. Please try again in X minutes."

**PWA Test:**
1. Open app on mobile browser
2. Look for "Install" prompt
3. Install to home screen
4. Open from home screen (should open fullscreen)

### 4. Set Up GitHub Branch Protection (Optional)

1. Go to repository Settings → Branches
2. Add branch protection rule for `main`
3. Enable:
   - ✅ Require pull request before merging
   - ✅ Require status checks to pass
   - ✅ Require conversation resolution before merging

---

## Testing Your Deployment

### Quick Test Checklist

```bash
# 1. Check if site is accessible
curl -I https://your-app-url.com

# Expected: HTTP 200 OK

# 2. Check security headers
curl -I https://your-app-url.com | grep -i "x-frame-options\|content-security-policy"

# Expected: Should see security headers

# 3. Test login endpoint
curl -X POST https://your-app-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"wrong","password":"wrong"}'

# Expected: {"error":"Invalid username or password","remainingAttempts":4}

# 4. Test rate limiting (run this 6 times)
for i in {1..6}; do
  curl -X POST https://your-app-url.com/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"test","password":"test"}'
  echo ""
done

# Expected: Last request should return HTTP 429 Too Many Requests
```

### Full Feature Test

1. **Authentication Flow**
   - [ ] Login page loads
   - [ ] Wrong password shows error
   - [ ] Correct password logs in
   - [ ] Logout works
   - [ ] Can't access main page without login

2. **Voice Recording**
   - [ ] Microphone permission requested
   - [ ] Recording starts and shows timer
   - [ ] Pause/Resume works
   - [ ] Stop recording works
   - [ ] Audio blob created

3. **AI Processing**
   - [ ] "Process & Save to Notion" button works
   - [ ] Loading state shows "Processing with Gemini AI..."
   - [ ] Success shows processed note
   - [ ] Title, content, category, tags displayed correctly
   - [ ] Notion URL link works

4. **Notion Integration**
   - [ ] Page created in Notion database
   - [ ] All properties filled correctly
   - [ ] Content appears in page body
   - [ ] Category icon shows correctly
   - [ ] Tags are created

5. **PWA Features**
   - [ ] Install prompt shows on mobile
   - [ ] App installs to home screen
   - [ ] Opens fullscreen (no browser chrome)
   - [ ] Works offline (basic UI)
   - [ ] Icon shows correctly on home screen

6. **Security Features**
   - [ ] Rate limiting active (6th login attempt blocked)
   - [ ] Security headers present (check with curl)
   - [ ] HTTPS working (green lock in browser)
   - [ ] Session persists across page refreshes
   - [ ] Logout clears session

---

## Custom Domain Setup

### Vercel Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Enter your domain: `notes.yourdomain.com`
3. Add DNS records at your domain provider:

**For subdomain (notes.yourdomain.com):**
```
Type: CNAME
Name: notes
Value: cname.vercel-dns.com
```

**For apex domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

4. Wait for DNS propagation (5-60 minutes)
5. SSL certificate auto-issues (2-5 minutes)

### Netlify Custom Domain

1. Go to Netlify Dashboard → Site Settings → Domain Management
2. Click "Add custom domain"
3. Enter domain: `notes.yourdomain.com`
4. Add DNS records:

```
Type: CNAME
Name: notes
Value: your-site-name.netlify.app
```

5. Wait for DNS propagation
6. SSL auto-issues via Let's Encrypt

### Railway Custom Domain

1. Go to Railway Dashboard → Your Service → Settings
2. Click "Generate Domain" (get Railway domain first)
3. Click "Custom Domain"
4. Enter your domain
5. Add DNS record:

```
Type: CNAME
Name: notes
Value: your-app.up.railway.app
```

### VPS Custom Domain (with Nginx)

1. Point domain to your VPS IP:

```
Type: A
Name: notes (or @ for apex)
Value: your_server_ip
```

2. Update Nginx config:
```nginx
server_name notes.yourdomain.com;
```

3. Get SSL certificate:
```bash
certbot --nginx -d notes.yourdomain.com
```

---

## Troubleshooting

### Build Failures

**Error: "Module not found"**
```bash
# Solution: Install missing dependencies
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

**Error: "Environment variable not set"**
```bash
# Solution: Check all env vars are added in deployment platform
# Required: GEMINI_API_KEY, NOTION_API_KEY, NOTION_DATABASE_ID, 
#           APP_USERNAME, APP_PASSWORD_HASH, SESSION_SECRET
```

**Error: "Build exceeded time limit"**
```bash
# Solution: Increase build timeout in deployment settings
# Vercel: Project Settings → General → Build & Development Settings
# Increase "Build Timeout" to 300 seconds
```

### Login Issues

**Can't log in with correct password**

Check password hash format:
- Vercel/Netlify/Railway: Use hash as-is (`$2b$10$...`)
- Local (.env.local): Escape dollars (`\$2b\$10\$...`)

Regenerate hash:
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YOUR_PASSWORD', 10));"
```

Update in deployment platform environment variables.

**Rate limiting blocks legitimate logins**

If you get locked out:
1. Wait 15 minutes for rate limit to reset
2. Or restart your deployment to clear in-memory rate limit store
3. For permanent solution, consider Redis-backed rate limiting

### Notion Integration Issues

**Error: "Failed to create Notion page"**

1. Check Notion API key is valid:
   ```bash
   curl https://api.notion.com/v1/users/me \
     -H "Authorization: Bearer YOUR_NOTION_API_KEY" \
     -H "Notion-Version: 2022-06-28"
   ```

2. Verify database ID is correct (copy from database URL)

3. Check integration has access to database:
   - Open database in Notion
   - Click "..." → "Connections"
   - Verify your integration is connected

4. Check database schema matches required properties:
   - Name (title)
   - Summary (text)
   - Category (select)
   - Tags (multi-select)

**Error: "Invalid category"**

Categories must match exactly:
- Check `config/categories.json` for allowed categories
- Gemini must return exact category names
- Case-sensitive matching

### Gemini API Issues

**Error: "GEMINI_API_KEY not defined"**

1. Verify environment variable is set
2. Check spelling: `GEMINI_API_KEY` (not `GEMINI_KEY`)
3. Test API key:
   ```bash
   curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_KEY" \
     -H 'Content-Type: application/json' \
     -d '{"contents":[{"parts":[{"text":"test"}]}]}'
   ```

**Error: "Quota exceeded"**

Gemini free tier limits:
- 15 requests per minute
- 1,500 requests per day

Solutions:
- Wait for quota to reset
- Upgrade to paid tier
- Implement request queuing

### PWA Issues

**Install prompt doesn't show**

Requirements:
- HTTPS (localhost is OK for testing)
- Valid manifest.json
- Service worker registered
- App meets installability criteria

Check in Chrome DevTools:
1. Application tab → Manifest
2. Verify all icons load
3. Check Service Worker is registered

**App doesn't work offline**

PWA caching strategy:
- API routes: NetworkFirst (requires internet)
- Static assets: CacheFirst (works offline)
- Voice recording requires microphone (online/offline both work)

For offline recording: Audio is processed online (requires Gemini API).

### Performance Issues

**Slow audio processing**

Gemini processing time: 3-10 seconds for 1-minute audio

Optimization:
- Use Gemini 2.0 Flash (fastest model)
- Compress audio before upload (max 50MB)
- Check network speed (server → Google AI)

**High memory usage**

Audio files are processed in-memory:
- Max 50MB per file = ~50MB RAM per request
- Rate limiting prevents memory exhaustion
- Files not stored (ephemeral processing)

For high traffic: Consider upgrading server memory or implementing file streaming.

---

## Monitoring & Maintenance

### Set Up Monitoring

**1. Vercel Analytics (Recommended)**

Enable in Vercel Dashboard:
1. Project Settings → Analytics
2. Enable Web Analytics
3. View real-time traffic, performance metrics

**2. Sentry Error Tracking (Optional)**

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Add to environment variables:
```
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

**3. Uptime Monitoring**

Use UptimeRobot (free):
1. Sign up: https://uptimerobot.com
2. Add monitor for your app URL
3. Get alerts if site goes down

### Regular Maintenance

**Weekly:**
- [ ] Check deployment logs for errors
- [ ] Review failed login attempts (if logging implemented)
- [ ] Test voice recording → Notion flow

**Monthly:**
- [ ] Run `npm audit` and update vulnerable packages
- [ ] Review rate limiting logs
- [ ] Check Gemini API usage (quota)
- [ ] Verify Notion integration still connected
- [ ] Test PWA installation on mobile

**Quarterly:**
- [ ] Review and update dependencies
- [ ] Re-run security audit
- [ ] Check for Next.js updates
- [ ] Review security headers (new standards)
- [ ] Update Node.js version if needed

### Backup Strategy

**What to backup:**
1. ✅ **Code:** Already on GitHub
2. ✅ **Notion data:** Already in Notion (cloud backup)
3. ⚠️ **Environment variables:** Store securely (password manager)

**Export Notion database:**
1. Open database
2. Click "..." → "Export"
3. Choose Markdown & CSV
4. Download backup
5. Store securely (encrypt if needed)

### Update Procedure

**For minor updates (bug fixes):**
```bash
# 1. Pull latest changes
git pull origin main

# 2. Install dependencies
npm install

# 3. Test locally
npm run build
npm start

# 4. Push to deploy
git push origin main
```

**For major updates (new features):**
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes
# ... edit files ...

# 3. Test locally
npm run build
npm run test  # if tests exist

# 4. Push and create PR
git push origin feature/new-feature

# 5. Review and merge PR
# Deployment happens automatically
```

---

## Security Checklist

Before going to production, verify:

### Environment Security
- [ ] All environment variables set correctly
- [ ] `.env.local` in `.gitignore`
- [ ] No secrets committed to Git
- [ ] `APP_PASSWORD_HASH` format correct for platform
- [ ] `SESSION_SECRET` is 64+ random characters

### Application Security
- [ ] HTTPS enabled (green lock in browser)
- [ ] Security headers present (check with curl)
- [ ] Rate limiting active (test 6 failed logins)
- [ ] Login redirects work correctly
- [ ] Logout clears session
- [ ] Can't access protected routes without login

### API Security
- [ ] Gemini API key valid and working
- [ ] Notion API key valid and working
- [ ] Notion database accessible
- [ ] File upload size limits enforced (50MB)
- [ ] MIME type validation working

### Production Best Practices
- [ ] Enable HSTS header (after HTTPS confirmed)
- [ ] Set up error monitoring (Sentry/similar)
- [ ] Configure uptime monitoring
- [ ] Enable Dependabot for security updates
- [ ] Document environment variables securely
- [ ] Test disaster recovery (can redeploy from scratch)

---

## Next Steps After Deployment

1. **Share with users:**
   - Send them the URL
   - Provide login credentials securely
   - Share user guide (see INSTALLATION_GUIDE.md)

2. **Monitor usage:**
   - Check analytics daily (first week)
   - Review error logs
   - Watch for rate limit triggers

3. **Gather feedback:**
   - Ask users about experience
   - Track common issues
   - Plan improvements

4. **Plan scaling:**
   - Monitor API quota usage
   - Check server resources
   - Consider Redis rate limiting if needed
   - Plan for multiple users (if needed)

---

## Getting Help

### Official Documentation
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- Gemini API: https://ai.google.dev/docs
- Notion API: https://developers.notion.com

### Common Issues
- Check `docs/TROUBLESHOOTING.md` (if created)
- Review `docs/SECURITY_AUDIT_REPORT.md`
- See GitHub Issues: https://github.com/Showwaiyan/athan-notes/issues

### Support
- Create issue on GitHub repository
- Check deployment platform status pages
- Review application logs in deployment dashboard

---

**Deployment Guide Version:** 1.0  
**Last Updated:** January 19, 2026  
**Tested Platforms:** Vercel, Netlify, Railway, Docker  
**Next.js Version:** 16.1.2
