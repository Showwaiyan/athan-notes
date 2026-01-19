import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials } from '@/lib/auth';
import { createSession } from '@/lib/session';
import { checkRateLimit, resetRateLimit } from '@/lib/rateLimit';

/**
 * POST /api/auth/login
 * Authenticate user and create session
 * Rate limited: 5 attempts per 15 minutes per IP address
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP address for rate limiting
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() 
      || request.headers.get('x-real-ip')
      || 'unknown';
    
    // Check rate limit
    const rateLimit = checkRateLimit(clientIp);
    
    if (!rateLimit.allowed) {
      const resetTime = new Date(rateLimit.resetTime);
      const minutesRemaining = Math.ceil((rateLimit.resetTime - Date.now()) / 60000);
      
      return NextResponse.json(
        { 
          error: `Too many login attempts. Please try again in ${minutesRemaining} minute${minutesRemaining > 1 ? 's' : ''}.`,
          retryAfter: resetTime.toISOString(),
        },
        { 
          status: 429, // Too Many Requests
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }
    
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
        { 
          error: 'Invalid username or password',
          remainingAttempts: rateLimit.remainingAttempts,
        },
        { status: 401 }
      );
    }

    // Successful login - reset rate limit for this IP
    resetRateLimit(clientIp);
    
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
