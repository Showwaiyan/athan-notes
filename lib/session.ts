import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

/**
 * Session data structure
 */
export interface SessionData {
  username?: string;
  isLoggedIn: boolean;
  loggedInAt?: number;
}

/**
 * Iron-session configuration
 * Uses environment variables for security
 * 
 * NOTE: NODE_ENV is automatically set by Next.js:
 *   - npm run dev   → NODE_ENV=development (cookies work on HTTP)
 *   - npm run build → NODE_ENV=production (cookies require HTTPS)
 *   - Vercel        → NODE_ENV=production (always)
 * Do NOT add NODE_ENV to .env.local - Next.js handles it automatically
 */
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'athan_session',
  cookieOptions: {
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'lax', // CSRF protection
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '345600'), // 4 days default
    path: '/', // Available across entire app
  },
};

/**
 * Get the current session
 * @returns Session object with user data
 */
export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  // Ensure isLoggedIn is always boolean (not undefined)
  session.isLoggedIn = session.isLoggedIn ?? false;

  return session;
}

/**
 * Create a new authenticated session
 * @param username - The username to store in session
 */
export async function createSession(username: string): Promise<void> {
  const session = await getSession();
  
  session.username = username;
  session.isLoggedIn = true;
  session.loggedInAt = Date.now();
  
  await session.save();
}

/**
 * Destroy the current session (logout)
 */
export async function destroySession(): Promise<void> {
  const session = await getSession();
  session.destroy();
}

/**
 * Check if user is authenticated
 * @returns True if user is logged in
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isLoggedIn === true;
}
