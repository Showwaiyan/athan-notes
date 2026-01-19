# Athan Notes 🎙️

A Next.js Progressive Web App (PWA) that records Burmese voice notes, transcribes and structures them using Gemini AI, and automatically saves them to Notion.

**Perfect for:** Capturing ideas, taking notes, and organizing thoughts in Burmese language through voice - anywhere, anytime, on any device.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Showwaiyan/athan-notes)

---

## ✨ Features

- 🎙️ **Voice Recording** - Record Burmese voice notes directly in your browser (no app needed)
- 🤖 **AI Processing** - Gemini 2.5 Flash transcribes, summarizes, and categorizes your notes intelligently
- 📝 **Notion Integration** - Automatically saves to your Notion database with rich metadata
- 🔒 **Secure Authentication** - Session-based auth with bcrypt password hashing and rate limiting
- ⚙️ **Customizable Categories** - Configure categories to match your workflow (4 defaults included)
- 🏷️ **Smart Tagging** - AI extracts 3-5 relevant tags from your voice notes
- 📱 **Progressive Web App** - Install on iOS/Android/Desktop for native-like experience
- 🌐 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🔐 **Privacy-First** - Your audio is processed and discarded - never stored permanently
- ⚡ **Lightning Fast** - Optimized for performance with Next.js 14 App Router

---

## 📚 Documentation

Complete documentation is available in the `docs/` folder:

### Getting Started
- **[Installation Guide](docs/INSTALLATION_GUIDE.md)** - For end-users: How to install and use Athan Notes as a PWA
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - For developers: Fork, clone, and deploy your own instance to Vercel

### Configuration & Customization
- **[Customize Categories](docs/CUSTOMIZE_CATEGORIES.md)** - Detailed guide to customizing categories and icons

### Security
- **[Security Overview](docs/SECURITY.md)** - Comprehensive security documentation (32 KB)
- **[Security Quick Guide](docs/SECURITY_QUICK_GUIDE.md)** - TL;DR version with checklists
- **[Security Architecture](docs/SECURITY_ARCHITECTURE.md)** - Visual diagrams and technical details
- **[Security Audit Report](docs/SECURITY_AUDIT_REPORT.md)** - Complete security audit findings

### API Reference
- **[API Documentation](docs/API_DOCUMENTATION.md)** - Complete API reference for all endpoints with examples

### Quick Links by User Type

**📱 For End Users:**
→ [Installation Guide](docs/INSTALLATION_GUIDE.md) - Install the app on your device

