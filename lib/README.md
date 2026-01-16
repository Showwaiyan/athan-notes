# Library Modules

This directory contains core utility functions for the Athan Notes application.

## Files

### `session.ts` - Session Management
Handles user authentication sessions using iron-session.

**Key Functions:**
- `getSession()` - Get current session data
- `createSession(username)` - Create authenticated session after login
- `destroySession()` - Logout and clear session
- `isAuthenticated()` - Check if user is logged in

**Session Data Structure:**
```typescript
interface SessionData {
  username?: string;
  isLoggedIn: boolean;
  loggedInAt?: number;
}
```

**Session Configuration:**
- Cookie name: `athan_session`
- Duration: 4 days (345,600 seconds)
- HttpOnly: Yes (XSS protection)
- Secure: Yes in production (HTTPS only)
- SameSite: Lax (CSRF protection)

**Example Usage:**
```typescript
// Check authentication
const session = await getSession();
if (session.isLoggedIn) {
  console.log(`User ${session.username} is logged in`);
}

// Create session after login
await createSession('admin');

// Logout
await destroySession();
```

---

### `auth.ts` - Authentication Helpers
Password verification and credential validation.

**Key Functions:**
- `verifyCredentials(username, password)` - Verify login credentials
- `hashPassword(password)` - Hash a password with bcrypt

**Example Usage:**
```typescript
// Verify login
const isValid = await verifyCredentials('admin', 'password123');
if (isValid) {
  await createSession('admin');
}

// Hash a new password
const hash = await hashPassword('newpassword');
console.log(`APP_PASSWORD_HASH=${hash}`);
```

---

## Security Notes

1. **Never log sensitive data** - Don't console.log passwords or session secrets
2. **Environment variables** - All auth config comes from `.env.local`
3. **Bcrypt** - Passwords hashed with 10 salt rounds
4. **Iron-session** - Sessions encrypted with AES-256
5. **HttpOnly cookies** - JavaScript cannot access session cookie (XSS protection)

## Dependencies

- `iron-session` - Session encryption and management
- `bcryptjs` - Password hashing
- `next/headers` - Next.js cookie access

## Flow Diagram

```
Login Request
     ↓
verifyCredentials() → Compare with .env
     ↓
Valid? → createSession() → Encrypted cookie sent to browser
     ↓
Subsequent Requests
     ↓
getSession() → Decrypt cookie → Check isLoggedIn
     ↓
Middleware allows/denies access
```
