# Installation Guide - Athan Notes PWA

Complete guide for installing and using Athan Notes on your device.

---

## Table of Contents

1. [What is Athan Notes?](#what-is-athan-notes)
2. [System Requirements](#system-requirements)
3. [Installation Instructions](#installation-instructions)
   - [iOS (iPhone/iPad)](#ios-iphoneipad)
   - [Android](#android)
   - [Desktop (Windows/Mac/Linux)](#desktop-windowsmaclinux)
4. [First Time Setup](#first-time-setup)
5. [How to Use](#how-to-use)
6. [Troubleshooting](#troubleshooting)
7. [Frequently Asked Questions](#frequently-asked-questions)
8. [Tips & Best Practices](#tips--best-practices)

---

## What is Athan Notes?

Athan Notes is a Progressive Web App (PWA) that lets you:

📱 **Record voice notes** in Burmese (or any language)  
🤖 **AI transcription** using Google Gemini 2.0 Flash  
📝 **Auto-categorize** your notes intelligently  
🔄 **Sync to Notion** automatically  
🔒 **Secure & Private** - your data, your control  

### Key Features

- ✅ **Voice Recording** - Speak naturally, AI handles the rest
- ✅ **Smart Transcription** - Corrects spelling, removes filler words
- ✅ **Auto-Categorization** - AI picks the right category
- ✅ **Tag Generation** - Automatic English tags for easy searching
- ✅ **Notion Sync** - Saves directly to your Notion database
- ✅ **Offline-Ready** - Install as an app, works like native
- ✅ **No App Store** - Install directly from browser

---

## System Requirements

### Minimum Requirements

**Mobile Devices:**
- iOS 14.5+ (iPhone 6S or newer)
- Android 8.0+ (released 2017 or newer)
- Modern browser (Safari for iOS, Chrome for Android)

**Desktop:**
- Windows 10+, macOS 10.15+, or Linux
- Chrome 90+, Edge 90+, Safari 14+, Firefox 90+

**Network:**
- Internet connection required for:
  - AI processing (Gemini API)
  - Notion sync
  - Initial app installation
- Offline recording works, but processing needs internet

**Microphone:**
- Built-in or external microphone
- Microphone permission required

---

## Installation Instructions

### iOS (iPhone/iPad)

Athan Notes installs as a native-like app on iOS using Safari.

#### Step 1: Open in Safari

1. **Open Safari browser** (must use Safari, not Chrome)
2. **Visit:** `https://your-app-url.vercel.app`
   - Replace with your actual deployment URL
3. **Wait** for the page to load completely

#### Step 2: Add to Home Screen

1. **Tap the Share button** (square with arrow pointing up)
   - Located at the bottom of Safari (iPhone)
   - Located at the top of Safari (iPad)

2. **Scroll down** and tap **"Add to Home Screen"**
   - Look for the icon: ➕ with "Add to Home Screen"

3. **Edit name** (optional):
   - Default name: "Athan Notes"
   - You can shorten it to just "Athan" if preferred

4. **Tap "Add"** (top right corner)

#### Step 3: Open the App

1. **Go to your Home Screen**
2. **Find the Athan Notes icon**
   - Look for the app icon (should appear where you last added an app)
3. **Tap to open**
   - Opens fullscreen (no Safari browser bars)
   - Works just like a native app

#### Visual Guide (iOS)

```
┌─────────────────────────┐
│  Safari Browser         │
│  ┌───────────────────┐  │
│  │ your-app-url.com  │  │  ← 1. Visit URL
│  └───────────────────┘  │
│                         │
│  [Content loads here]   │
│                         │
│  ╔═══════════════════╗  │
│  ║   Share Button    ║  │  ← 2. Tap this
│  ║   [Box with ↑]    ║  │
│  ╚═══════════════════╝  │
└─────────────────────────┘
         ↓
┌─────────────────────────┐
│  Share Menu             │
│  • AirDrop              │
│  • Messages             │
│  • Copy                 │
│  ⋮                      │
│  ➕ Add to Home Screen  │  ← 3. Tap this
│  ⋮                      │
└─────────────────────────┘
         ↓
┌─────────────────────────┐
│  Athan Notes            │  ← 4. Edit name (optional)
│  [Icon preview]         │
│                         │
│  [ Cancel ]  [ Add ]    │  ← 5. Tap Add
└─────────────────────────┘
```

#### iOS Troubleshooting

**"Add to Home Screen" option missing?**
- Make sure you're using **Safari** (not Chrome/Firefox)
- Check you're on iOS 14.5 or newer
- Try closing Safari and reopening

**App icon doesn't appear?**
- Swipe right to the last home screen page
- Check App Library (swipe all the way right)
- Restart your iPhone

**App opens in Safari instead of fullscreen?**
- Delete the home screen icon
- Reinstall following steps above
- Make sure you tapped "Add to Home Screen", not "Add Bookmark"

---

### Android

Athan Notes installs as a PWA on Android using Chrome.

#### Step 1: Open in Chrome

1. **Open Chrome browser**
2. **Visit:** `https://your-app-url.vercel.app`
3. **Wait** for the page to load

#### Step 2: Install App (Automatic Prompt)

**Option A: Accept Install Prompt**

1. **Look for popup** at bottom of screen:
   ```
   ┌─────────────────────────────┐
   │ Add Athan Notes to Home     │
   │ screen?                     │
   │                             │
   │ [ Later ]    [ Install ]    │
   └─────────────────────────────┘
   ```

2. **Tap "Install"**
3. **Confirm** if prompted
4. **Done!** App appears on home screen

**Option B: Manual Install (if prompt doesn't show)**

1. **Tap the 3-dot menu** (⋮) in top-right corner
2. **Select "Add to Home screen"** or "Install app"
3. **Tap "Install"** or "Add"
4. **Check your home screen** for the app icon

#### Step 3: Open the App

1. **Find "Athan Notes"** on your home screen or app drawer
2. **Tap to open**
3. **Grant microphone permission** when prompted

#### Visual Guide (Android)

```
┌─────────────────────────┐
│  Chrome Browser      ⋮  │  ← Tap menu
│  ┌───────────────────┐  │
│  │ your-app-url.com  │  │
│  └───────────────────┘  │
│                         │
│  [Page content]         │
│         ↓               │
│  ┌──────────────────┐   │
│  │  Install Athan   │   │  ← Automatic prompt
│  │  Notes?          │   │
│  │                  │   │
│  │ [Cancel][Install]│   │  ← Tap Install
│  └──────────────────┘   │
└─────────────────────────┘

OR

┌─────────────────────────┐
│  Chrome Menu         ⋮  │
│  ┌───────────────────┐  │
│  │ • New tab         │  │
│  │ • Bookmarks       │  │
│  │ • History         │  │
│  │ • Downloads       │  │
│  │ ➕ Add to Home   │  │  ← Tap this
│  │   screen          │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

#### Android Troubleshooting

**No install prompt appears?**
- Check you're using Chrome (not Samsung Internet/Firefox)
- Clear Chrome cache: Settings → Apps → Chrome → Storage → Clear Cache
- Try visiting the URL again
- Look for banner at top/bottom of screen

**"Add to Home screen" not in menu?**
- App might already be installed (check app drawer)
- Try using Chrome instead of other browsers
- Update Chrome to latest version

**App doesn't open fullscreen?**
- Uninstall and reinstall
- Make sure you installed as PWA (not just bookmark)
- Check Android version is 8.0+

---

### Desktop (Windows/Mac/Linux)

Install as a standalone app on your computer.

#### Chrome/Edge (Recommended)

1. **Open Chrome or Edge browser**
2. **Visit:** `https://your-app-url.vercel.app`
3. **Look for install icon** in address bar:
   ```
   ┌────────────────────────────────┐
   │ 🔒 your-app-url.com  ⊕  ⭐ ⋮  │  ← Install icon (⊕)
   └────────────────────────────────┘
   ```
4. **Click the install icon** (⊕ or computer with arrow)
5. **Click "Install"** in the popup
6. **App opens in new window** (without browser bars)

**Alternative Method:**
1. **Click 3-dot menu** (⋮) in top right
2. **Select "Install Athan Notes..."** or "Create shortcut..."
3. **Check "Open as window"**
4. **Click "Install" or "Create"**

#### Safari (Mac)

Safari doesn't support PWA installation on macOS. Use Chrome or Edge instead.

**Workaround:**
1. Visit the app URL in Safari
2. Bookmark the page (⌘+D)
3. Use bookmark to access quickly

#### Firefox

Firefox has limited PWA support on desktop.

**Workaround:**
1. Visit the app URL
2. Right-click on page → "Add to Home Screen" (if available)
3. Or use Chrome/Edge for full PWA experience

#### Desktop Visual Guide

```
Chrome/Edge:
┌──────────────────────────────────────┐
│  🔒 your-app-url.com  ⊕  ⋮           │  ← Click ⊕
│  ────────────────────────────────────│
│                                      │
│  Install Athan Notes?                │
│  ┌────────────────────────────────┐  │
│  │  [App Icon]  Athan Notes       │  │
│  │                                │  │
│  │  This site can be installed    │  │
│  │  as an app. It will open in    │  │
│  │  its own window.               │  │
│  │                                │  │
│  │     [ Cancel ]  [ Install ]    │  │  ← Click Install
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

#### Desktop Troubleshooting

**No install icon in address bar?**
- Refresh the page (F5 or Ctrl+R / ⌘+R)
- Check you're using Chrome or Edge (not Firefox/Safari)
- Clear browser cache and try again

**App doesn't open in separate window?**
- Close and reopen the installed app
- Reinstall: Right-click app icon → Uninstall → Install again

**Can't find installed app?**
- **Windows:** Check Start Menu → All Apps
- **Mac:** Check Applications folder or Launchpad
- **Linux:** Check application menu

---

## First Time Setup

### Step 1: Access the App

**From App URL:**
1. Visit: `https://your-app-url.vercel.app`
2. You'll see the login screen

**From Installed App:**
1. Tap/click the Athan Notes icon
2. App opens to login screen

### Step 2: Login

```
┌─────────────────────────┐
│  🎙️ Athan Notes         │
│                         │
│  Login                  │
│  ──────────────────     │
│                         │
│  Username:              │
│  ┌───────────────────┐  │
│  │ [your username]   │  │  ← Enter username
│  └───────────────────┘  │
│                         │
│  Password:              │
│  ┌───────────────────┐  │
│  │ •••••••••••••     │  │  ← Enter password
│  └───────────────────┘  │
│                         │
│  [      Login      ]    │  ← Tap to login
│                         │
└─────────────────────────┘
```

**Credentials:**
- Username: `admin` (or provided by admin)
- Password: Your secure password

**If login fails:**
- Check credentials are correct (case-sensitive)
- Try typing password manually (don't copy-paste)
- After 5 failed attempts, wait 15 minutes

### Step 3: Grant Microphone Permission

**First time recording:**

1. Tap **"Start Recording"**
2. Browser will ask for microphone permission:

**iOS:**
```
┌─────────────────────────────┐
│  "your-app-url.com" Would   │
│  Like to Access the         │
│  Microphone                 │
│                             │
│  [ Don't Allow ]  [ Allow ] │  ← Tap Allow
└─────────────────────────────┘
```

**Android:**
```
┌─────────────────────────────┐
│  Allow Athan Notes to       │
│  record audio?              │
│                             │
│  [ Deny ]  [ Allow ]        │  ← Tap Allow
└─────────────────────────────┘
```

**Desktop:**
```
┌─────────────────────────────┐
│  your-app-url.com wants to  │
│  use your microphone        │
│                             │
│  [ Block ]  [ Allow ]       │  ← Click Allow
└─────────────────────────────┘
```

3. **Tap/Click "Allow"**
4. Recording starts immediately

**Permission denied?**
- Go to device settings
- Find browser permissions
- Enable microphone for the app

---

## How to Use

### Recording a Voice Note

#### Step 1: Start Recording

1. **Tap "Start Recording"** button
2. **Speak clearly** into microphone
3. **Watch the timer** (max 15 minutes)

```
┌─────────────────────────┐
│  🎙️ Record Voice Note   │
│                         │
│      00:42              │  ← Timer
│   Max: 15:00            │
│                         │
│  🔴 Recording...        │  ← Status indicator
│                         │
│  [ Pause ]  [ Stop ]    │  ← Controls
└─────────────────────────┘
```

#### Step 2: Control Recording

**Pause:**
- Tap **"Pause"** to pause
- Timer stops
- Tap **"Resume"** to continue

**Stop:**
- Tap **"Stop"** when done
- Recording saved locally
- Ready to process

```
Recording stopped:
┌─────────────────────────┐
│      01:23              │  ← Final duration
│   Max: 15:00            │
│                         │
│  [ Process & Save to  ] │  ← Process button
│  [      Notion        ] │
│                         │
│  [     Discard      ]   │  ← Delete recording
└─────────────────────────┘
```

#### Step 3: Process & Save

1. **Review duration** (shows how long you recorded)
2. **Tap "Process & Save to Notion"**
3. **Wait** for AI processing (3-10 seconds)
   ```
   🔄 Processing with Gemini AI...
   ```
4. **View result** when complete

### Understanding the Results

After processing, you'll see:

```
┌─────────────────────────────────────┐
│  ✅ Note Saved to Notion            │
│                                     │
│  Title                              │
│  ယနေ့ ဝယ်ရမယ့် ပစ္စည်းများ           │  ← AI-generated title
│                                     │
│  Category: 📝 Personal              │  ← Auto-categorized
│  Tags: shopping, grocery, weekend  │  ← English tags
│                                     │
│  Content                            │
│  ──────────────────────────         │
│  ဈေးသွားတဲ့အခါ ဒီပစ္စည်းတွေ ဝယ်ရမယ်။  │
│  ပဲပိုင်၊ ကြက်သွန်နီ၊ ငရုတ်သီး...     │  ← Full transcription
│                                     │  (corrected & cleaned)
│  [ Open in Notion ]                 │  ← Link to Notion page
└─────────────────────────────────────┘
```

**What the AI does:**
1. **Transcribes** your voice to text (Burmese)
2. **Corrects** spelling mistakes automatically
3. **Removes** filler words ("အဲ့တော့...", "ဒီ...")
4. **Fixes** fragmented sentences
5. **Generates** a title (in language you spoke)
6. **Creates** a summary (1-2 sentences)
7. **Picks** the best category
8. **Extracts** relevant tags (in English)

### Checking in Notion

1. **Tap "Open in Notion"** button
2. **Opens Notion app** or web
3. **See your note** in the database:

```
Notion Database:
┌──────────────────────────────────────┐
│  Name (Title)                        │
│  📝 ယနေ့ ဝယ်ရမယ့် ပစ္စည်းများ        │
│                                      │
│  Summary                             │
│  ဈေးဝယ်ရမယ့် ပစ္စည်းစာရင်း           │
│                                      │
│  Category                            │
│  Personal                            │
│                                      │
│  Tags                                │
│  shopping, grocery, weekend          │
│                                      │
│  (Page body contains full content)   │
└──────────────────────────────────────┘
```

### Recording Another Note

After saving:

1. **Tap "Record New Note"** button
2. **Repeat** the recording process
3. Each note saves as **separate page** in Notion

---

## Troubleshooting

### Microphone Issues

**"Failed to access microphone"**

**iOS (Safari):**
1. Settings → Safari → Microphone
2. Set to "Ask" or "Allow"
3. Close and reopen app
4. Try recording again

**Android (Chrome):**
1. Settings → Apps → Chrome → Permissions
2. Enable Microphone
3. Restart Chrome
4. Try recording again

**Desktop (Chrome):**
1. Click lock icon (🔒) in address bar
2. Find "Microphone" permission
3. Set to "Allow"
4. Refresh page

**Microphone not working?**
- Test microphone in another app (Voice Recorder, etc.)
- Check if muted or volume is zero
- Try using external microphone
- Restart device

### Recording Issues

**Recording stops automatically**

Possible causes:
- Reached 15-minute limit (normal behavior)
- Phone call interrupted (iOS/Android)
- App went to background too long
- Low memory on device

**Solution:**
- Keep app in foreground during recording
- Close other apps to free memory
- Record shorter notes (split into multiple)

**No audio in recording**

Check:
- Microphone not muted
- Speaking into correct microphone
- Permission granted to browser
- Try recording in Voice Memos app to test mic

### Processing Issues

**"Failed to process audio"**

Common causes:

1. **No internet connection**
   - Check WiFi/cellular data
   - Try again when online

2. **Gemini API quota exceeded**
   - Wait 1 hour
   - Try again later
   - Contact admin if persists

3. **Audio file too large**
   - Max 50MB supported
   - Try shorter recording
   - Use lower quality setting (if available)

**Processing takes too long**

- Normal: 3-10 seconds for 1-minute audio
- Slow network: up to 30 seconds
- If >1 minute: Refresh and try again

### Notion Sync Issues

**"Failed to save to Notion"**

Possible causes:

1. **Notion integration disconnected**
   - Contact admin to reconnect
   - Check Notion database still exists

2. **Category not found**
   - AI picked invalid category
   - Admin needs to add to allowed list

3. **Network error**
   - Check internet connection
   - Try again in a few minutes

**Note appears empty in Notion**

- Refresh Notion page
- Check page properties (click on page)
- Content is in page body (not just properties)

### Login Issues

**"Invalid username or password"**

- Check caps lock is off
- Verify username (usually `admin`)
- Try typing password manually
- Contact admin to verify credentials

**"Too many login attempts"**

- Rate limiting activated (security feature)
- Wait 15 minutes
- Try logging in again
- Counts resets after successful login

**Logged out unexpectedly**

- Session expired (after 4 days)
- Browser cleared cookies
- Just log in again

---

## Frequently Asked Questions

### General

**Q: Is this a real app or a website?**
A: It's a Progressive Web App (PWA) - works like a native app but installs from the browser. No App Store needed.

**Q: Do I need to install it?**
A: No, you can use it in the browser. But installing gives a better experience (fullscreen, app icon, faster launch).

**Q: Does it work offline?**
A: Partially. You can open the app and record offline, but processing requires internet (Gemini API needs connection).

**Q: How much does it cost?**
A: Free to use (if your admin deployed it). Costs are covered by free tiers of Gemini and Notion APIs.

### Privacy & Security

**Q: Is my voice data stored?**
A: No. Voice recordings are processed in-memory and immediately discarded after transcription. Nothing is saved to disk.

**Q: Who can access my notes?**
A: Only you (and your admin). Notes are saved to YOUR Notion account. The app doesn't store anything.

**Q: Can the app record without permission?**
A: No. Browser requires explicit permission to access microphone. You can revoke anytime in settings.

**Q: Is my password secure?**
A: Yes. Password is hashed with bcrypt (military-grade encryption). Even the admin can't see your actual password.

### Technical

**Q: What languages are supported?**
A: 
- **Recording:** Any language (voice input)
- **Transcription:** Optimized for Burmese, works with English
- **Title:** Same language you spoke
- **Tags:** Always English (for better organization)

**Q: What's the maximum recording length?**
A: 15 minutes per recording. For longer content, split into multiple notes.

**Q: What audio format is used?**
A: WebM with Opus codec (best for voice, supported on all modern browsers).

**Q: Can I edit the transcription?**
A: Not in the app. But you can edit in Notion after it's saved. The AI transcription is quite accurate though.

**Q: What if AI picks wrong category?**
A: You can change it in Notion after saving. Or record a new note with clearer category hints ("This is for my learning...").

### Features

**Q: Can I search my notes?**
A: Yes, in Notion! Use tags and full-text search. That's why tags are in English (easier to search).

**Q: Can multiple people use the same account?**
A: Not recommended. One account = one user. Admin can deploy multiple instances for different users.

**Q: Can I export my notes?**
A: Yes! All notes are in Notion. Export from Notion: Database → Export → Markdown/CSV.

**Q: Can I customize categories?**
A: Admin can customize categories by editing `config/categories.json`. Contact admin for changes.

---

## Tips & Best Practices

### For Best Transcription Quality

1. **Speak clearly** - Not too fast, not too slow
2. **Reduce background noise** - Find quiet environment
3. **Hold phone steady** - About 6-8 inches from mouth
4. **Use good microphone** - Built-in is fine, external is better
5. **Speak naturally** - AI will fix grammar and remove fillers

### Recording Tips

**Good Practice:**
- "ယနေ့ ဈေးသွားပြီး ဝယ်ရမယ့် ပစ္စည်းတွေက..." ✅
- Speaking in sentences ✅
- Natural pace ✅

**Avoid:**
- "အဲ့... ဒီ... အဲ့တော့... ဟုတ်... ဒီ..." ❌ (too many fillers)
- Mumbling ❌
- Speaking too fast ❌
- Very long pauses (>30 seconds) ❌

### Category Hints

Help AI pick the right category by mentioning it:

**Examples:**
- "ဒါက ငါ့ရဲ့ business idea တစ်ခု..." → Business ✅
- "ဒီနေ့ သင်ခန်းစာမှာ..." → Learning ✅
- "ငါလုပ်ရမယ့် task တွေက..." → Tasks ✅

### Organization Tips

**Use descriptive titles:**
- Good: "January 2026 Monthly Budget Plan" ✅
- Poor: "Budget" ❌

**Speak tags explicitly:**
- "This is about marketing, social media, and Facebook ads"
- AI will extract: `marketing`, `social-media`, `facebook-ads` ✅

**Review in Notion:**
- Check transcription for accuracy
- Fix any errors
- Add additional notes manually

### Battery & Data Saving

**To save battery:**
- Don't record with screen brightness at 100%
- Close other apps before long recordings
- Use WiFi instead of cellular (if available)

**To save data:**
- Connect to WiFi before processing
- Each 1-minute recording uses ~1-2MB data
- Processing uses ~500KB (Gemini API call)

### Security Tips

**Keep your account safe:**
- Don't share your password
- Log out on shared devices
- Don't leave app open unattended
- Change password if compromised

**Microphone privacy:**
- App ONLY records when you tap "Start Recording"
- Check for 🔴 indicator to verify recording
- Tap "Stop" or close app to ensure mic is off

---

## Getting Help

### In-App Help

1. **Login Issues:**
   - Check username/password
   - Wait if rate-limited
   - Contact admin for credential reset

2. **Technical Issues:**
   - Refresh the page/app
   - Clear browser cache
   - Reinstall the app
   - Try different browser

3. **Feature Requests:**
   - Contact admin
   - Suggest improvements
   - Report bugs

### Contact Admin

- **Email:** [admin email here]
- **GitHub:** https://github.com/Showwaiyan/athan-notes/issues
- **Response time:** Usually 24-48 hours

### Quick Fixes

**App not loading:**
```bash
1. Check internet connection
2. Refresh (pull down on mobile, F5 on desktop)
3. Clear browser cache
4. Try incognito/private mode
5. Reinstall app
```

**Recording not working:**
```bash
1. Check microphone permission
2. Test mic in another app
3. Close other apps using microphone
4. Restart browser/app
5. Restart device
```

**Can't log in:**
```bash
1. Verify credentials (case-sensitive)
2. Check caps lock is off
3. Wait 15 min if rate-limited
4. Try different browser
5. Contact admin
```

---

## Version Information

**App Version:** 1.0.0  
**PWA Version:** 1.0  
**Last Updated:** January 19, 2026  
**Supported Platforms:** iOS 14.5+, Android 8.0+, Modern Desktop Browsers  
**Required:** Internet connection, Microphone

---

## Next Steps

### After Installation

1. ✅ **Test recording** - Record a short test note
2. ✅ **Check Notion** - Verify it appears in database
3. ✅ **Bookmark login** - Save credentials securely
4. ✅ **Read tips section** - Improve transcription quality
5. ✅ **Start using!** - Record your first real note

### Learn More

- **Security:** See `docs/SECURITY.md`
- **Deployment:** See `docs/DEPLOYMENT_GUIDE.md` (for admins)
- **Customization:** See `docs/CUSTOMIZE_CATEGORIES.md`
- **Troubleshooting:** Review this guide's troubleshooting section

---

**Happy note-taking! 🎙️📝**

If you encounter any issues not covered in this guide, please contact your administrator or create an issue on GitHub.