**👨‍💻 For Developers Deploying:**
→ [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Deploy your own instance in 15-20 minutes

**🔐 For Security-Conscious Users:**
→ [Security Quick Guide](docs/SECURITY_QUICK_GUIDE.md) - Quick security overview

**🛠️ For API Consumers:**
→ [API Documentation](docs/API_DOCUMENTATION.md) - Integrate with Athan Notes API

---

## 🚀 Quick Start

### For End Users (No Coding Required)

**Option 1: Use the Hosted Version**
1. Visit the deployed app URL (ask the developer)
2. Install to your device (see [Installation Guide](docs/INSTALLATION_GUIDE.md))
3. Login with provided credentials
4. Start recording voice notes!

**Option 2: Deploy Your Own Instance**
1. Follow the [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
2. Fork the repository
3. Deploy to Vercel (free, 15-20 minutes)
4. Install on your devices

### For Developers (Local Development)

**Prerequisites:**
- Node.js 20+ installed
- A Notion account with API access
- A Google Cloud account with Gemini API access

**Installation Steps:**

1. **Fork & Clone the repository:**
   ```bash
   # Fork on GitHub first, then:
   git clone https://github.com/YOUR_USERNAME/athan-notes.git
   cd athan-notes
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Generate credentials:**
   ```bash
   # Generate session secret
   npm run generate-secret
   
   # Generate password hash
   npm run hash-password YourSecurePassword123
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NOTION_API_KEY=your_notion_api_key_here
   NOTION_DATABASE_ID=your_database_id_here
   
   APP_USERNAME=admin
   APP_PASSWORD_HASH=your_generated_hash_here
   SESSION_SECRET=your_generated_secret_here
   SESSION_MAX_AGE=345600
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open in browser:**
   ```
   http://localhost:3000
   ```

**📖 For detailed deployment instructions, see [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)**

---

## 🎨 Customizing Categories

Categories help organize your voice notes. Athan Notes comes with 4 default categories, but you can easily customize them.

### Default Categories

- 🚀 **Project** - Business ideas, app ideas, work projects, startups, entrepreneurship
- 📚 **Learning** - Study notes, education, courses, tutorials, research, books
- ✨ **Personal** - Private thoughts, diary entries, reflections, journaling
- ✅ **Task** - To-dos, action items, reminders, checklists, errands

### How to Customize

1. Edit `config/categories.json`:
   ```json
   {
     "categories": [
       {
         "name": "Work",
         "icon": "💼",
         "description": "Work tasks, meetings, professional notes"
       }
     ]
   }
   ```

2. Update your Notion database Category property to match the names exactly

3. Restart the app

**📖 For detailed customization instructions, see [Customize Categories Guide](docs/CUSTOMIZE_CATEGORIES.md)**

---

## 📝 Notion Database Setup

### Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "+ New integration"
3. Name it "Athan Notes" and select your workspace
4. Copy the "Internal Integration Token" (this is your `NOTION_API_KEY`)

### Create a Database

1. Create a new page in Notion
2. Add a database (table - inline or full page)
3. Add these properties:

   | Property Name | Type | Required | Description |
   |---------------|------|----------|-------------|
   | **Name** | Title | ✅ Yes | Note title (auto-created) |
   | **Summary** | Text | ✅ Yes | Brief summary of the note |
   | **Category** | Select | ✅ Yes | Project, Learning, Personal, or Task |
   | **Tags** | Multi-select | ✅ Yes | AI-generated tags |
   | **Created At** | Created time | Optional | Auto-timestamp |

4. **Important:** Add category options that match `config/categories.json`:
   - Click on "Category" property → Edit property
   - Add options: `Project`, `Learning`, `Personal`, `Task`
   - Names must match exactly (case-sensitive)

5. **Connect integration to database:**
   - Click "..." (top-right of database)
   - Select "Connections" → "+ Add connections"
   - Select your "Athan Notes" integration → "Confirm"

6. **Copy the database ID** from the URL:
   ```
   https://notion.so/workspace/DATABASE_ID?v=...
                              ^^^^^^^^^^^
   This is your NOTION_DATABASE_ID
   ```

**📖 For visual walkthrough, see [Deployment Guide - Step 4](docs/DEPLOYMENT_GUIDE.md#step-4-set-up-notion)**

---

## ⚙️ Environment Variables

Create `.env.local` with these variables:

```env
# Gemini AI API Key (from Google AI Studio)
GEMINI_API_KEY=AIzaSy...your_key_here

# Notion API Key and Database ID
NOTION_API_KEY=ntn_...your_integration_token
NOTION_DATABASE_ID=abc123...your_database_id

# Authentication
APP_USERNAME=admin
APP_PASSWORD_HASH=$2b$10$...your_bcrypt_hash
SESSION_SECRET=7c8b4675...your_64_char_random_string
SESSION_MAX_AGE=345600
```

### Getting API Keys

**Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIzaSy...`)

**Notion API Key & Database ID:**
- See [Notion Database Setup](#-notion-database-setup) section above

### Generating Credentials

**Password Hash:**
```bash
# Use the provided script
npm run hash-password YourSecurePassword123

# Output: $2b$10$RNLyaKjxBEkMi5XiuQGh3uZ6...
```

**Session Secret:**
```bash
# Use the provided script
npm run generate-secret

# Output: 7c8b4675692454e3997e0e734fbef969d6078ff9...
```

**📖 For detailed credential generation, see [Deployment Guide - Step 3](docs/DEPLOYMENT_GUIDE.md#step-3-generate-credentials)**

---

## 🧪 Development & Testing

### Available Scripts

```bash
# Development
npm run dev              # Start development server (localhost:3000)
npm run build            # Build for production
npm start                # Start production server

# Testing
npm test                 # Run test suite
npm test -- --watch      # Run tests in watch mode
npm test -- --coverage   # Run tests with coverage report

# Code Quality
npm run lint             # Run ESLint
npm run lint -- --fix    # Fix linting issues
npx tsc --noEmit         # Type check

# Credentials
npm run generate-secret  # Generate SESSION_SECRET
npm run hash-password    # Generate APP_PASSWORD_HASH
```

### Test Coverage

✅ **96 tests passing**
- Authentication flow
- Audio processing
- Notion integration
- Rate limiting
- Session management
- Category configuration

### Project Structure

```
athan-notes/
├── app/                         # Next.js App Router
│   ├── api/                     # API Routes
│   │   ├── auth/               # Authentication endpoints
│   │   │   ├── login/          # POST /api/auth/login
│   │   │   ├── logout/         # POST /api/auth/logout
│   │   │   └── check/          # GET /api/auth/check
│   │   ├── notion/             # Notion integration
│   │   │   └── test/           # GET /api/notion/test
│   │   └── process-audio/      # POST /api/process-audio
│   ├── login/                  # Login page
│   ├── page.tsx                # Main app page (voice recorder)
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── lib/                        # Core libraries
│   ├── auth.ts                 # Authentication logic
│   ├── session.ts              # Session management (iron-session)
│   ├── rateLimit.ts            # Rate limiting
│   ├── gemini.ts               # Gemini AI integration
│   ├── notion.ts               # Notion API client
│   └── categoryConfig.ts       # Category loader
├── components/                 # React components
│   ├── VoiceRecorder.tsx       # Voice recording component
│   ├── ProcessedNote.tsx       # Note display component
│   └── LoginForm.tsx           # Login form component
├── config/                     # Configuration
│   ├── categories.json         # Category definitions
│   └── categories.example.json # Example categories
├── docs/                       # Documentation (160 KB)
│   ├── API_DOCUMENTATION.md    # API reference
│   ├── DEPLOYMENT_GUIDE.md     # Deployment instructions
│   ├── INSTALLATION_GUIDE.md   # End-user guide
│   ├── CUSTOMIZE_CATEGORIES.md # Category customization
│   ├── SECURITY.md             # Security overview
│   ├── SECURITY_QUICK_GUIDE.md # Security TL;DR
│   ├── SECURITY_ARCHITECTURE.md# Security diagrams
│   └── SECURITY_AUDIT_REPORT.md# Audit findings
├── __tests__/                  # Test files
│   ├── auth.test.ts            # Auth tests
│   ├── gemini.test.ts          # AI processing tests
│   └── notion.test.ts          # Notion tests
├── public/                     # Static assets
│   ├── manifest.json           # PWA manifest
│   └── icons/                  # PWA icons
├── .env.example                # Example environment variables
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
└── package.json                # Dependencies & scripts
```

---

## 🎯 How It Works

```
1. User opens app and logs in
   ↓
2. User records voice note (Burmese or English)
   ↓
3. Audio sent to Gemini 2.5 Flash AI for processing
   ↓
4. AI transcribes, summarizes, categorizes, and extracts tags
   ↓
5. Processed note displayed to user
   ↓
6. User reviews and saves to Notion
   ↓
7. Notion page created with all metadata
   ↓
8. User receives direct link to Notion page
```

### What Gemini AI Does

1. **Transcribes** - Converts Burmese speech to text
2. **Summarizes** - Creates 1-2 sentence summary in Burmese
3. **Categorizes** - Assigns best-fit category (Project/Learning/Personal/Task)
4. **Tags** - Extracts 3-5 relevant tags in English
5. **Titles** - Generates concise title (max 10 words, original language)

### Data Flow

- **Audio** - Processed in real-time, never stored permanently
- **Transcription** - Sent to Notion, displayed in app
- **Session** - Encrypted in HTTP-only cookie, expires after 4 days
- **Credentials** - Securely stored in environment variables

**🔒 Privacy:** Your voice notes are ephemeral - processed and discarded immediately. Only the text transcription is saved to Notion.

---

## 🛠️ Technology Stack

**Frontend:**
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **PWA:** next-pwa for offline support
- **Audio:** MediaRecorder API

**Backend:**
- **Runtime:** Node.js 20+
- **API Routes:** Next.js API Routes
- **Authentication:** iron-session (AES-256 encrypted cookies)
- **Password Hashing:** bcryptjs (10 rounds)
- **Rate Limiting:** Custom in-memory rate limiter

**AI & Integrations:**
- **AI:** Google Gemini 2.5 Flash API
- **Database:** Notion API
- **Validation:** Zod schemas

**Testing & Quality:**
- **Testing:** Jest + React Testing Library
- **Type Checking:** TypeScript strict mode
- **Linting:** ESLint + Next.js config

**Security:**
- **Session Encryption:** AES-256-GCM
- **Headers:** Comprehensive security headers (CSP, HSTS, X-Frame-Options, etc.)
- **Rate Limiting:** 5 login attempts per 15 minutes
- **Input Validation:** Zod schemas for all inputs

**Deployment:**
- **Platform:** Vercel (recommended)
- **CI/CD:** GitHub integration
- **Edge:** Global CDN with automatic HTTPS

---

## 🔌 API Endpoints

### Authentication

- **`POST /api/auth/login`** - Login with username/password (rate limited: 5 attempts/15 min)
- **`POST /api/auth/logout`** - Logout and destroy session
- **`GET /api/auth/check`** - Check authentication status

### Audio Processing

- **`POST /api/process-audio`** - Process Burmese voice note (requires auth)
- **`GET /api/process-audio`** - Get endpoint information

### Notion Integration

- **`GET /api/notion/test`** - Test Notion connection (requires auth)

**📖 For complete API documentation with examples, see [API Documentation](docs/API_DOCUMENTATION.md)**

### API Example

```javascript
// Process voice note
const formData = new FormData();
formData.append('audio', audioBlob, 'voice-note.webm');

const response = await fetch('/api/process-audio', {
  method: 'POST',
  body: formData,
  credentials: 'include',
});

const result = await response.json();
console.log('Note saved:', result.notionUrl);
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- auth.test.ts

# Generate coverage report
npm test -- --coverage
```

### Test Status

✅ **96/96 tests passing**

**Coverage:**
- Authentication: ✅ Login, logout, session management, rate limiting
- Audio Processing: ✅ Gemini AI integration, file validation
- Notion Integration: ✅ Page creation, database validation
- Security: ✅ Password hashing, session encryption
- Category Configuration: ✅ Loading, validation, fallbacks

---

## 🚀 Deployment

### Recommended: Vercel (Free Tier)

**Quick Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Showwaiyan/athan-notes)

**Manual Deployment:**

1. **Fork the repository** on GitHub
2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your forked repository
3. **Add environment variables** in Vercel dashboard
4. **Deploy** - Takes 2-3 minutes

**📖 For detailed deployment instructions, see [Deployment Guide](docs/DEPLOYMENT_GUIDE.md)**

### Other Platforms

Athan Notes can be deployed to any platform that supports Next.js:

- **Netlify** - Similar to Vercel
- **Railway** - Pay-as-you-go
- **Docker + VPS** - Full control

See [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) for platform-specific instructions.

### Environment Variables Required

```env
GEMINI_API_KEY          # From Google AI Studio
NOTION_API_KEY          # From Notion integrations
NOTION_DATABASE_ID      # From Notion database URL
APP_USERNAME            # Your chosen username
APP_PASSWORD_HASH       # Generated with bcrypt
SESSION_SECRET          # 64-char random string
SESSION_MAX_AGE         # 345600 (4 days)
```

---

## ⚙️ Configuration & Constraints

### Audio Settings

- **Max file size:** 50MB
- **Max duration:** 15 minutes (recommended)
- **Supported formats:** WebM, WAV, MP3, M4A, OGG, FLAC
- **Language:** Burmese (my-MM) or English

### API Rate Limits

- **Login:** 5 attempts per 15 minutes per IP
- **Gemini API (Free Tier):** 15 requests/min, 1,500 requests/day
- **Notion API:** 3 requests/second

### Session Configuration

- **Lifetime:** 4 days (345,600 seconds)
- **Encryption:** AES-256-GCM
- **Cookie:** HTTP-only, secure, sameSite: lax
- **Auto-logout:** After session expiry

### Categories

**Default categories can be customized** via `config/categories.json`:

- 🚀 **Project** - Business ideas, app ideas, work projects
- 📚 **Learning** - Study notes, education, courses
- ✨ **Personal** - Private thoughts, diary entries
- ✅ **Task** - To-dos, action items, reminders

**📖 See [Customize Categories Guide](docs/CUSTOMIZE_CATEGORIES.md)**

---

## 🐛 Troubleshooting

### Common Issues

**"No config/categories.json found" warning**

Solution:
```bash
cp config/categories.example.json config/categories.json
```

**"Invalid category, falling back to: Personal"**

- **Cause:** Category names don't match between `config/categories.json` and Notion database
- **Solution:** Ensure category names match exactly (case-sensitive)
- See: [Customize Categories Guide](docs/CUSTOMIZE_CATEGORIES.md)

**"Unauthorized. Please login first."**

- **Cause:** Session expired or invalid credentials
- **Solution:** Login again at `/login`
- Sessions expire after 4 days

**"Too many login attempts. Please try again in X minutes."**

- **Cause:** Rate limit triggered (5 failed attempts)
- **Solution:** Wait 15 minutes or restart server to clear in-memory store

**"Failed to process audio"**

- **Cause:** Invalid audio format, file too large, or Gemini API error
- **Solution:**
  - Check file is under 50MB
  - Verify format is supported (WebM, WAV, MP3, M4A, OGG, FLAC)
  - Check `GEMINI_API_KEY` is set correctly
  - Verify Gemini API quota not exceeded

**"Cannot access Notion database"**

- **Cause:** Database not shared with integration or invalid credentials
- **Solution:**
  1. Verify `NOTION_DATABASE_ID` is correct
  2. Check database is shared with integration (Connections menu)
  3. Confirm `NOTION_API_KEY` is valid
  4. Ensure database has required properties: Name (title), Summary (text), Category (select), Tags (multi-select)

**Session not persisting**

- **Cause:** Missing `SESSION_SECRET` or cookies disabled
- **Solution:**
  - Generate and set `SESSION_SECRET` (64 characters)
  - Enable cookies in browser
  - Include `credentials: 'include'` in fetch calls

### Getting Help

**Documentation:**
- [Installation Guide](docs/INSTALLATION_GUIDE.md) - For end-users
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - For developers
- [API Documentation](docs/API_DOCUMENTATION.md) - For API consumers
- [Security Guide](docs/SECURITY.md) - For security questions

**Still Stuck?**
- Open an issue: [GitHub Issues](https://github.com/Showwaiyan/athan-notes/issues)
- Check existing issues for solutions
- Include error messages and steps to reproduce

---

## 🔒 Security

Athan Notes is built with **security as a top priority**. Your voice notes and personal data are protected using industry-standard security practices.

### Security Features

- 🔐 **Encrypted Sessions** - AES-256 encrypted cookies with iron-session
- 🔑 **Password Hashing** - bcrypt with 10 rounds (salted and one-way)
- 🛡️ **Rate Limiting** - 5 login attempts per 15 minutes per IP
- 🌐 **HTTPS Only** - All traffic encrypted with TLS 1.3 (Vercel)
- 🍪 **Secure Cookies** - httpOnly, secure, sameSite flags enabled
- 🛡️ **XSS Protection** - JavaScript cannot access session cookies
- 🚫 **CSRF Protection** - Cross-site requests blocked (SameSite policy)
- 📋 **Security Headers** - CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- ⏰ **Session Expiry** - Auto-logout after 4 days of inactivity
- 🔒 **Input Validation** - Zod schemas validate all inputs
- 🚪 **Instant Logout** - Destroy session immediately when needed
- 🔐 **No Audio Storage** - Voice recordings processed and discarded (ephemeral)

### Security Documentation

**Quick Start:**
- **[Security Quick Guide](docs/SECURITY_QUICK_GUIDE.md)** - TL;DR version with do's/don'ts and checklists

**In-Depth:**
- **[Security Overview](docs/SECURITY.md)** - Comprehensive security documentation (32 KB)
- **[Security Architecture](docs/SECURITY_ARCHITECTURE.md)** - Visual diagrams and technical details (27 KB)
- **[Security Audit Report](docs/SECURITY_AUDIT_REPORT.md)** - Complete audit findings (16 KB)

### Quick Security Checklist

✅ **DO:**
- Use a strong password (12+ characters, mixed case, numbers, symbols)
- Enable 2FA on your Notion and Google accounts
- Lock your device when not in use
- Logout when finished using the app
- Keep browser and OS updated
- Review Notion database access regularly

❌ **DON'T:**
- Use the app on public/shared computers
- Share your session cookies or credentials
- Leave your device unlocked
- Commit `.env.local` to Git (it's in `.gitignore`)
- Ignore suspicious activity in Notion
- Use weak passwords like "password123"

### Reporting Security Issues

If you discover a security vulnerability:

- ✅ **DO:** Contact the developer privately via email or private message
- ❌ **DON'T:** Open a public GitHub issue
- 📝 **INCLUDE:** Detailed description, steps to reproduce, impact assessment

We take security seriously and will respond to verified reports within 48 hours.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Ways to Contribute

- 🐛 **Report bugs** - Open an issue with steps to reproduce
- 💡 **Suggest features** - Describe your idea in an issue
- 📖 **Improve docs** - Fix typos, clarify instructions
- 🔧 **Submit PRs** - Fix bugs or add features
- ⭐ **Star the repo** - Show your support!

### Development Workflow

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/athan-notes.git
   ```
3. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes**
5. **Add tests** if applicable
6. **Run tests:**
   ```bash
   npm test
   npm run lint
   ```
7. **Commit with descriptive message:**
   ```bash
   git commit -m "Add: feature description"
   ```
8. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```
9. **Submit a Pull Request**

### Coding Standards

- Use TypeScript for type safety
- Follow existing code style (ESLint config)
- Write tests for new features
- Update documentation for user-facing changes
- Keep commits atomic and descriptive

### Areas for Contribution

**High Priority:**
- [ ] Multi-language support (English UI)
- [ ] Dark mode theme
- [ ] Audio playback before saving
- [ ] Edit notes before saving
- [ ] Export notes (JSON, Markdown)

**Nice to Have:**
- [ ] Mobile app (React Native)
- [ ] Multiple Notion databases
- [ ] Custom AI prompts
- [ ] Voice commands
- [ ] Notion template selection

### Questions?

Open a [Discussion](https://github.com/Showwaiyan/athan-notes/discussions) or comment on an existing issue.

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[Next.js](https://nextjs.org/)** - The React framework that makes this possible
- **[Google Gemini](https://deepmind.google/technologies/gemini/)** - Powerful AI for transcription and processing
- **[Notion](https://www.notion.so/)** - Flexible database platform for organizing notes
- **[Vercel](https://vercel.com/)** - Seamless deployment and hosting
- **Burmese-speaking community** - Inspiration and feedback

Special thanks to all contributors and users who make this project better!

---

## 📞 Support & Community

### Get Help

- 📖 **Documentation:** See `docs/` folder for comprehensive guides
- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/Showwaiyan/athan-notes/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/Showwaiyan/athan-notes/discussions)
- 📧 **Contact:** Open an issue or discussion

### Stay Updated

- ⭐ **Star this repo** to receive updates
- 👀 **Watch** for new releases and features
- 🍴 **Fork** to deploy your own instance

### Useful Links

- **Live Demo:** Coming soon
- **API Playground:** Available after deployment
- **Roadmap:** See [Issues](https://github.com/Showwaiyan/athan-notes/issues) for planned features

---

## 📊 Project Stats

- **Version:** 1.0.0
- **Tests:** 96/96 passing ✅
- **Documentation:** 160 KB across 8 files
- **Security Audit:** 0 vulnerabilities
- **Build Status:** Passing
- **License:** MIT
- **Node.js:** 20+
- **Next.js:** 14+

---

**Made with ❤️ for the Burmese-speaking community**

**Repository:** [github.com/Showwaiyan/athan-notes](https://github.com/Showwaiyan/athan-notes)  
**Deployment:** [Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/Showwaiyan/athan-notes)  
**Documentation:** [docs/](docs/)

---

*Athan (အသံ) means "voice" or "sound" in Burmese*
