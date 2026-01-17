# Athan Notes 🎙️

A Next.js web application that records Burmese voice notes, transcribes and structures them using Gemini AI, and automatically saves them to Notion.

**Perfect for:** Capturing ideas, taking notes, and organizing thoughts in Burmese language through voice.

---

## Features

- 🎙️ **Voice Recording:** Record Burmese voice notes directly in the browser
- 🤖 **AI Processing:** Gemini 2.5 Flash transcribes, summarizes, and categorizes your notes
- 📝 **Notion Integration:** Automatically saves to your Notion database with rich metadata
- 🔒 **Session Authentication:** Secure single-user authentication with bcrypt
- ⚙️ **Customizable Categories:** Easily configure categories to match your workflow
- 🏷️ **Smart Tagging:** AI extracts relevant tags from your voice notes
- 📱 **Responsive Design:** Works on desktop and mobile devices

---

## Quick Start

### Prerequisites

- Node.js 18+ installed
- A Notion account with API access
- A Google Cloud account with Gemini API access
- Notion database set up (see [Setup Guide](#notion-database-setup))

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd athan-notes
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NOTION_API_KEY=your_notion_api_key_here
   NOTION_DATABASE_ID=your_database_id_here
   
   APP_USERNAME=admin
   APP_PASSWORD_HASH=your_bcrypt_hash_here
   SESSION_SECRET=your_random_secret_here
   ```

4. **Set up categories:**
   ```bash
   cp config/categories.example.json config/categories.json
   ```
   
   Edit `config/categories.json` to customize your categories (optional).

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open in browser:**
   ```
   http://localhost:3000
   ```

7. **Login:**
   - Default username: `admin`
   - Default password: `admin123` (change this!)

---

## Customizing Categories

Categories help organize your voice notes. You can easily customize them to match your workflow.

### Quick Setup

1. Copy the example config:
   ```bash
   cp config/categories.example.json config/categories.json
   ```

2. Edit `config/categories.json` with your categories:
   ```json
   {
     "categories": [
       {
         "name": "Work",
         "icon": "💼",
         "description": "Work tasks, meetings, professional notes"
       },
       {
         "name": "Personal",
         "icon": "✨",
         "description": "Personal thoughts, diary, reflections"
       }
     ]
   }
   ```

3. Update your Notion database Category property to match the names exactly (case-sensitive)

4. Restart the app

**📖 For detailed instructions, see [docs/CUSTOMIZE_CATEGORIES.md](docs/CUSTOMIZE_CATEGORIES.md)**

---

## Notion Database Setup

### Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "+ New integration"
3. Name it "Athan Notes" and select your workspace
4. Copy the "Internal Integration Token" (this is your `NOTION_API_KEY`)

### Create a Database

1. Create a new page in Notion
2. Add a database (full page or inline)
3. Add these properties:

   | Property Name | Type | Required |
   |---------------|------|----------|
   | Name | Title | ✅ Yes |
   | Summary | Text | ✅ Yes |
   | Category | Select | ✅ Yes |
   | Tags | Multi-select | ✅ Yes |
   | Created At | Created time | Optional |

4. **Important:** Add category options that match your `config/categories.json`:
   - Click on "Category" property
   - Add options: Project, Learning, Personal, Task (or your custom categories)
   - Names must match exactly (case-sensitive)

5. Share the database with your integration:
   - Click "Share" button
   - Invite your integration (Athan Notes)

6. Copy the database ID from the URL:
   ```
   https://notion.so/workspace/DATABASE_ID?v=...
                              ^^^^^^^^^^^
   ```

---

## Environment Variables

Create `.env.local` with these variables:

```env
# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key

# Notion API Key and Database ID
NOTION_API_KEY=your_notion_integration_token
NOTION_DATABASE_ID=your_database_id

# Authentication
APP_USERNAME=admin
APP_PASSWORD_HASH=your_bcrypt_hash
SESSION_SECRET=your_random_secret_64_chars
SESSION_MAX_AGE=345600
```

### Generating Password Hash

```bash
# Install bcryptjs globally
npm install -g bcryptjs-cli

# Generate hash
bcrypt-cli hash admin123 10
```

Or use Node.js:
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your_password', 10);
console.log(hash);
```

### Generating Session Secret

```bash
openssl rand -hex 32
```

---

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Linting
npm run lint
```

### Project Structure

```
athan-notes/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── notion/          # Notion integration endpoints
│   │   └── process-audio/   # Audio processing endpoint
│   ├── login/               # Login page
│   └── page.tsx             # Main app page
├── lib/                     # Core libraries
│   ├── categoryConfig.ts    # Category configuration loader
│   ├── gemini.ts           # Gemini AI integration
│   └── notion.ts           # Notion integration
├── components/             # React components
├── config/                 # Configuration files
│   └── categories.example.json  # Example categories
├── docs/                   # Documentation
│   └── CUSTOMIZE_CATEGORIES.md  # Category customization guide
└── __tests__/             # Test files
```

---

## How It Works

1. **User records** a voice note in Burmese using browser MediaRecorder API
2. **Audio is sent** to `/api/process-audio` endpoint
3. **Gemini AI processes** the audio in 5 steps:
   - Transcribes to Burmese text
   - Generates a summary
   - Assigns a category
   - Extracts tags
   - Creates a title
4. **Results are displayed** to the user
5. **User saves** to Notion database
6. **Notion page** is created with all metadata

---

## Technology Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **AI:** Google Gemini 2.5 Flash API
- **Database:** Notion API
- **Authentication:** iron-session + bcryptjs
- **Validation:** Zod
- **Testing:** Jest + React Testing Library

---

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with username/password
- `POST /api/auth/logout` - Logout and clear session
- `GET /api/auth/check` - Check authentication status

### Notion

- `GET /api/notion/test` - Test Notion connection

### Audio Processing

- `POST /api/process-audio` - Process Burmese audio file
- `GET /api/process-audio` - API documentation

---

## Testing

Run the test suite:

```bash
npm test
```

Test coverage:
```bash
npm test -- --coverage
```

Current test status: 76 tests passing ✅

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

1. Build the app:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

3. Set environment variables on your platform
4. Ensure Node.js 18+ is available

---

## Configuration

### Categories

Categories are fully customizable via `config/categories.json`. See [docs/CUSTOMIZE_CATEGORIES.md](docs/CUSTOMIZE_CATEGORIES.md) for detailed instructions.

**Default categories:**
- 🚀 **Project** - Business ideas, app ideas, work projects
- 📚 **Learning** - Study notes, education, courses
- ✨ **Personal** - Private thoughts, diary entries
- ✅ **Task** - To-dos, action items, reminders

### Audio Settings

Maximum audio file size: **50MB**  
Maximum duration: **15 minutes**  
Supported formats: WebM, WAV, MP3, M4A, OGG, FLAC

---

## Troubleshooting

### "No config/categories.json found" warning

**Solution:** Copy the example config:
```bash
cp config/categories.example.json config/categories.json
```

### "Invalid category, falling back to: Personal"

**Cause:** Category names don't match between config and Notion database.

**Solution:** Ensure category names in `config/categories.json` match your Notion database exactly (case-sensitive).

### Authentication errors

**Cause:** Invalid password hash or session secret.

**Solution:** Regenerate password hash using bcrypt and ensure SESSION_SECRET is set.

### More issues?

Check [docs/CUSTOMIZE_CATEGORIES.md](docs/CUSTOMIZE_CATEGORIES.md) for detailed troubleshooting.

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Google Gemini](https://deepmind.google/technologies/gemini/) for powerful AI capabilities
- [Notion](https://www.notion.so/) for the flexible database platform
- Burmese-speaking community for inspiration

---

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Made with ❤️ for the Burmese-speaking community**
