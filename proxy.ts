import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/lib/session';

/**
 * Proxy to protect routes and enforce authentication
 * Runs before every request to check if user is authenticated
 */
export async function proxy(request: NextRequest) {
  // Get current session
  const session = await getSession();

  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/api/auth/login'];
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Allow public paths without authentication
  if (isPublicPath) {
    // If user is already logged in and tries to access /login, redirect to home
    if (session.isLoggedIn && request.nextUrl.pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!session.isLoggedIn) {
    // User not authenticated → redirect to login
    const loginUrl = new URL('/login', request.url);
    // Add redirect parameter so we can return user after login
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated → allow access
  return NextResponse.next();
}

/**
 * Configure which routes the proxy runs on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
