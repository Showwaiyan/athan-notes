# Deployment Guide - Athan Notes

Complete step-by-step guide for deploying your own instance of Athan Notes.

---

## Table of Contents

1. [Overview](#overview)
2. [Step 1: Fork the Repository](#step-1-fork-the-repository)
3. [Step 2: Clone Your Fork](#step-2-clone-your-fork)
4. [Step 3: Generate Credentials](#step-3-generate-credentials)
5. [Step 4: Set Up Notion](#step-4-set-up-notion)
6. [Step 5: Get Gemini API Key](#step-5-get-gemini-api-key)
7. [Step 6: Deploy to Vercel](#step-6-deploy-to-vercel)
8. [Step 7: Test Your Deployment](#step-7-test-your-deployment)
9. [Customization](#customization)
10. [Troubleshooting](#troubleshooting)
11. [Maintenance](#maintenance)

---

## Overview

This guide will help you deploy your own instance of Athan Notes. You'll:

1. **Fork** the repository (create your own copy)
2. **Clone** to your local machine
3. **Generate** secure credentials (password hash, session secret)
4. **Configure** Notion and Gemini API
5. **Deploy** to Vercel
6. **Test** and start using!

**Time Required:** 15-20 minutes  
**Skill Level:** Beginner-friendly  
**Cost:** Free (Vercel free tier)

---

## Step 1: Fork the Repository

Forking creates your own copy of the repository where you can make customizations.

### Instructions

1. **Go to the original repository:**
   ```
   https://github.com/Showwaiyan/athan-notes
   ```

2. **Click the "Fork" button** (top-right corner)
   ```
   ┌─────────────────────────────────┐
   │  Showwaiyan / athan-notes       │
   │  ⭐ Star    🍴 Fork    ▼ Code   │  ← Click Fork
   └─────────────────────────────────┘
   ```

3. **Choose where to fork:**
   - Select your GitHub account
   - Keep the repository name as `athan-notes` (or rename if you want)
   - Optional: Add a description
   - Click "Create fork"

4. **Your fork is created!**
   ```
   https://github.com/YOUR_USERNAME/athan-notes
   ```

**Why fork?**
- ✅ You can customize categories, colors, etc.
- ✅ You can update your instance independently
- ✅ You maintain full control over your deployment
- ✅ Easy to pull future updates from original repo

---

## Step 2: Clone Your Fork

Clone the repository to your local computer to generate credentials.

### Prerequisites

**Install these tools if you don't have them:**

- **Git:** https://git-scm.com/downloads
- **Node.js 20+:** https://nodejs.org/en/download/

**Verify installations:**
```bash
git --version
# Should show: git version 2.x.x

node --version
# Should show: v20.x.x or higher

npm --version
# Should show: 10.x.x or higher
```

### Clone Instructions

1. **Open Terminal** (Mac/Linux) or **Command Prompt** (Windows)

2. **Navigate to where you want the project:**
   ```bash
   cd ~/Documents  # or wherever you want
   ```

3. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/athan-notes.git
   ```
   Replace `YOUR_USERNAME` with your GitHub username

4. **Enter the project directory:**
   ```bash
   cd athan-notes
   ```

5. **Install dependencies:**
   ```bash
   npm install
   ```
   Wait for installation to complete (~1-2 minutes)

**Successful output:**
```
added 234 packages in 45s
```

---

## Step 3: Generate Credentials

You need to generate secure credentials for your deployment.

### 3.1 Generate Session Secret

The session secret encrypts user sessions. Use the provided script to generate a 64-character random string:

```bash
npm run generate-secret
```

**Example output:**
```
Your SESSION_SECRET:
7c8b4675692454e3997e0e734fbef969d6078ff9f211ad79dfe75c4b6a7be3be

Use this value for SESSION_SECRET environment variable
```

**📋 Copy this value** - you'll need it later as `SESSION_SECRET`

### 3.2 Generate Password Hash

Choose a strong password and generate a bcrypt hash using the provided script:

```bash
npm run hash-password YourSecurePassword123
```

**Example output:**
```
Your password hash:
$2b$10$RNLyaKjxBEkMi5XiuQGh3uZ6/LDIUhyN2ltHhzxCdigGuVZGSDjHW

Use this value for APP_PASSWORD_HASH environment variable
```

**📋 Copy this hash** - you'll need it as `APP_PASSWORD_HASH`

**⚠️ IMPORTANT NOTES:**
- DO NOT commit this hash to GitHub
- Keep your password secure (use a password manager)
- You can use the hash as-is everywhere (local or production) - the app handles escaping automatically

### 3.3 Choose Username

Pick a username for login (default is `admin`):

```bash
APP_USERNAME=admin
```

You can change this to anything you want (e.g., your name).

### Summary - Credentials Generated

At this point you should have:

```bash
✅ SESSION_SECRET=7c8b4675692454e3997e0e734fbef969d6078ff9f211ad79dfe75c4b6a7be3be
✅ APP_USERNAME=admin
✅ APP_PASSWORD_HASH=$2b$10$RNLyaKjxBEkMi5XiuQGh3uZ6/LDIUhyN2ltHhzxCdigGuVZGSDjHW
```

**Save these somewhere safe** (password manager recommended).

---

## Step 4: Set Up Notion

Create a Notion database and integration to store your notes.

### 4.1 Create Notion Integration

1. **Go to Notion Integrations:**
   ```
   https://www.notion.so/my-integrations
   ```

2. **Click "+ New integration"**

3. **Fill in details:**
   - Name: `Athan Notes` (or any name)
   - Associated workspace: Select your workspace
   - Type: Internal integration
   - Capabilities: Keep defaults (Read, Update, Insert)

4. **Click "Submit"**

5. **Copy the API key:**
   ```
   Secret: ntn_xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   **📋 Save this as `NOTION_API_KEY`**

### 4.2 Create Notion Database

1. **Open Notion** and create a new page

2. **Create a database:**
   - Type `/database` and select "Table - Inline/Fullpage"
   - Or click "+ New" → "Table"

3. **Add required properties:**

   | Property Name | Property Type | Description |
   |---------------|---------------|-------------|
   | **Name** | Title | Note title (auto-created, no need to create) |
   | **Summary** | Text | Brief summary |
   | **Category** | Select | Note category |
   | **Tags** | Multi-select | Keywords/tags |

4. **Add Category options:**
   
   Click on "Category" property → Edit property → Add these options:
   - Project
   - Learning
   - Personal
   - Task
   - (Or customize - see `config/categories.json`)

5. **Connect integration to database:**
   - Click "..." (top-right of database)
   - Select "Connections"
   - Click "+ Add connections"
   - Select your "Athan Notes" integration
   - Click "Confirm"

### 4.3 Get Database ID

**From the database URL:**

Open your database, copy the URL:
```
https://www.notion.so/workspace/DatabaseName-abc123def456?v=...
```

The database ID is the part between last `/` and `?`:
```
abc123def456
```

Or if the URL has dashes:
```
https://www.notion.so/workspace/abc123de-f456-7890-abcd-ef1234567890?v=...
```

Database ID: `abc123def4567890abcdef1234567890` (with or without dashes works)

**📋 Save this as `NOTION_DATABASE_ID`**

### Summary - Notion Setup Complete

You should now have:

```bash
✅ NOTION_API_KEY=ntn_xxxxxxxxxxxxxxxxxxxxxxxxxx
✅ NOTION_DATABASE_ID=abc123def456...
```

---

## Step 5: Get Gemini API Key

Get a free API key from Google AI Studio.

### Instructions

1. **Go to Google AI Studio:**
   ```
   https://makersuite.google.com/app/apikey
   ```

2. **Sign in** with your Google account

3. **Click "Create API Key"**

4. **Select a project** (or create new one)

5. **Copy the API key:**
   ```
   AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   **📋 Save this as `GEMINI_API_KEY`**

### Free Tier Limits

- 15 requests per minute
- 1,500 requests per day
- Sufficient for personal use

**For higher limits:** Upgrade to paid tier in Google Cloud Console

### Summary - All Environment Variables Ready

You should now have all required environment variables:

```bash
✅ GEMINI_API_KEY=AIzaSy...
✅ NOTION_API_KEY=ntn_...
✅ NOTION_DATABASE_ID=abc123...
✅ APP_USERNAME=admin
✅ APP_PASSWORD_HASH=$2b$10$...
✅ SESSION_SECRET=7c8b4675...
```

---

## Step 6: Deploy to Vercel

Vercel is the recommended platform for deploying Athan Notes. It's made by the creators of Next.js and offers:

- ✅ **Free tier** with generous limits
- ✅ **Automatic HTTPS** - secure by default
- ✅ **Global CDN** - fast worldwide
- ✅ **Easy deployment** - just connect GitHub
- ✅ **Auto-deploy** - updates when you push code

### Step 1: Sign Up for Vercel

1. Go to: https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access your GitHub account

### Step 2: Import Your Fork

1. **Click "Add New..." → "Project"**
2. **Find your forked repository:** `YOUR_USERNAME/athan-notes`
3. **Click "Import"**

### Step 3: Configure Project

**Framework Preset:** Next.js ✅ (auto-detected)

**Root Directory:** `./` (default)

**Build Settings:** (leave as default)
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### Step 4: Add Environment Variables

Click "Environment Variables" and add these:

```bash
GEMINI_API_KEY
Paste your Gemini API key (starts with AIzaSy...)

NOTION_API_KEY
Paste your Notion API key (starts with ntn_...)

NOTION_DATABASE_ID
Paste your database ID (32 chars)

APP_USERNAME
admin (or your chosen username)

APP_PASSWORD_HASH
Paste the bcrypt hash exactly as generated (starts with $2b$10$...)

SESSION_SECRET
Paste your 64-character session secret

SESSION_MAX_AGE
345600
```

**Note:** Paste the `APP_PASSWORD_HASH` exactly as generated by the script. The app automatically handles any special character escaping needed.

### Step 5: Deploy

1. **Click "Deploy"**
2. **Wait 2-3 minutes** for build to complete
3. **You'll see:** "🎉 Congratulations! Your project has been deployed."

### Step 6: Get Your URL

Your app is now live at:
```
https://athan-notes-YOUR_USERNAME.vercel.app
```

**Test it:**
1. Click the URL
2. You should see the login page
3. Log in with your username and password

✅ **Deployment complete!**

---

## Step 7: Test Your Deployment

Verify everything works correctly.

### Quick Test Checklist

**1. Login Test:**
- [ ] Go to your deployment URL
- [ ] You see the login page
- [ ] Enter your username and password
- [ ] Successfully logged in

**2. Voice Recording Test:**
- [ ] Click "Start Recording"
- [ ] Browser asks for microphone permission
- [ ] Grant permission
- [ ] Speak for 10 seconds in Burmese or English
- [ ] Click "Stop"
- [ ] Click "Process & Save to Notion"
- [ ] Wait 5-10 seconds
- [ ] See transcribed note with title, category, tags

**3. Notion Integration Test:**
- [ ] Click "Open in Notion" button
- [ ] Notion page opens
- [ ] All fields populated (title, summary, category, tags)
- [ ] Content appears in page body

**4. Rate Limiting Test:**
- [ ] Logout
- [ ] Try logging in with wrong password 6 times
- [ ] See error: "Too many login attempts. Please try again in X minutes."

**5. PWA Installation Test (Mobile):**
- [ ] Open app on mobile browser
- [ ] See "Install" prompt
- [ ] Install to home screen
- [ ] Open from home screen (fullscreen mode)

### If All Tests Pass ✅

Congratulations! Your Athan Notes instance is successfully deployed and working.

### If Tests Fail ❌

See [Troubleshooting](#troubleshooting) section below.

---

## Customization

Make Athan Notes your own by customizing categories, colors, and more.

### Customize Categories

1. **Edit the categories file:**
   ```bash
   # On your local machine
   nano config/categories.json
   ```

2. **Modify categories:**
   ```json
   {
     "categories": [
       {
         "name": "Work",
         "description": "Work-related notes and tasks",
         "icon": "💼"
       },
       {
         "name": "Personal",
         "description": "Personal thoughts and ideas",
         "icon": "🌟"
       }
     ]
   }
   ```

3. **Update Notion database:**
   - Add the same category names to your Notion database "Category" property
   - Match the names exactly (case-sensitive)

4. **Commit and push:**
   ```bash
   git add config/categories.json
   git commit -m "Customize categories"
   git push origin main
   ```

5. **Redeploy** (automatic on Vercel/Netlify/Railway)

**See:** `docs/CUSTOMIZE_CATEGORIES.md` for detailed instructions

### Other Customizations

**Change app title/description:**
- Edit `app/layout.tsx` metadata

**Change colors/theme:**
- Edit `app/globals.css`

**Change PWA icons:**
- Replace files in `public/` directory

**After changes:**
```bash
git add .
git commit -m "Describe your changes"
git push origin main
```

Platform will auto-redeploy with your changes.

---

## Troubleshooting

### Build Failures

**Error: "Module not found"**
```bash
# Solution: Install dependencies locally and commit package-lock.json
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push origin main
```

**Error: "Environment variable not set"**
- Check all 6 required environment variables are added
- Verify no typos in variable names
- Check values don't have extra spaces or quotes

**Error: "Build timeout"**
- Increase timeout in platform settings
- Vercel: Project Settings → Build timeout → 300 seconds

### Login Issues

**Can't log in with correct password:**

1. **Verify you're using the correct password** that you hashed

2. **Regenerate hash if needed:**
   ```bash
   npm run hash-password YourPassword123
   ```

3. **Update environment variable** on your platform

4. **Redeploy** if needed

**Note:** The app automatically handles password hash formatting, so you can paste the hash exactly as generated.

**Rate limited out:**
- Wait 15 minutes for rate limit to reset
- Or restart deployment to clear in-memory store

### Notion Integration Issues

**"Failed to create Notion page"**

1. **Verify API key:**
   ```bash
   curl https://api.notion.com/v1/users/me \
     -H "Authorization: Bearer YOUR_NOTION_API_KEY" \
     -H "Notion-Version: 2022-06-28"
   ```

2. **Check database connection:**
   - Open database in Notion
   - Click "..." → "Connections"
   - Verify integration is connected

3. **Check database ID:**
   - Copy from database URL
   - Should be 32 characters (with or without dashes)

4. **Verify database schema:**
   - Name (title property)
   - Summary (text property)
   - Category (select property)
   - Tags (multi-select property)

### Gemini API Issues

**"API key invalid"**

Test your key:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY"
```

Should return list of models, not an error.

**"Quota exceeded"**

Free tier limits:
- 15 requests/minute
- 1,500 requests/day

Solutions:
- Wait for quota reset
- Upgrade to paid tier

### Vercel Deployment Issues

**Build failed:**
- Check build logs: Project → Deployments → Click deployment → Logs
- Common issues:
  - Environment variables not set correctly
  - Missing dependencies in package.json
  - Build timeout (increase in Project Settings)

**App not loading:**
- Verify all 7 environment variables are set
- Check for typos in variable names
- Ensure no extra spaces or quotes in values
- Redeploy from Vercel dashboard

**Environment variable changes not working:**
- After changing environment variables, you must redeploy
- Go to Deployments → Click "..." → "Redeploy"

---

## Maintenance

### Regular Tasks

**Weekly:**
- [ ] Test voice recording → Notion flow
- [ ] Check deployment is accessible
- [ ] Review any error logs

**Monthly:**
- [ ] Check for security updates:
  ```bash
  npm audit
  ```
- [ ] Update dependencies if needed:
  ```bash
  npm update
  git add package-lock.json
  git commit -m "Update dependencies"
  git push
  ```

**Quarterly:**
- [ ] Review Gemini API usage/quota
- [ ] Check Notion integration still connected
- [ ] Test all features end-to-end

### Updating Your Instance

**Pull updates from original repository:**

```bash
# Add original repo as upstream (one-time)
git remote add upstream https://github.com/Showwaiyan/athan-notes.git

# Fetch latest changes
git fetch upstream

# Merge into your fork
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

**Platform auto-redeploys** with new changes on Vercel.

### Backup

**Your data is safe:**
- ✅ Code: On GitHub (your fork)
- ✅ Notes: In Notion (Notion's backup)
- ✅ Audio: Not stored (ephemeral processing)

**To backup Notion database:**
1. Open database
2. Click "..." → "Export"
3. Choose Markdown & CSV
4. Download and store securely

### Getting Help

**Check documentation:**
- `docs/SECURITY.md` - Security features
- `docs/SECURITY_AUDIT_REPORT.md` - Security details
- `docs/INSTALLATION_GUIDE.md` - User guide

**Create an issue:**
- https://github.com/Showwaiyan/athan-notes/issues

**Check deployment logs:**
- Vercel: Project → Deployments → Click deployment → View Logs

---

## Summary

### Deployment Workflow

```
1. Fork repository on GitHub
   ↓
2. Clone to local machine
   ↓
3. Generate credentials (password hash, session secret)
   ↓
4. Set up Notion (integration + database)
   ↓
5. Get Gemini API key
   ↓
6. Deploy to Vercel
   ↓
7. Add environment variables
   ↓
8. Test deployment
   ↓
9. Start using! 🎉
```

### Required Environment Variables

```bash
GEMINI_API_KEY          # From Google AI Studio
NOTION_API_KEY          # From Notion integrations
NOTION_DATABASE_ID      # From Notion database URL
APP_USERNAME            # Your chosen username
APP_PASSWORD_HASH       # Generated with bcrypt
SESSION_SECRET          # 64-char random string
SESSION_MAX_AGE         # 345600 (4 days in seconds)
```

### Quick Links

- **Original Repo:** https://github.com/Showwaiyan/athan-notes
- **Google AI Studio:** https://makersuite.google.com/app/apikey
- **Notion Integrations:** https://www.notion.so/my-integrations
- **Vercel:** https://vercel.com

---

**Deployment Guide Version:** 2.1  
**Last Updated:** January 19, 2026  
**Workflow:** Fork → Clone → Generate → Deploy to Vercel  
**Platform:** Vercel (Recommended)
