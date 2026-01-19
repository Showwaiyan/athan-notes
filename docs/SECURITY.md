# 🔒 Athan Notes - Security Documentation

**Version:** 1.0  
**Last Updated:** January 19, 2025  
**App Type:** Single-User Progressive Web App (PWA)

---

## 📋 Table of Contents

1. [Security Overview](#security-overview)
2. [How Your Data Is Protected](#how-your-data-is-protected)
3. [Authentication System](#authentication-system)
4. [Session Security](#session-security)
5. [Best Practices (What To Do)](#best-practices-what-to-do)
6. [Security Risks (What NOT To Do)](#security-risks-what-not-to-do)
7. [What To Do If Attacked](#what-to-do-if-attacked)
8. [Technical Security Details](#technical-security-details)
9. [Frequently Asked Questions](#frequently-asked-questions)

---

## 🛡️ Security Overview

Athan Notes is designed with security as a top priority. Your voice notes contain personal thoughts, ideas, and potentially sensitive information. This document explains how app protect your data and what you need to do to stay secure.

### Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                          │
└─────────────────────────────────────────────────────────────┘

1. HTTPS/TLS Encryption
   └─> All traffic encrypted in transit
   
2. Encrypted Session Cookies (iron-session)
   └─> Authentication tokens encrypted with AES-256
   
3. Server-Side Authentication
   └─> Every page/API route checks login status
   
4. Cookie Security Flags
   ├─> httpOnly (prevents JavaScript theft)
   ├─> secure (HTTPS only)
   ├─> sameSite (prevents CSRF attacks)
   └─> 4-day expiry (limits damage window)
   
5. Password Hashing (bcrypt)
   └─> Passwords never stored in plain text
   
6. Environment Variable Protection
   └─> Secrets never committed to Git
```

### What Is Protected

✅ **Your voice recordings** - Processed server-side, never stored permanently  
✅ **Your Notion data** - API keys encrypted in environment variables  
✅ **Your login credentials** - Password hashed with bcrypt (10 rounds)  
✅ **Your session** - Encrypted cookies, 4-day expiry  
✅ **Your API keys** - Gemini & Notion keys stored securely on your deployment server  

---

## 🔐 How Your Data Is Protected

### 1. **Voice Recordings**

```
Your Recording → Browser → HTTPS → Server → Gemini AI → Notion → ✅ Saved
                   ↓                ↓
              Encrypted         Deleted after
              (HTTPS/TLS)       processing
```

**Security Features:**
- Voice data transmitted over **HTTPS** (encrypted in transit)
- Recordings **never stored permanently** on server
- Processed immediately and deleted
- Only transcribed text sent to Notion

### 2. **API Keys & Secrets**

Your app uses three critical secrets:

| Secret | Purpose | Storage | Accessible By |
|--------|---------|---------|---------------|
| `GEMINI_API_KEY` | AI transcription | Server environment | Server only |
| `NOTION_API_KEY` | Save notes to Notion | Server environment | Server only |
| `SESSION_SECRET` | Encrypt login cookies | Server environment | Server only |
| `APP_PASSWORD_HASH` | Verify login password | Server environment | Server only |

**Protection:**
- ✅ Stored in Server environment variables (encrypted at rest)
- ✅ Never committed to Git (in `.gitignore`)
- ✅ Never exposed to browser/client-side code
- ✅ Only accessible by server-side code

### 3. **Login Credentials**

**Password Storage:**
```
Your Password: "admin123"
         ↓
    bcrypt hash (10 rounds, salted)
         ↓
Stored: "$2b$10$RNLyaKjxBEkMi5XiuQGh3uZ6/LDIUhyN2ltHhzxCdigGuVZGSDjHW"
```

**Security:**
- ✅ Original password **never stored**
- ✅ Hash uses bcrypt with **salt** (prevents rainbow table attacks)
- ✅ 10 rounds = computationally expensive to crack
- ✅ Even if database leaked, password is safe

---

## 🔑 Authentication System

### How Login Works

```
┌─────────────────────────────────────────────────────────────┐
│ LOGIN FLOW                                                  │
└─────────────────────────────────────────────────────────────┘

1. You enter username/password
         ↓
2. Sent to server over HTTPS (encrypted)
         ↓
3. Server compares password with bcrypt hash
         ↓
4. If correct: Create encrypted session
   ┌────────────────────────────────────┐
   │ Session Data (Plain):              │
   │ {                                  │
   │   username: "admin",               │
   │   isLoggedIn: true,                │
   │   loggedInAt: 1737283200000        │
   │ }                                  │
   └────────────────────────────────────┘
         ↓
5. Encrypt with SESSION_SECRET (AES-256)
         ↓
6. Send encrypted cookie to browser
   Cookie: "Fe26.2**abc123...encrypted_data...xyz789"
         ↓
7. Browser stores cookie (httpOnly, secure)
         ↓
8. Every request: Browser sends cookie automatically
         ↓
9. Server decrypts cookie, verifies session
         ↓
10. ✅ Access granted (or ❌ redirect to login)
```

### Server-Side Protection

**Every page checks authentication:**

```typescript
// app/page.tsx (Main app)
export default async function Home() {
  const session = await getSession();
  
  if (!session.isLoggedIn) {
    redirect('/login');  // ⛔ Not logged in? Go to login page
  }
  
  // ✅ Logged in → Show voice recorder
  return <VoiceRecorder />
}
```

**Every API route checks authentication:**

```typescript
// app/api/process-audio/route.ts
export async function POST(request: NextRequest) {
  const session = await getSession();
  
  if (!session.isLoggedIn) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }  // ⛔ Not logged in? Reject
    );
  }
  
  // ✅ Logged in → Process voice note
}
```

**Result:** Cannot bypass login by:
- ❌ Typing URL directly (`/` redirects to `/login`)
- ❌ Calling API directly (returns 401 Unauthorized)
- ❌ Manipulating client-side JavaScript (checks run on server)

---

## 🍪 Session Security

### How Session Cookies Work

Your session is stored in an **encrypted cookie** with multiple security layers:

```typescript
// lib/session.ts - Security configuration
cookieOptions: {
  httpOnly: true,      // ⛔ JavaScript cannot access
  secure: true,        // ⛔ HTTPS only (production)
  sameSite: 'lax',     // ⛔ Blocks cross-site requests
  maxAge: 345600,      // ⏰ 4 days (96 hours)
  path: '/',           // 📍 Available across entire app
}
```

### Security Features Explained

#### 1. **httpOnly: true** (XSS Protection)

```javascript
// ❌ BLOCKED - JavaScript cannot access cookies
document.cookie  // Returns: "" (empty)
console.log(document.cookie)  // Returns: "" (no session cookie visible)

// ✅ ONLY browser can send cookie to server
fetch('/api/process-audio')  // Browser automatically includes cookie
```

**Protects Against:**
- XSS attacks (malicious scripts can't steal cookie)
- Browser console theft
- Malicious third-party scripts

#### 2. **secure: true** (HTTPS Only - Production)

```
┌─────────────────────────────────────────────────────────────┐
│ HTTP Request (Unencrypted)                                  │
└─────────────────────────────────────────────────────────────┘
http://example.com/
Cookie: athan_session=Fe26.2**abc123...
         ↑
    ❌ BLOCKED in production (secure: true)
    ⚠️ Cookie not sent over HTTP

┌─────────────────────────────────────────────────────────────┐
│ HTTPS Request (Encrypted with TLS)                          │
└─────────────────────────────────────────────────────────────┘
https://your-app.com/
Cookie: athan_session=Fe26.2**abc123...
         ↑
    ✅ ALLOWED (secure: true)
    🔒 Cookie sent over encrypted connection
```

**Protects Against:**
- Network sniffing (WiFi eavesdropping)
- Man-in-the-middle attacks
- HTTP downgrade attacks

#### 3. **sameSite: 'lax'** (CSRF Protection)

```
┌─────────────────────────────────────────────────────────────┐
│ Same-Site Request (Your App)                                │
└─────────────────────────────────────────────────────────────┘
User clicks button in your app
  → POST https://your-app.com/api/process-audio
  → Cookie: athan_session=Fe26.2**abc123...
  → ✅ ALLOWED (same site)

┌─────────────────────────────────────────────────────────────┐
│ Cross-Site Request (Malicious Site)                         │
└─────────────────────────────────────────────────────────────┘
User visits evil-site.com
evil-site.com tries:
  → POST https://your-app.com/api/process-audio
  → Cookie: (none - blocked by sameSite)
  → ❌ BLOCKED (cross-site POST)
```

**Protects Against:**
- CSRF attacks (Cross-Site Request Forgery)
- Malicious sites using your login session
- Clickjacking attacks

#### 4. **4-Day Expiry** (Limits Damage Window)

```
Day 1: You login → Cookie created ✅
Day 2: Still valid ✅
Day 3: Still valid ✅
Day 4: Still valid ✅
Day 5: Cookie expired ❌ → Must login again
```

**Benefits:**
- Stolen cookies become useless after 4 days
- Old sessions automatically cleaned up
- Reduces long-term attack surface

---

## ✅ Best Practices (What To Do)

### 1. **Protect Your Login Credentials**

🔐 **DO:**
- Use a strong password (minimum 12 characters, mix of letters/numbers/symbols)
- Change default password immediately after deployment
- Use a password manager to generate/store password
- Never share your password with anyone

❌ **DON'T:**
- Use simple passwords like `password`, `123456`, `admin`
- Reuse passwords from other accounts
- Write password on sticky notes
- Send password via email/SMS

**How to change password:**
```bash
# 1. Generate new password hash
npm run hash-password
# Enter your new password when prompted

# 2. Update environment variable on your deployment server
# your deployment server Dashboard → Project → Settings → Environment Variables
# Update APP_PASSWORD_HASH with new hash

# 3. Redeploy app
git commit -m "Update password"
git push origin main
```

### 2. **Secure Your Device**

🔒 **DO:**
- Always lock your phone/laptop when not in use
- Use strong device passcode/biometric lock
- Enable auto-lock after 1-2 minutes of inactivity
- Keep your OS and browser updated
- Install security updates promptly

❌ **DON'T:**
- Leave device unlocked in public places
- Let others use your device while logged in
- Disable screen lock for convenience
- Ignore security update notifications

### 3. **Use the App Safely**

✅ **DO:**
- Only install the PWA from your official Server URL
- Logout when finished using the app
- Clear browser data if selling/giving away device
- Use private/incognito mode on shared devices
- Verify the URL before logging in (check for `https://`)

❌ **DON'T:**
- Login on public/shared computers
- Save password in browser on public devices
- Click suspicious links claiming to be your app
- Install browser extensions from untrusted sources

### 4. **Protect Your Environment Variables**

🔑 **DO:**
- Keep `.env.local` file private (never commit to Git)
- Use different API keys for development and production
- Rotate API keys every 6-12 months
- Monitor Notion/Gemini usage for suspicious activity
- Revoke API keys immediately if compromised

❌ **DON'T:**
- Share `.env.local` file via email/Slack/Discord
- Commit secrets to Git (even in private repos)
- Screenshot environment variables
- Store secrets in public documentation

### 5. **Monitor for Suspicious Activity**

👀 **DO:**
- Regularly check your Notion for unexpected notes
- Monitor Gemini API usage in Google Cloud Console
- Review your deployment server deployment logs occasionally
- Notice if app behavior changes unexpectedly

⚠️ **WARNING SIGNS:**
- Notes you didn't create appearing in Notion
- Unexpected logout (session stolen/expired)
- App is slow or behaving strangely
- Unusual API usage spikes

---

## ⚠️ Security Risks (What NOT To Do)

### 🚫 HIGH RISK Actions

#### 1. **Never Share Your Session Cookie**

**❌ DANGER:**
```
Your friend: "Can you send me your cookie so I can test the app?"

You copy cookie from browser:
athan_session=Fe26.2**abc123...

You send to friend via text/email
         ↓
    🚨 FULL ACCESS GRANTED
    Your friend can now:
    - Access your app
    - Record voice notes
    - Save to YOUR Notion
    - No password needed!
```

**Why this is dangerous:**
- Cookie IS your authentication
- Anyone with cookie = full access
- No way to revoke specific cookie (must logout)

#### 2. **Never Use App on Untrusted Devices**

**❌ DANGER:**
```
Public computer at library
         ↓
You login to your app
         ↓
    🚨 RISK: Keylogger might capture password
    🚨 RISK: Browser might save password
    🚨 RISK: Session cookie stored on public device
    🚨 RISK: Next person can access your session
```

**Safe alternative:**
- Only use app on your personal devices
- If emergency: Use incognito mode + logout immediately

#### 3. **Never Install Suspicious Browser Extensions**

**❌ DANGER:**
```
"Cool Voice Recorder Extension!"
         ↓
You install from random website
         ↓
    🚨 Extension has access to ALL cookies
    🚨 Can steal athan_session cookie
    🚨 Can record your typing (including password)
    🚨 Can send data to attacker's server
```

**Safe practice:**
- Only install extensions from official Chrome/Firefox stores
- Check reviews and permissions before installing
- Regularly audit installed extensions
- Remove extensions you don't use

#### 4. **Never Connect to Untrusted WiFi**

**❌ DANGER (if not using HTTPS):**
```
"Free WiFi" at coffee shop
         ↓
You access http://your-app.com (HTTP, not HTTPS)
         ↓
    🚨 Attacker on same WiFi can:
    - Sniff your session cookie
    - Intercept your password
    - Modify server responses
```

**Protection:**
- ✅ Your app uses HTTPS on your deployment server (safe)
- ✅ `secure: true` cookie flag (safe)
- ⚠️ Still avoid sketchy public WiFi
- ✅ Use VPN on public networks

#### 5. **Never Ignore Logout**

**❌ BAD HABIT:**
```
You finish using app
         ↓
Close browser without logout
         ↓
    ⚠️ Session cookie still valid for 4 days
    ⚠️ If device stolen → Full access
    ⚠️ If malware installed → Can use your session
```

**Safe practice:**
```
Click "Logout" button
         ↓
    ✅ Session cookie destroyed
    ✅ Must login again to access
    ✅ Stolen device = No access
```

---

## 🆘 What To Do If Attacked

### Scenario 1: Suspicious Notion Notes Appear

**🚨 SIGNS:**
- Notes you didn't create
- Voice transcriptions you don't recognize
- Unusual timestamps (e.g., 3 AM when you were sleeping)

**✅ IMMEDIATE ACTIONS:**

1. **Logout Immediately**
   ```
   Click "Logout" button in app
   → Destroys your current session
   ```

2. **Change Your Password**
   ```bash
   npm run hash-password
   # Generate new hash, update your deployment server env vars, redeploy
   ```

3. **Revoke API Keys**
   - **Notion:** 
     - Go to https://www.notion.so/my-integrations
     - Find your integration → "Settings" → "Revoke"
     - Create new integration, update `NOTION_API_KEY`
   
   - **Gemini:**
     - Go to https://aistudio.google.com/apikey
     - Revoke old key → Create new key
     - Update `GEMINI_API_KEY` on Server

4. **Generate New Session Secret**
   ```bash
   npm run generate-secret
   # Update SESSION_SECRET on your deployment server
   # Redeploy app
   ```

5. **Check Your Devices**
   - Run antivirus scan
   - Check for suspicious browser extensions
   - Review recently installed apps

6. **Review Notion Access**
   - Check which pages your integration can access
   - Revoke any unexpected database connections

### Scenario 2: Device Stolen/Lost

**🚨 EMERGENCY ACTIONS:**

1. **Remotely Lock/Wipe Device**
   - **iPhone:** Use "Find My iPhone" → Mark as Lost → Erase
   - **Android:** Use "Find My Device" → Lock → Erase
   - **Mac:** Use "Find My Mac" → Lock → Erase
   - **Windows:** Use "Find My Device" → Lock → Erase

2. **Revoke All API Keys** (see Scenario 1)

3. **Change Password** (see Scenario 1)

4. **Generate New Session Secret** (see Scenario 1)

5. **Monitor for 7 Days**
   - Check Notion daily for unexpected notes
   - Review Gemini API usage
   - Check your deployment server deployment logs

### Scenario 3: Suspicious Login Activity

**🚨 SIGNS:**
- Logged out unexpectedly
- Session expires before 4 days
- App asks for login when you were recently active

**✅ ACTIONS:**

1. **Check Browser Console**
   ```
   Press F12 → Console tab
   Look for errors like:
   - "401 Unauthorized"
   - "Session expired"
   - "Invalid session"
   ```

2. **Clear Browser Data**
   ```
   Settings → Privacy → Clear browsing data
   - Cookies and site data ✅
   - Cached files ✅
   Time range: All time
   ```

3. **Login Again**
   - Enter credentials
   - If fails → Password may be changed (compromised?)
   - If succeeds → Likely normal session expiry

4. **If Still Suspicious:**
   - Change password (see Scenario 1)
   - Check device for malware
   - Enable 2FA on Notion account (extra protection)

### Scenario 4: API Key Leaked

**🚨 SIGNS:**
- Git commit accidentally includes `.env.local`
- Screenshot shared publicly showing environment variables
- Noticed API keys in public Slack/Discord message

**✅ IMMEDIATE ACTIONS (within 5 minutes):**

1. **Revoke ALL Leaked Keys**
   - Gemini API key → Revoke on Google AI Studio
   - Notion API key → Revoke on Notion integrations page

2. **Remove from Git History** (if committed)
   ```bash
   # WARNING: Rewrites Git history, use with caution
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env.local" \
     --prune-empty --tag-name-filter cat -- --all
   
   git push origin --force --all
   ```

3. **Create New Keys**
   - Generate new Gemini API key
   - Create new Notion integration
   - Generate new SESSION_SECRET
   - Update your deployment server environment variables
   - Redeploy app

4. **Monitor for Abuse**
   - Check Gemini usage: https://console.cloud.google.com/
   - Check Notion activity logs
   - Watch for unexpected charges

### Emergency Contact Checklist

If you suspect a serious security breach:

```
☐ Logout from all devices
☐ Change password
☐ Revoke all API keys
☐ Generate new session secret
☐ Clear browser data
☐ Run antivirus scan
☐ Review Notion for unauthorized content
☐ Check Gemini API usage logs
☐ Monitor for 7 days
☐ Document incident (date, time, what happened)
☐ Consider rotating Notion database (create new one)
```

---

## 🔬 Technical Security Details

### Encryption Standards

| Component | Algorithm | Key Size | Notes |
|-----------|-----------|----------|-------|
| Session cookies | AES-256-CBC | 256 bits | Via iron-session |
| Password hashing | bcrypt | 10 rounds | Salted automatically |
| HTTPS/TLS | TLS 1.3 | 256 bits | Managed by your deployment server |
| SESSION_SECRET | Random hex | 512 bits (64 chars) | Generated via crypto.randomBytes |

### Session Cookie Technical Details

**Cookie Structure:**
```
Name: athan_session
Value: Fe26.2**[version]$[salt]$[encrypted_payload]$[hmac_signature]
```

**Breakdown:**
- `Fe26.2` - Iron protocol version
- `**` - Separator
- `[salt]` - Random salt for this cookie
- `[encrypted_payload]` - AES-256 encrypted session data
- `[hmac_signature]` - HMAC-SHA256 signature for integrity

**Security Properties:**
- ✅ **Confidentiality:** AES-256 encryption (payload unreadable)
- ✅ **Integrity:** HMAC signature (tampering detected)
- ✅ **Authentication:** Signature verified with SESSION_SECRET
- ✅ **Non-repudiation:** Only server with SECRET can create valid cookies

### Attack Surface Analysis

| Attack Vector | Risk Level | Mitigation | Status |
|---------------|------------|------------|--------|
| XSS (Cross-Site Scripting) | 🟢 Low | httpOnly cookies | ✅ Protected |
| CSRF (Cross-Site Request Forgery) | 🟢 Low | sameSite: lax | ✅ Protected |
| Network Sniffing | 🟢 Low | HTTPS + secure flag | ✅ Protected |
| SQL Injection | 🟢 None | No database (Notion API) | ✅ N/A |
| Brute Force Login | 🟡 Medium | bcrypt (slow hashing) | ⚠️ Rate limiting recommended |
| Session Hijacking | 🟡 Medium | 4-day expiry, httpOnly | ⚠️ User must protect device |
| Physical Device Access | 🔴 High | User responsibility | ⚠️ Lock device, logout |
| Malicious Browser Extensions | 🟡 Medium | User responsibility | ⚠️ Only install trusted extensions |

### Security Audit Checklist

For security-conscious users or periodic audits:

```
☐ All secrets in .env.local (not committed to Git)
☐ .env.local in .gitignore
☐ SESSION_SECRET is 64+ characters random hex
☐ Password hash uses bcrypt with 10+ rounds
☐ App deployed on HTTPS (Server)
☐ secure: true in production
☐ httpOnly: true for cookies
☐ sameSite: 'lax' for cookies
☐ Session expiry ≤ 7 days
☐ All pages check authentication (server-side)
☐ All API routes check authentication
☐ No sensitive data in client-side JavaScript
☐ API keys have minimal permissions (Notion: single database)
☐ Regular password rotation (every 6-12 months)
☐ API key rotation (every 6-12 months)
☐ Monitoring for suspicious Notion activity
☐ Browser/OS kept updated
☐ No suspicious browser extensions installed
```

---

## ❓ Frequently Asked Questions

### Q1: Can someone steal my session by copying the cookie?

**A: Yes, if they have physical access to your device.**

If an attacker can:
1. Access your unlocked device
2. Open browser DevTools (F12)
3. Copy the `athan_session` cookie value
4. Paste it into their own browser

Then they can access your app until the cookie expires (4 days).

**Protection:**
- Lock your device when not in use
- Logout when finished
- Don't let others use your device while you're logged in

---

### Q2: Can someone create a fake session without my SESSION_SECRET?

**A: No.**

The SESSION_SECRET is required to:
- Encrypt session data
- Sign the cookie with HMAC

Without it, attackers cannot:
- ❌ Create valid session cookies
- ❌ Modify existing cookies
- ❌ Forge authentication

**What they CAN do:**
- ✅ Use a stolen valid cookie (replay attack)

**Think of it like a passport:**
- ❌ Can't create fake passport (need government equipment)
- ✅ Can use stolen real passport (if they look like you)

---

### Q3: Is my password safe if the database leaks?

**A: Yes.**

Your password is hashed with bcrypt:
```
Original: "admin123"
Stored: "$2b$10$RNLyaKjxBEkMi5XiuQGh3uZ6/LDIUhyN2ltHhzxCdigGuVZGSDjHW"
```

**Even if the hash leaks:**
- ❌ Cannot reverse hash to get original password
- ❌ Cannot use hash as password (server compares hashes)
- ⚠️ Can attempt brute force (but bcrypt is slow - 10 rounds)

**Estimated crack time** (with modern hardware):
- Weak password (`password`): Minutes to hours
- Medium password (`Admin123!`): Days to weeks
- Strong password (`rX9$mK2#pL5@qN8%`): Centuries

**Recommendation:** Use strong password (12+ chars, mixed case, numbers, symbols)

---

### Q4: What happens if my Notion API key leaks?

**A: Attacker can access your Notion database.**

**What they CAN do:**
- ✅ Read all notes in the connected database
- ✅ Create new notes
- ✅ Modify existing notes
- ✅ Delete notes

**What they CANNOT do:**
- ❌ Access other Notion databases (integration is scoped)
- ❌ Access your Notion account settings
- ❌ Change your Notion password
- ❌ Access your app (still needs session cookie)

**Immediate action:**
1. Revoke API key on Notion
2. Create new integration
3. Update environment variable
4. Redeploy app

---

### Q5: Can someone listen to my voice recordings?

**A: No, recordings are never stored.**

**Voice recording flow:**
```
Microphone → Browser → HTTPS → Server → Gemini AI → Deleted
                 ↓                           ↓
            Encrypted              Only text sent to Notion
```

**Security:**
- ✅ Transmitted over HTTPS (encrypted)
- ✅ Processed immediately server-side
- ✅ Deleted after transcription
- ✅ Never stored on disk
- ✅ Never sent to third parties (except Gemini for transcription)

**What IS stored:**
- Transcribed text (in Notion)
- Generated title, summary, tags (in Notion)

---

### Q6: Should I use this app on public WiFi?

**A: Yes, but with caution.**

**✅ Safe (your app uses HTTPS + secure cookies):**
- Session cookies only sent over HTTPS
- `secure: true` flag prevents HTTP transmission
- HTTPS encrypts all traffic (password, voice data, API calls)

**⚠️ Still recommended:**
- Use VPN on public WiFi (extra layer of encryption)
- Verify URL shows `https://` and padlock icon
- Avoid sketchy "Free WiFi" networks

**❌ NEVER do this on public WiFi:**
- Use HTTP version (your app forces HTTPS on your deployment server)
- Disable HTTPS warnings
- Login on suspicious networks (fake hotspots)

---

### Q7: How do I know if someone accessed my account?

**🔍 Detection methods:**

1. **Check Notion for unexpected notes:**
   - Unusual timestamps (e.g., 3 AM)
   - Content you don't recognize
   - Wrong language or topic

2. **Monitor Gemini API usage:**
   - https://console.cloud.google.com/
   - Look for unexpected spikes
   - Check usage times

3. **Review your deployment server logs:**
   - your deployment server Dashboard → Project → Logs
   - Look for unusual activity patterns

4. **Check browser login sessions:**
   - If you're logged out unexpectedly
   - Session expired before 4 days

**⚠️ WARNING SIGNS:**
- Notes appearing that you didn't create
- Session expires immediately after login
- App behaving strangely
- Unusual API usage

---

### Q8: Can I add extra security like 2FA?

**A: Not built-in, but you can add layers:**

**Current security (single-factor):**
```
Username + Password → Access granted
```

**Recommended additional layers:**

1. **Device-level 2FA:**
   - Use phone/laptop biometric lock (Face ID, Touch ID, fingerprint)
   - Require passcode to unlock device
   - Use hardware security key (YubiKey) for device login

2. **Network-level security:**
   - Deploy to private URL (not public)
   - Use Server password protection if Server offers
   - Add IP whitelist

3. **Notion-level 2FA:**
   - Enable 2FA on your Notion account
   - Even if API key leaks, account is protected

4. **Code-level enhancements (advanced):**
   - Add IP address binding to sessions
   - Implement TOTP (Time-based One-Time Password)
   - Add email verification for sensitive actions
   - Implement rate limiting for login attempts

**For a single-user app, current security is sufficient.**

---

### Q9: What should I do before selling my device?

**📋 Device disposal checklist:**

1. **Logout from app**
   ```
   Click "Logout" button
   → Session cookie destroyed
   ```

2. **Clear browser data**
   ```
   Settings → Privacy → Clear browsing data
   - Cookies ✅
   - Cached files ✅
   - Saved passwords ✅
   Time range: All time
   ```

3. **Uninstall PWA**
   ```
   iOS: Long press app icon → Remove App
   Android: Long press → Uninstall
   Desktop: Right-click in browser → Uninstall
   ```

4. **Factory reset device**
   ```
   Settings → General → Reset → Erase All Content
   ```

5. **Change password** (optional but recommended)
   ```
   New owner won't have access, but safe practice
   ```

6. **Rotate API keys** (if paranoid)
   ```
   Revoke old keys, create new ones
   ```

---

### Q10: Is this app secure enough for sensitive information?

**A: Depends on your threat model.**

**✅ Secure for:**
- Personal notes, ideas, thoughts
- Business brainstorming
- Learning notes
- Task management
- Content creation ideas

**⚠️ Consider alternatives for:**
- Medical records (use HIPAA-compliant systems)
- Financial data (use bank-grade encryption)
- Legal documents (use encrypted document management)
- Government secrets (use classified systems)
- Passwords (use password manager with zero-knowledge encryption)

**Why:**
- Your app uses industry-standard security (HTTPS, encrypted cookies, bcrypt)
- But it's a single-user app without audit logs, compliance certifications, or advanced features like end-to-end encryption
- Notion and Gemini have access to your data (not zero-knowledge)

**Recommendation:**
- ✅ Use for personal productivity
- ⚠️ Don't use for highly sensitive data requiring compliance

---

## 📚 Additional Resources

### Official Documentation

- **iron-session:** https://github.com/vvo/iron-session
- **bcrypt:** https://github.com/kelektiv/node.bcrypt.js
- **Notion API Security:** https://developers.notion.com/reference/authentication
- **Gemini API Security:** https://ai.google.dev/gemini-api/docs/api-key

### Security Best Practices

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **Session Management:** https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- **Password Storage:** https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html

### Tools for Security Testing

- **Browser Security Audit:**
  - Chrome DevTools → Security tab
  - Check for HTTPS, secure cookies, mixed content

- **Cookie Inspector:**
  - DevTools → Application → Cookies
  - Verify httpOnly, secure, sameSite flags

- **Password Strength Checker:**
  - https://bitwarden.com/password-strength/
  - Test your password strength

---

## 📞 Support & Reporting

### Security Issue Reporting

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. Contact developer privately (see repository for contact info)
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
4. If you know ths solution, then please fork and update the code

### Questions or Concerns

For non-security questions:
- Open GitHub issue
- Review `README.md` for setup instructions

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-19 | Initial security documentation |

---

## ✅ Security Commitment

This app is built with security as a priority:

- ✅ Industry-standard encryption (AES-256, TLS 1.3)
- ✅ Secure password hashing (bcrypt)
- ✅ HTTPS-only in production
- ✅ httpOnly, secure, sameSite cookies
- ✅ Server-side authentication on every route
- ✅ No secrets in client-side code
- ✅ Environment variables never committed
- ✅ Regular security reviews

**Remember:** Security is a shared responsibility.  
We build secure systems. You keep your credentials safe. Together, your data stays protected.

---

**Last Updated:** January 19, 2025  
**Maintained By:** Athan Notes Development Team  
**License:** For single-user deployment only
