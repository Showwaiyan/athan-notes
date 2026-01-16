# Authentication Setup Scripts

This folder contains utility scripts for setting up authentication in Athan Notes.

## Scripts

### 1. Generate Password Hash
Creates a bcrypt hash for your password to store in `.env.local`

```bash
npm run hash-password
```

You'll be prompted to enter your password. The script will output a hash like:
```
APP_PASSWORD_HASH=$2b$10$...
```

Copy this entire line to your `.env.local` file.

**Security Notes:**
- Password must be at least 6 characters
- Uses bcrypt with 10 salt rounds
- Hash is one-way (cannot be reversed)
- Even if someone gets your `.env.local`, they can't get the original password

### 2. Generate Session Secret
Creates a cryptographically secure random string for session encryption

```bash
npm run generate-secret
```

The script will output a random 64-character hex string:
```
SESSION_SECRET=a3ccbafb93e1f9f9f5bc3715a96764d96e360f017c410cfad3ff37a869ebe30b
```

Copy this entire line to your `.env.local` file.

**Security Notes:**
- Uses Node.js crypto module
- 32 bytes (256 bits) of entropy
- Required for iron-session to encrypt session cookies
- Keep this secret! Anyone with this can forge sessions

## Setup Instructions

1. Run both scripts:
   ```bash
   npm run generate-secret
   npm run hash-password
   ```

2. Copy the output to your `.env.local` file:
   ```env
   APP_USERNAME=admin
   APP_PASSWORD_HASH=$2b$10$...
   SESSION_SECRET=a3ccbafb93e1f9f9...
   SESSION_MAX_AGE=345600
   ```

3. You're ready to use authentication!

## Changing Your Password

To change your password later:
1. Run `npm run hash-password` with your new password
2. Update `APP_PASSWORD_HASH` in `.env.local`
3. Restart your Next.js server

## Security Best Practices

- ✅ Never commit `.env.local` to git (it's in `.gitignore`)
- ✅ Use a strong password (12+ characters recommended)
- ✅ Regenerate `SESSION_SECRET` if you suspect it's compromised
- ✅ Change your password periodically
- ❌ Don't share these values with anyone
- ❌ Don't store passwords in plaintext anywhere
