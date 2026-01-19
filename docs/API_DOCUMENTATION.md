# API Documentation - Athan Notes

Complete API reference for Athan Notes endpoints.

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL](#base-url)
4. [Rate Limiting](#rate-limiting)
5. [Error Handling](#error-handling)
6. [Endpoints](#endpoints)
   - [Authentication Endpoints](#authentication-endpoints)
     - [POST /api/auth/login](#post-apiauthlogin)
     - [POST /api/auth/logout](#post-apiauthlogout)
     - [GET /api/auth/check](#get-apiauthcheck)
   - [Audio Processing](#audio-processing)
     - [POST /api/process-audio](#post-apiprocess-audio)
     - [GET /api/process-audio](#get-apiprocess-audio)
   - [Notion Integration](#notion-integration)
     - [GET /api/notion/test](#get-apinotiontest)
7. [Data Models](#data-models)
8. [Categories & Tags](#categories--tags)
9. [Testing the API](#testing-the-api)
10. [Common Use Cases](#common-use-cases)

---

## Overview

Athan Notes API provides endpoints for:

- **Authentication** - Session-based login/logout
- **Voice Processing** - Convert Burmese voice notes to structured text using Gemini AI
- **Notion Integration** - Automatically save processed notes to Notion database
- **Security** - Rate limiting, input validation, secure sessions

**API Type:** RESTful JSON API  
**Authentication:** Session-based (HTTP-only cookies)  
**Format:** JSON request/response bodies

---

## Authentication

Athan Notes uses **session-based authentication** with secure HTTP-only cookies.

### Authentication Flow

```
1. User sends credentials to POST /api/auth/login
   ↓
2. Server validates credentials
   ↓
3. Server creates encrypted session cookie
   ↓
4. Cookie is sent with all subsequent requests
   ↓
5. Protected endpoints verify session before processing
```

### Session Details

- **Storage:** Encrypted iron-session cookie
- **Cookie name:** `athan-session`
- **Flags:** `httpOnly`, `secure` (production), `sameSite: lax`
- **Max age:** 4 days (345,600 seconds)
- **Encryption:** AES-256-GCM

### Protected Endpoints

These endpoints require authentication:

- `POST /api/process-audio` - Process voice notes
- `GET /api/notion/test` - Test Notion integration

### Public Endpoints

These endpoints are public:

- `POST /api/auth/login` - Login (rate limited)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/check` - Check authentication status
- `GET /api/process-audio` - Get endpoint info

---

## Base URL

### Development

```
http://localhost:3000
```

### Production

```
https://your-deployment-url.vercel.app
```

Replace `your-deployment-url` with your actual Vercel deployment URL.

---

## Rate Limiting

### Login Endpoint Rate Limiting

**Endpoint:** `POST /api/auth/login`

**Limits:**
- **5 attempts** per IP address
- **15 minute** reset window
- Resets on successful login

**When Rate Limited:**
- Status code: `429 Too Many Requests`
- Response includes `retryAfter` timestamp
- `Retry-After` header indicates seconds to wait

**Example Rate Limit Response:**

```json
{
  "error": "Too many login attempts. Please try again in 14 minutes.",
  "retryAfter": "2026-01-19T10:30:00.000Z"
}
```

**Headers:**
```
Retry-After: 840
```

### Other Endpoints

Other endpoints do not have explicit rate limiting but may be subject to:

- Vercel platform limits (free tier: 100GB bandwidth/month)
- Gemini API limits (free tier: 15 requests/min, 1,500/day)
- Notion API limits (3 requests/second)

---

## Error Handling

All errors return JSON with an `error` field.

### Standard Error Response

```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| `200` | OK | Successful request |
| `400` | Bad Request | Invalid input, missing fields |
| `401` | Unauthorized | Not authenticated, invalid credentials |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server-side error |
| `502` | Bad Gateway | External API (Gemini) returned invalid data |

### Error Examples

**Missing Required Field:**
```json
{
  "error": "Username and password are required"
}
```

**Unauthorized:**
```json
{
  "error": "Unauthorized. Please login first."
}
```

**File Too Large:**
```json
{
  "error": "File size exceeds 50MB limit"
}
```

---

## Endpoints

### Authentication Endpoints

---

#### POST /api/auth/login

Authenticate user and create session.

**Authentication:** Not required (public endpoint)  
**Rate Limit:** 5 attempts per 15 minutes per IP

##### Request

**Method:** `POST`  
**Content-Type:** `application/json`

**Body:**

```json
{
  "username": "admin",
  "password": "your_secure_password"
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | Username (set in `APP_USERNAME` env var) |
| `password` | string | Yes | Password (matches `APP_PASSWORD_HASH`) |

##### Response

**Success (200 OK):**

```json
{
  "success": true,
  "message": "Login successful",
  "username": "admin"
}
```

**Invalid Credentials (401 Unauthorized):**

```json
{
  "error": "Invalid username or password",
  "remainingAttempts": 4
}
```

**Rate Limited (429 Too Many Requests):**

```json
{
  "error": "Too many login attempts. Please try again in 14 minutes.",
  "retryAfter": "2026-01-19T10:30:00.000Z"
}
```

**Missing Fields (400 Bad Request):**

```json
{
  "error": "Username and password are required"
}
```

##### Example (cURL)

```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "your_password"
  }' \
  -c cookies.txt
```

##### Example (JavaScript)

```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'your_password',
  }),
  credentials: 'include', // Important: Include cookies
});

const data = await response.json();

if (response.ok) {
  console.log('Logged in:', data.username);
} else {
  console.error('Login failed:', data.error);
}
```

---

#### POST /api/auth/logout

Destroy session and logout user.

**Authentication:** Not required (but session will be destroyed if exists)  
**Rate Limit:** None

##### Request

**Method:** `POST`  
**Content-Type:** `application/json` (body optional)

**Body:** None required

##### Response

**Success (200 OK):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Server Error (500):**

```json
{
  "error": "An error occurred during logout"
}
```

##### Example (cURL)

```bash
curl -X POST https://your-app.vercel.app/api/auth/logout \
  -b cookies.txt
```

##### Example (JavaScript)

```javascript
const response = await fetch('/api/auth/logout', {
  method: 'POST',
  credentials: 'include',
});

const data = await response.json();
console.log(data.message); // "Logout successful"
```

---

#### GET /api/auth/check

Check if user is authenticated and return session info.

**Authentication:** Not required  
**Rate Limit:** None

##### Request

**Method:** `GET`

##### Response

**Authenticated (200 OK):**

```json
{
  "authenticated": true,
  "username": "admin",
  "loggedInAt": "2026-01-19T09:30:00.000Z"
}
```

**Not Authenticated (200 OK):**

```json
{
  "authenticated": false
}
```

**Server Error (500):**

```json
{
  "authenticated": false,
  "error": "An error occurred checking session"
}
```

##### Example (cURL)

```bash
curl https://your-app.vercel.app/api/auth/check \
  -b cookies.txt
```

##### Example (JavaScript)

```javascript
const response = await fetch('/api/auth/check', {
  credentials: 'include',
});

const data = await response.json();

if (data.authenticated) {
  console.log('User is logged in as:', data.username);
} else {
  console.log('User is not logged in');
}
```

---

### Audio Processing

---

#### POST /api/process-audio

Process Burmese voice note with Gemini AI and save to Notion.

**Authentication:** Required (must be logged in)  
**Rate Limit:** Subject to Gemini API limits (15 req/min, 1,500 req/day)

##### Request

**Method:** `POST`  
**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `audio` | File | Yes | Audio file (WebM, WAV, MP3, M4A, OGG, FLAC) |

**Constraints:**

- **Max file size:** 50MB
- **Max duration:** 15 minutes (recommended)
- **Supported formats:** WebM, WAV, MP3, M4A, OGG, FLAC
- **Language:** Burmese (my-MM) or English

##### Response

**Success (200 OK):**

```json
{
  "success": true,
  "title": "အကြောင်းအရာ စာတမ်း",
  "content": "ဒီနေ့ မနက်ပိုင်းမှာ အလုပ်နဲ့ ပတ်သက်ပြီး တွေးမိတဲ့ အကြောင်းတွေကို မှတ်တမ်းတင်ထားချင်ပါတယ်...",
  "summary": "အလုပ်နဲ့ ပတ်သက်တဲ့ အကြံဉာဏ်တွေကို မှတ်ချက်ပြုထားတယ်။",
  "category": "Personal",
  "categoryIcon": "✨",
  "tags": ["work", "reflection", "planning"],
  "notionUrl": "https://www.notion.so/workspace/Page-abc123"
}
```

**Fields in Response:**

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Always `true` on success |
| `title` | string | Note title (Burmese/English, max 10 words) |
| `content` | string | Full transcription (Burmese) |
| `summary` | string | Brief summary (1-2 sentences, Burmese) |
| `category` | string | Category: "Project", "Learning", "Personal", or "Task" |
| `categoryIcon` | string | Icon emoji for category (🚀, 📚, ✨, ✅) |
| `tags` | string[] | 3-5 relevant tags (English) |
| `notionUrl` | string | Direct link to created Notion page |

**Not Authenticated (401 Unauthorized):**

```json
{
  "error": "Unauthorized. Please login first."
}
```

**No Audio File (400 Bad Request):**

```json
{
  "error": "No audio file provided"
}
```

**Invalid File Format (400 Bad Request):**

```json
{
  "error": "Invalid audio file format"
}
```

**File Too Large (400 Bad Request):**

```json
{
  "error": "File size exceeds 50MB limit"
}
```

**Unsupported Format (400 Bad Request):**

```json
{
  "error": "Unsupported audio format. Supported: webm, wav, mp3, m4a, ogg, flac"
}
```

**Gemini API Error (502 Bad Gateway):**

```json
{
  "error": "Invalid response format from Gemini API"
}
```

**Server Error (500):**

```json
{
  "error": "Failed to process audio"
}
```

##### Example (cURL)

```bash
curl -X POST https://your-app.vercel.app/api/process-audio \
  -H "Content-Type: multipart/form-data" \
  -F "audio=@voice-note.webm" \
  -b cookies.txt
```

##### Example (JavaScript - FormData)

```javascript
const formData = new FormData();
formData.append('audio', audioBlob, 'voice-note.webm');

const response = await fetch('/api/process-audio', {
  method: 'POST',
  body: formData,
  credentials: 'include',
});

const data = await response.json();

if (response.ok) {
  console.log('Note processed:', data.title);
  console.log('Notion URL:', data.notionUrl);
} else {
  console.error('Processing failed:', data.error);
}
```

##### Example (JavaScript - File Input)

```javascript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const formData = new FormData();
formData.append('audio', file);

const response = await fetch('/api/process-audio', {
  method: 'POST',
  body: formData,
  credentials: 'include',
});

const result = await response.json();
```

---

#### GET /api/process-audio

Get endpoint information.

**Authentication:** Not required  
**Rate Limit:** None

##### Request

**Method:** `GET`

##### Response

**Success (200 OK):**

```json
{
  "endpoint": "/api/process-audio",
  "method": "POST",
  "description": "Process Burmese voice notes with Gemini AI",
  "authentication": "Required (session-based)",
  "requestFormat": "multipart/form-data",
  "requestFields": {
    "audio": "Audio file (required) - WebM, WAV, MP3, M4A, OGG, FLAC"
  },
  "constraints": {
    "maxFileSize": "50MB",
    "maxDuration": "15 minutes",
    "language": "Burmese (my-MM)"
  },
  "responseFormat": {
    "success": "boolean",
    "data": {
      "title": "string (original language as spoken - Burmese, English, or mixed, max 10 words)",
      "content": "string (full transcription in Burmese)",
      "summary": "string (1-2 sentences in Burmese)",
      "category": "Project | Learning | Personal | Task",
      "tags": "string[] (3-5 tags in English only)"
    }
  }
}
```

##### Example (cURL)

```bash
curl https://your-app.vercel.app/api/process-audio
```

---

### Notion Integration

---

#### GET /api/notion/test

Test Notion integration by creating a test page.

**Authentication:** Required (must be logged in)  
**Rate Limit:** None (use sparingly)

##### Request

**Method:** `GET`

##### Response

**Success (200 OK):**

```json
{
  "success": true,
  "message": "Test page created successfully in Notion!",
  "pageId": "abc123def456",
  "pageUrl": "https://www.notion.so/workspace/Test-Voice-Note-abc123",
  "categoryMapped": true,
  "note": "You can safely delete this test page from your Notion database."
}
```

**Not Authenticated (401 Unauthorized):**

```json
{
  "error": "Unauthorized"
}
```

**Missing API Key (500):**

```json
{
  "success": false,
  "error": "NOTION_API_KEY is not configured in environment variables"
}
```

**Missing Database ID (500):**

```json
{
  "success": false,
  "error": "NOTION_DATABASE_ID is not configured in environment variables"
}
```

**Database Access Failed (500):**

```json
{
  "success": false,
  "error": "Cannot access Notion database. Please check:\n1. Database ID is correct\n2. Database is shared with your integration\n3. API key is valid"
}
```

**Page Creation Failed (500):**

```json
{
  "success": false,
  "error": "Failed to create test page"
}
```

##### Example (cURL)

```bash
curl https://your-app.vercel.app/api/notion/test \
  -b cookies.txt
```

##### Example (JavaScript)

```javascript
const response = await fetch('/api/notion/test', {
  credentials: 'include',
});

const data = await response.json();

if (data.success) {
  console.log('Test page created:', data.pageUrl);
  console.log('Note:', data.note);
} else {
  console.error('Test failed:', data.error);
}
```

---

## Data Models

### ProcessedNote

The structured output from Gemini AI after processing audio.

```typescript
{
  success: boolean;           // Always true on success
  title: string;              // Note title (Burmese/English, max 10 words)
  content: string;            // Full transcription (Burmese)
  summary: string;            // Brief summary (1-2 sentences, Burmese)
  category: CategoryName;     // "Project" | "Learning" | "Personal" | "Task"
  categoryIcon: string;       // Category icon emoji
  tags: string[];             // 3-5 relevant tags (English only)
  notionUrl: string;          // Direct link to created Notion page
}
```

### Session

User session data stored in encrypted cookie.

```typescript
{
  isLoggedIn: boolean;        // Authentication status
  username?: string;          // Username (only if logged in)
  loggedInAt?: string;        // ISO 8601 timestamp of login
}
```

### Category

Category configuration from `config/categories.json`.

```typescript
{
  name: string;               // "Project" | "Learning" | "Personal" | "Task"
  icon: string;               // Emoji icon (🚀, 📚, ✨, ✅)
  description: string;        // Detailed description for AI classification
}
```

---

## Categories & Tags

### Available Categories

Athan Notes supports 4 categories:

| Category | Icon | Description | AI Classification Hints |
|----------|------|-------------|------------------------|
| **Project** | 🚀 | Work & Ideas | Business ideas, app ideas, work projects, startups, brainstorming, entrepreneurship, product development |
| **Learning** | 📚 | Education | Study notes, education, courses, tutorials, knowledge acquisition, research, books, skills development |
| **Personal** | ✨ | Private Thoughts | Private thoughts, diary entries, personal reflections, emotions, daily experiences, journaling |
| **Task** | ✅ | To-Do Items | To-dos, action items, reminders, checklists, things to complete, errands, responsibilities |

### Category Selection

Categories are **automatically selected by Gemini AI** based on:

1. Voice note content analysis
2. Semantic matching against category descriptions
3. Contextual understanding of intent

You cannot manually specify a category in the API request - Gemini chooses the best fit.

### Tags

- **Automatically generated** by Gemini AI
- **3-5 tags** per note
- **Always in English** (for consistency)
- **Based on content:** Topics, themes, keywords, entities mentioned
- **Searchable** in Notion

**Tag Examples:**
- Technical content: `["python", "web-development", "tutorial"]`
- Personal thoughts: `["reflection", "goals", "motivation"]`
- Project ideas: `["startup", "mvp", "saas"]`
- Tasks: `["urgent", "work", "meeting"]`

---

## Testing the API

### 1. Test Authentication

**Login:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}' \
  -c cookies.txt
```

**Check session:**

```bash
curl http://localhost:3000/api/auth/check \
  -b cookies.txt
```

**Logout:**

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

### 2. Test Notion Integration

```bash
curl http://localhost:3000/api/notion/test \
  -b cookies.txt
```

This creates a test page in your Notion database. You can safely delete it afterward.

### 3. Test Audio Processing

**Record a short voice note and save as `test.webm`, then:**

```bash
curl -X POST http://localhost:3000/api/process-audio \
  -F "audio=@test.webm" \
  -b cookies.txt
```

### 4. Test Rate Limiting

**Try logging in 6 times with wrong password:**

```bash
for i in {1..6}; do
  echo "Attempt $i:"
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"wrong"}'
  echo -e "\n"
done
```

After 5 attempts, you should see rate limit error.

---

## Common Use Cases

### Use Case 1: Voice Note Recording Flow

**Full workflow from recording to Notion:**

```javascript
// 1. Check if user is logged in
const checkAuth = async () => {
  const res = await fetch('/api/auth/check', { credentials: 'include' });
  const data = await res.json();
  return data.authenticated;
};

// 2. Login if needed
const login = async (username, password) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });
  return res.json();
};

// 3. Record audio (using MediaRecorder API)
let mediaRecorder;
let audioChunks = [];

const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  
  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };
  
  mediaRecorder.start();
};

const stopRecording = () => {
  return new Promise((resolve) => {
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      resolve(audioBlob);
    };
    mediaRecorder.stop();
  });
};

// 4. Process and save to Notion
const processVoiceNote = async (audioBlob) => {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'voice-note.webm');
  
  const res = await fetch('/api/process-audio', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  
  return res.json();
};

// Complete flow
const recordAndSave = async () => {
  // Check authentication
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    await login('admin', 'password');
  }
  
  // Record
  await startRecording();
  await new Promise(resolve => setTimeout(resolve, 5000)); // Record for 5 seconds
  const audioBlob = await stopRecording();
  
  // Process
  const result = await processVoiceNote(audioBlob);
  console.log('Note saved to Notion:', result.notionUrl);
};
```

### Use Case 2: Batch Processing Voice Notes

**Process multiple audio files:**

```javascript
const processMultipleNotes = async (files) => {
  const results = [];
  
  for (const file of files) {
    const formData = new FormData();
    formData.append('audio', file);
    
    try {
      const res = await fetch('/api/process-audio', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      const data = await res.json();
      results.push({ file: file.name, success: true, data });
    } catch (error) {
      results.push({ file: file.name, success: false, error: error.message });
    }
    
    // Add delay to respect Gemini rate limits (15 req/min = 4 seconds between requests)
    await new Promise(resolve => setTimeout(resolve, 4000));
  }
  
  return results;
};

// Usage
const fileInput = document.querySelector('input[type="file"][multiple]');
const files = Array.from(fileInput.files);
const results = await processMultipleNotes(files);
console.log('Batch processing complete:', results);
```

### Use Case 3: Error Handling & Retry Logic

**Robust error handling with retry:**

```javascript
const processWithRetry = async (audioBlob, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-note.webm');
      
      const res = await fetch('/api/process-audio', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (res.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      
      if (res.status === 429) {
        const retryAfter = res.headers.get('Retry-After');
        throw new Error(`RATE_LIMITED:${retryAfter}`);
      }
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Processing failed');
      }
      
      return await res.json();
      
    } catch (error) {
      lastError = error;
      
      // Don't retry auth errors
      if (error.message === 'UNAUTHORIZED') {
        throw error;
      }
      
      // For rate limit, wait and retry
      if (error.message.startsWith('RATE_LIMITED')) {
        const seconds = parseInt(error.message.split(':')[1]);
        console.log(`Rate limited. Waiting ${seconds} seconds...`);
        await new Promise(resolve => setTimeout(resolve, seconds * 1000));
        continue;
      }
      
      // For other errors, exponential backoff
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};
```

### Use Case 4: Verify Deployment Setup

**Test all integrations after deployment:**

```javascript
const verifyDeployment = async () => {
  const tests = {
    auth: false,
    notion: false,
    gemini: false,
  };
  
  try {
    // 1. Test authentication
    const loginRes = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: process.env.APP_USERNAME, 
        password: process.env.APP_PASSWORD 
      }),
      credentials: 'include',
    });
    tests.auth = loginRes.ok;
    
    if (!tests.auth) {
      console.error('❌ Authentication failed');
      return tests;
    }
    console.log('✅ Authentication working');
    
    // 2. Test Notion integration
    const notionRes = await fetch('/api/notion/test', {
      credentials: 'include',
    });
    const notionData = await notionRes.json();
    tests.notion = notionData.success;
    
    if (tests.notion) {
      console.log('✅ Notion integration working');
      console.log('   Test page:', notionData.pageUrl);
    } else {
      console.error('❌ Notion integration failed:', notionData.error);
    }
    
    // 3. Test Gemini AI (requires actual audio file)
    // Skip for automated testing, requires manual test
    console.log('⚠️  Gemini AI test requires manual voice recording');
    
  } catch (error) {
    console.error('❌ Deployment verification failed:', error);
  }
  
  return tests;
};

// Run verification
verifyDeployment().then(results => {
  console.log('\nDeployment Verification Results:', results);
});
```

---

## Environment Variables Reference

These environment variables must be configured for the API to work:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `GEMINI_API_KEY` | Yes | Google AI Studio API key | `AIzaSy...` |
| `NOTION_API_KEY` | Yes | Notion integration API key | `ntn_...` |
| `NOTION_DATABASE_ID` | Yes | Target Notion database ID | `abc123def456...` |
| `APP_USERNAME` | Yes | Login username | `admin` |
| `APP_PASSWORD_HASH` | Yes | Bcrypt hash of password | `$2b$10$...` |
| `SESSION_SECRET` | Yes | 64-char random string for session encryption | `7c8b4675...` |
| `SESSION_MAX_AGE` | No | Session lifetime in seconds (default: 345600 = 4 days) | `345600` |

**See:** `DEPLOYMENT_GUIDE.md` for instructions on generating credentials.

---

## API Limitations

### File Upload Limits

- **Max file size:** 50MB
- **Supported formats:** WebM, WAV, MP3, M4A, OGG, FLAC
- **Recommended duration:** Under 15 minutes

### Rate Limits

- **Login attempts:** 5 per 15 minutes per IP
- **Gemini API:** 15 requests/minute, 1,500 requests/day (free tier)
- **Notion API:** 3 requests/second

### Processing Time

Voice note processing typically takes:

- **1 minute audio:** ~5-10 seconds
- **5 minute audio:** ~15-30 seconds
- **10 minute audio:** ~30-60 seconds

Times vary based on:
- Audio file size
- Gemini API response time
- Notion API response time
- Network conditions

---

## Security Best Practices

### For API Consumers

1. **Always use HTTPS** in production
2. **Never log or expose** session cookies
3. **Include `credentials: 'include'`** in fetch requests
4. **Validate user input** before sending to API
5. **Handle errors gracefully** - don't expose sensitive info to users
6. **Implement rate limiting** on client side to avoid hitting server limits
7. **Clear sensitive data** from memory after use

### For API Deployment

1. **Set strong `SESSION_SECRET`** (64+ random characters)
2. **Use bcrypt password hash** (never store plain text)
3. **Enable HTTPS** (automatic on Vercel)
4. **Keep API keys secure** (never commit to Git)
5. **Monitor rate limits** and failed login attempts
6. **Regularly update dependencies** (`npm audit`)
7. **Review Vercel/Gemini/Notion logs** for suspicious activity

---

## Troubleshooting

### "Unauthorized" on /api/process-audio

**Problem:** Getting 401 error when calling `/api/process-audio`

**Solution:**
1. Make sure you're logged in first (`POST /api/auth/login`)
2. Include `credentials: 'include'` in fetch options
3. Check that cookies are enabled in browser
4. Verify session hasn't expired (4 day limit)

### "Too many login attempts"

**Problem:** Getting 429 rate limit error on login

**Solution:**
1. Wait 15 minutes for rate limit to reset
2. Or restart the server to clear in-memory rate limit store
3. Check you're using correct credentials

### "Cannot access Notion database"

**Problem:** `/api/notion/test` returns database access error

**Solution:**
1. Verify `NOTION_DATABASE_ID` is correct (from database URL)
2. Check database is shared with integration (Connections menu)
3. Confirm `NOTION_API_KEY` is valid
4. Ensure database has required properties: Name (title), Summary (text), Category (select), Tags (multi-select)

### "Failed to process audio"

**Problem:** `/api/process-audio` returns 500 error

**Solution:**
1. Check `GEMINI_API_KEY` is set and valid
2. Verify audio file is under 50MB
3. Confirm audio format is supported
4. Check Gemini API quota not exceeded (1,500/day free tier)
5. Review server logs for detailed error message

### Session not persisting

**Problem:** Have to login on every request

**Solution:**
1. Include `credentials: 'include'` in all fetch calls
2. Check cookies are enabled in browser
3. Verify `SESSION_SECRET` is set (required for encryption)
4. In development: Make sure using same origin (localhost:3000)
5. In production: Ensure HTTPS is enabled

---

## Changelog

### Version 1.0.0 - January 19, 2026

- Initial API release
- Authentication endpoints (login, logout, check)
- Audio processing with Gemini AI
- Automatic Notion integration
- Rate limiting on login endpoint
- Session-based authentication
- Support for 4 categories (Project, Learning, Personal, Task)
- Automatic tag generation
- File upload validation
- Comprehensive error handling

---

## Support & Resources

**Documentation:**
- `DEPLOYMENT_GUIDE.md` - How to deploy
- `INSTALLATION_GUIDE.md` - User guide
- `SECURITY.md` - Security features
- `CUSTOMIZE_CATEGORIES.md` - Customize categories

**External APIs:**
- Gemini API: https://ai.google.dev/docs
- Notion API: https://developers.notion.com/
- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

**Issues & Questions:**
- GitHub Issues: https://github.com/Showwaiyan/athan-notes/issues

---

**API Documentation Version:** 1.0.0  
**Last Updated:** January 19, 2026  
**Base URL:** `https://your-deployment.vercel.app`  
**Authentication:** Session-based (HTTP-only cookies)
