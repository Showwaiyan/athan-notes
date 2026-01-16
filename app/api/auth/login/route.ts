import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials } from '@/lib/auth';
import { createSession } from '@/lib/session';

/**
 * POST /api/auth/login
 * Authenticate user and create session
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Verify credentials
    const isValid = await verifyCredentials(username, password);

    if (!isValid) {
      // Use same error message for both invalid username and password (security best practice)
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Create authenticated session
    await createSession(username);

    // Return success
    return NextResponse.json(
      { 
        success: true,
        message: 'Login successful',
        username 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
