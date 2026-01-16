import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

/**
 * GET /api/auth/check
 * Check if user is authenticated and return session info
 */
export async function GET() {
  try {
    // Get current session
    const session = await getSession();

    // Return session status
    if (session.isLoggedIn) {
      return NextResponse.json(
        {
          authenticated: true,
          username: session.username,
          loggedInAt: session.loggedInAt,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          authenticated: false,
        },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { 
        authenticated: false,
        error: 'An error occurred checking session' 
      },
      { status: 500 }
    );
  }
}
