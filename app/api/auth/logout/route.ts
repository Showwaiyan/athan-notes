import { NextResponse } from 'next/server';
import { destroySession } from '@/lib/session';

/**
 * POST /api/auth/logout
 * Destroy session and logout user
 */
export async function POST() {
  try {
    // Destroy the session
    await destroySession();

    // Return success
    return NextResponse.json(
      { 
        success: true,
        message: 'Logout successful' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}
