# Proxy Documentation

This file contains the Next.js proxy that protects routes and enforces authentication.

## What is Proxy?

Proxy runs **before every request** reaches your pages or API routes. It acts as a gatekeeper, checking if users are authenticated and redirecting them as needed.

> **Note:** In Next.js 16+, the "middleware" convention has been renamed to "proxy" to better reflect its purpose as a network boundary in front of your app.

## How It Works

```
User Request → Proxy → Page/API Route
               ↓
         Check Session
               ↓
    Authenticated? Yes → Allow access
                   No  → Redirect to /login
```

## Route Protection Logic

### Public Routes (No Authentication Required)
- `/login` - Login page
- `/api/auth/login` - Login API endpoint
- `/api/auth/logout` - Logout API endpoint (anyone can logout)
- `/api/auth/check` - Session check endpoint

### Protected Routes (Authentication Required)
- `/` - Home page (voice recorder)
- All other pages and API routes

## Detailed Flow

### Scenario 1: User Not Logged In Visits Home
```
1. User visits: http://localhost:3000/
2. Middleware runs
3. getSession() → { isLoggedIn: false }
4. Path "/" is NOT in publicPaths
5. Redirect to: /login?redirect=/
```

### Scenario 2: User Logged In Visits Home
```
1. User visits: http://localhost:3000/
2. Middleware runs
3. getSession() → { isLoggedIn: true, username: "admin" }
4. Path "/" is NOT in publicPaths
5. Allow access ✓
```

### Scenario 3: User Not Logged In Visits Login
```
1. User visits: http://localhost:3000/login
2. Middleware runs
3. Path "/login" IS in publicPaths
4. Allow access ✓
```

### Scenario 4: User Already Logged In Visits Login
```
1. User visits: http://localhost:3000/login
2. Middleware runs
3. getSession() → { isLoggedIn: true }
4. Path "/login" IS in publicPaths
5. But user is already logged in!
6. Redirect to: / (home page)
```

## Redirect Parameter

When redirecting unauthenticated users to login, we include a `redirect` parameter:

```
User tries to visit: /dashboard
Redirected to: /login?redirect=/dashboard

After successful login:
Redirect user back to: /dashboard
```

This provides better UX - users return to where they intended to go.

## Matcher Configuration

```typescript
matcher: [
  '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
]
```

**What this excludes:**
- `_next/static/*` - Next.js static files (CSS, JS)
- `_next/image/*` - Next.js optimized images
- `favicon.ico` - Favicon
- `*.*` - Files with extensions (images, fonts, etc.)
- `public/*` - Public folder files

**Why exclude these?**
- Performance: Don't run auth check on static files
- Avoid infinite loops: Static files shouldn't redirect
- Better UX: Faster page loads

## Adding More Public Routes

To add more routes that don't require authentication:

```typescript
const publicPaths = [
  '/login',
  '/api/auth/login',
  '/about',        // ← Add public pages here
  '/help',
  '/api/public/*', // ← Use wildcards for API routes
];
```

## Security Features

1. **Always runs first** - Before any page renders
2. **Server-side only** - Can't be bypassed by client
3. **Session validation** - Decrypts and verifies cookie
4. **Prevents access to login when logged in** - Better UX
5. **Redirect tracking** - Returns users to intended page

## Testing Proxy

```bash
# Test unauthenticated access
curl -i http://localhost:3000/
# Should redirect to /login

# Test authenticated access (with cookie)
curl -i -H "Cookie: athan_session=..." http://localhost:3000/
# Should return 200 OK

# Test login page access
curl -i http://localhost:3000/login
# Should return 200 OK (always accessible)
```

## Common Issues

### Issue: Infinite redirect loop
**Cause:** Login page is not in publicPaths  
**Fix:** Ensure `/login` is in the publicPaths array in `proxy.ts`

### Issue: Static files not loading
**Cause:** Proxy running on static files  
**Fix:** Check matcher configuration in `proxy.ts` excludes them

### Issue: API routes always redirect
**Cause:** API route not in publicPaths  
**Fix:** Add API routes to publicPaths in `proxy.ts` or update matcher

## Performance

- Proxy runs on **every request** that matches the config
- Session decryption is very fast (~1ms)
- No database queries needed (stateless sessions)
- Minimal performance impact

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ PROXY EXECUTION FLOW                                        │
└─────────────────────────────────────────────────────────────┘

Every Request
     ↓
Is path in publicPaths?
     ├─ YES → Is user logged in AND path is /login?
     │         ├─ YES → Redirect to /
     │         └─ NO  → Allow access
     │
     └─ NO → Is user logged in?
              ├─ YES → Allow access
              └─ NO  → Redirect to /login?redirect=<current_path>
```

## Migration from Middleware

If you're migrating from the older `middleware.ts` file:
- Rename `middleware.ts` to `proxy.ts`
- Rename the exported function from `middleware` to `proxy`
- Update any documentation references from "middleware" to "proxy"

## Next Steps

After proxy is set up, you'll need:
1. Create `/login` page
2. Test authentication flow
3. Add logout button to protected pages
