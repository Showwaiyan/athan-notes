# Installation & Usage Guide - Athan Notes

User guide for installing and using Athan Notes PWA on your device.

---

## Table of Contents

1. [What is Athan Notes?](#what-is-athan-notes)
2. [System Requirements](#system-requirements)
3. [Installation Instructions](#installation-instructions)
   - [iOS (iPhone/iPad)](#ios-iphoneipad)
   - [Android](#android)
   - [Desktop (Chrome/Edge)](#desktop-chromeedge)
4. [How to Use](#how-to-use)
5. [Troubleshooting](#troubleshooting)
6. [Tips & Best Practices](#tips--best-practices)

---

## What is Athan Notes?

Athan Notes is a Progressive Web App (PWA) that converts your voice notes into organized text notes in Notion.

### Key Features

- 🎙️ **Voice Recording** - Record up to 15 minutes
- 🤖 **AI Transcription** - Powered by Google Gemini 2.5 Flash
- ✨ **Smart Correction** - Fixes spelling, removes filler words
- 📂 **Auto-Categorization** - AI picks the right category
- 🏷️ **Tag Generation** - Automatic English tags
- 📝 **Notion Sync** - Saves directly to your Notion database
- 📱 **Works Like an App** - Install on any device
- 🔒 **Secure** - Password protected with rate limiting

---

## System Requirements

### Mobile
- **iOS:** 14.5+ (iPhone 6S or newer)
- **Android:** 8.0+ (released 2017 or newer)
- **Browser:** Safari (iOS), Chrome (Android)

### Desktop
- **OS:** Windows 10+, macOS 10.15+, Linux
- **Browser:** Chrome 90+, Edge 90+

### Required
- ✅ Internet connection (for AI processing)
- ✅ Microphone (built-in or external)
- ✅ Microphone permission

---

## Installation Instructions

### iOS (iPhone/iPad)

**Must use Safari browser** (not Chrome/Firefox)

#### Step 1: Open in Safari

1. Open **Safari** browser
2. Visit your deployment URL (provided by admin)
3. Wait for page to load

#### Step 2: Add to Home Screen

1. **Tap Share button** (□ with arrow pointing up)
   - iPhone: Bottom center
   - iPad: Top right

2. **Scroll down** and tap **"Add to Home Screen"**

3. **Edit name** (optional):
   - Default: "Athan Notes"
   - Or shorten to just "Athan"

4. **Tap "Add"** (top right)

#### Step 3: Open the App

1. Go to **Home Screen**
2. Find **Athan Notes icon**
3. **Tap to open** (opens fullscreen, no browser bars)

**Visual Guide:**
```
Safari → Share Button (□↑) → Add to Home Screen → Add
```

**Troubleshooting:**
- No "Add to Home Screen"? Check you're using Safari
- Icon doesn't appear? Check last home screen page
- Opens in Safari? Delete and reinstall

---

### Android

**Use Chrome browser** (recommended)

#### Step 1: Open in Chrome

1. Open **Chrome** browser
2. Visit your deployment URL
3. Wait for page to load

#### Step 2: Install (Automatic Prompt)

**Option A: Accept popup prompt**
```
┌─────────────────────────┐
│ Add Athan Notes to      │
│ Home screen?            │
│                         │
│ [Later]    [Install]    │ ← Tap Install
└─────────────────────────┘
```

**Option B: Manual install**
1. Tap **3-dot menu** (⋮) in top-right
2. Select **"Add to Home screen"** or **"Install app"**
3. Tap **"Install"** or **"Add"**

#### Step 3: Open the App

1. Find **"Athan Notes"** on home screen or app drawer
2. **Tap to open**
3. **Grant microphone permission** when prompted

**Troubleshooting:**
- No install prompt? Clear Chrome cache and revisit
- Can't find in menu? Update Chrome to latest version
- Not fullscreen? Uninstall and reinstall

---

### Desktop (Chrome/Edge)

#### Step 1: Open in Chrome or Edge

1. Open **Chrome** or **Edge** browser
2. Visit your deployment URL
3. Wait for page to load

#### Step 2: Install

**Look for install icon** in address bar:
```
┌────────────────────────────┐
│ 🔒 your-url.com  ⊕  ⭐ ⋮   │ ← Install icon (⊕)
└────────────────────────────┘
```

1. **Click the install icon** (⊕ or computer with arrow)
2. **Click "Install"** in popup
3. **App opens** in new window (no browser bars)

**Alternative method:**
1. Click **3-dot menu** (⋮)
2. Select **"Install Athan Notes..."**
3. Click **"Install"**

**Troubleshooting:**
- No install icon? Refresh page (F5 or Ctrl+R / ⌘+R)
- Using Firefox/Safari on Mac? Use Chrome or Edge instead
- Can't find app? Check Start Menu (Windows) or Applications (Mac)

---

## How to Use

### First Login

1. **Open the app** (installed icon or visit URL)
2. **Enter credentials:**
   - Username: Provided by admin (usually `admin`)
   - Password: Your secure password
3. **Tap "Login"**

**If login fails:**
- Check username/password (case-sensitive)
- After 5 failed attempts, wait 15 minutes
- Contact admin if forgot credentials

### Grant Microphone Permission

**First time recording:**

1. Tap **"Start Recording"**
2. Browser asks for microphone permission
3. **Tap/Click "Allow"**

**If denied:**
- iOS: Settings → Safari → Microphone → Allow
- Android: Settings → Apps → Chrome → Permissions → Microphone
- Desktop: Click lock icon (🔒) in address bar → Allow microphone

---

## Recording a Voice Note

### Step 1: Start Recording

1. **Tap "Start Recording"**
2. **Speak clearly** into microphone
3. **Watch timer** (max 15 minutes)

```
┌─────────────────────────┐
│  🎙️ Record Voice Note   │
│                         │
│      00:42              │ ← Timer
│   Max: 15:00            │
│                         │
│  🔴 Recording...        │
│                         │
│  [ Pause ]  [ Stop ]    │
└─────────────────────────┘
```

### Step 2: Control Recording

**Pause/Resume:**
- Tap **"Pause"** to pause
- Tap **"Resume"** to continue

**Stop:**
- Tap **"Stop"** when done
- Recording ready to process

### Step 3: Process & Save

1. **Tap "Process & Save to Notion"**
2. **Wait** 5-10 seconds (AI processing)
3. **View result** when complete

```
🔄 Processing with Gemini AI...
```

---

## Understanding Results

After processing, you'll see:

```
┌─────────────────────────────────┐
│  ✅ Note Saved to Notion        │
│                                 │
│  Title                          │
│  Today's Shopping List          │ ← AI-generated
│                                 │
│  Category: 📝 Personal          │ ← Auto-categorized
│  Tags: shopping, grocery        │ ← English tags
│                                 │
│  Content                        │
│  ──────────────────────         │
│  Need to buy eggs, milk,        │ ← Full transcription
│  bread, and vegetables...       │   (corrected)
│                                 │
│  [ Open in Notion ]             │
└─────────────────────────────────┘
```

### What the AI Does

1. **Transcribes** your voice to text
2. **Corrects** spelling mistakes
3. **Removes** filler words ("um...", "uh...")
4. **Fixes** fragmented sentences
5. **Generates** a title (same language you spoke)
6. **Creates** a brief summary
7. **Picks** the best category
8. **Extracts** relevant tags (in English)

### Check in Notion

1. **Tap "Open in Notion"**
2. Opens your Notion page
3. See all fields populated

**Record Another:**
- Tap **"Record New Note"**
- Each note creates a separate Notion page

---

## Troubleshooting

### Microphone Issues

**"Failed to access microphone"**

**iOS:**
1. Settings → Safari → Microphone → Allow
2. Close and reopen app

**Android:**
1. Settings → Apps → Chrome → Permissions
2. Enable Microphone
3. Restart Chrome

**Desktop:**
1. Click lock (🔒) in address bar
2. Set Microphone to "Allow"
3. Refresh page

**Microphone not working?**
- Test in another app (Voice Recorder)
- Check if muted
- Try external microphone
- Restart device

### Recording Issues

**Recording stops automatically**
- Reached 15-minute limit
- Phone call interrupted
- App went to background too long
- Low memory

**Solutions:**
- Keep app in foreground
- Close other apps
- Record shorter notes

**No audio recorded**
- Check microphone not muted
- Speak into correct mic
- Test mic in Voice Memos

### Processing Issues

**"Failed to process audio"**

**Causes:**
1. No internet connection → Connect to WiFi
2. Gemini API quota exceeded → Wait 1 hour
3. Audio file too large → Record shorter

**Processing takes >30 seconds:**
- Normal: 5-10 seconds for 1-minute audio
- Slow network: up to 30 seconds
- If >1 minute: Refresh and try again

### Notion Sync Issues

**"Failed to save to Notion"**

1. **Integration disconnected:** Contact admin
2. **Invalid category:** Admin needs to update allowed categories
3. **Network error:** Try again in a few minutes

**Note appears empty:**
- Refresh Notion page
- Content is in page body (scroll down)

### Login Issues

**"Invalid username or password"**
- Check caps lock is off
- Type password manually (don't copy-paste)
- Contact admin to verify credentials

**"Too many login attempts"**
- Rate limiting activated (security feature)
- Wait 15 minutes
- Try again

**Logged out unexpectedly**
- Session expired (after 4 days)
- Browser cleared cookies
- Just log in again

---

## Tips & Best Practices

### For Best Transcription

✅ **DO:**
- Speak clearly at normal pace
- Find quiet environment
- Hold phone 6-8 inches from mouth
- Speak in sentences
- Use natural language

❌ **AVOID:**
- Speaking too fast
- Too many filler words
- Mumbling
- Very long pauses (>30 seconds)
- Background noise

### Category Hints

Help AI pick the right category by mentioning it:

**Examples:**
- "This is a business idea..." → Business
- "Today I learned..." → Learning
- "I need to do these tasks..." → Tasks

### Organization Tips

**Speak tags explicitly:**
- "This is about marketing, social media, and content"
- AI extracts: `marketing`, `social-media`, `content`

**Review in Notion:**
- Check transcription accuracy
- Fix any errors
- Add additional notes manually

---

## Frequently Asked Questions

### General

**Q: Is this a real app?**  
A: It's a Progressive Web App (PWA) - works like a native app but installs from browser.

**Q: Do I need to install it?**  
A: No, but installing gives better experience (fullscreen, faster launch).

**Q: Does it work offline?**  
A: Partially. You can record offline, but processing requires internet.

**Q: How much does it cost?**  
A: Free if your admin deployed it using free tiers.

### Privacy

**Q: Is my voice data stored?**  
A: No. Audio is processed in-memory and immediately deleted after transcription.

**Q: Who can access my notes?**  
A: Only you. Notes are saved to YOUR Notion account.

**Q: Can it record without permission?**  
A: No. Browser requires explicit permission every time.

### Technical

**Q: What languages work?**  
A: Recording works with any language. Optimized for Burmese, works with English.

**Q: Maximum recording length?**  
A: 15 minutes per recording.

**Q: What audio format?**  
A: WebM with Opus codec (automatic).

**Q: Can I edit transcription?**  
A: Edit in Notion after saving. AI transcription is quite accurate.

**Q: Can I search my notes?**  
A: Yes, in Notion! Use tags and full-text search.

---

## Getting Help

### Quick Fixes

**App not loading:**
1. Check internet connection
2. Refresh (pull down on mobile, F5 on desktop)
3. Clear browser cache
4. Try incognito/private mode
5. Reinstall app

**Recording not working:**
1. Check microphone permission
2. Test mic in another app
3. Close other apps using microphone
4. Restart browser/app
5. Restart device

**Can't log in:**
1. Verify credentials (case-sensitive)
2. Check caps lock
3. Wait 15 min if rate-limited
4. Contact admin

### Contact Support

- **Admin:** Contact the person who deployed your instance
- **Issues:** https://github.com/Showwaiyan/athan-notes/issues
- **Documentation:** Check other docs in `docs/` folder

---

## Summary

### Installation Steps

```
1. Visit your deployment URL
   ↓
2. Install to home screen (iOS/Android/Desktop)
   ↓
3. Open installed app
   ↓
4. Login with credentials
   ↓
5. Grant microphone permission
   ↓
6. Start recording! 🎙️
```

### Recording Workflow

```
1. Tap "Start Recording"
   ↓
2. Speak your note (up to 15 min)
   ↓
3. Tap "Stop"
   ↓
4. Tap "Process & Save to Notion"
   ↓
5. Wait 5-10 seconds
   ↓
6. View result & open in Notion ✅
```

### Key Features

- ✅ Voice recording (up to 15 minutes)
- ✅ AI transcription & correction
- ✅ Auto-categorization
- ✅ Tag generation (English)
- ✅ Notion sync
- ✅ PWA installation
- ✅ Secure login with rate limiting

---

**Happy note-taking! 🎙️📝**

For deployment instructions, see `docs/DEPLOYMENT_GUIDE.md`

**Version:** 2.0  
**Last Updated:** January 19, 2026
