/**
 * Simple in-memory rate limiter for login attempts
 * Prevents brute force password attacks
 * 
 * NOTE: This is an in-memory implementation. For production with
 * multiple server instances, consider using Redis or a database.
 */

interface RateLimitEntry {
  attempts: number;
  resetTime: number;
}

// Store rate limit data in memory
// Key format: "login:{identifier}" (e.g., "login:192.168.1.1" or "login:username")
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP address or username)
 * @returns { allowed: boolean, remainingAttempts: number, resetTime: number }
 */
export function checkRateLimit(identifier: string): {
  allowed: boolean;
  remainingAttempts: number;
  resetTime: number;
} {
  const key = `login:${identifier}`;
  const now = Date.now();
  
  // Get existing entry
  const entry = rateLimitStore.get(key);
  
  // No entry or expired - allow and create new entry
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      attempts: 1,
      resetTime: now + WINDOW_MS,
    });
    
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS - 1,
      resetTime: now + WINDOW_MS,
    };
  }
  
  // Entry exists and not expired
  if (entry.attempts >= MAX_ATTEMPTS) {
    // Rate limit exceeded
    return {
      allowed: false,
      remainingAttempts: 0,
      resetTime: entry.resetTime,
    };
  }
  
  // Increment attempts
  entry.attempts += 1;
  rateLimitStore.set(key, entry);
  
  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - entry.attempts,
    resetTime: entry.resetTime,
  };
}

/**
 * Reset rate limit for a specific identifier
 * Call this after successful login to allow immediate retry
 * @param identifier - Unique identifier (IP address or username)
 */
export function resetRateLimit(identifier: string): void {
  const key = `login:${identifier}`;
  rateLimitStore.delete(key);
}

/**
 * Clean up expired entries from memory
 * Run periodically to prevent memory leaks
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every hour (only in non-test environments)
// Note: setInterval keeps the process alive, so we only run it when needed
let cleanupInterval: NodeJS.Timeout | null = null;

if (typeof global !== 'undefined' && process.env.NODE_ENV !== 'test') {
  cleanupInterval = setInterval(cleanupExpiredEntries, 60 * 60 * 1000);
  // Don't keep the process alive just for cleanup
  cleanupInterval.unref();
}

/**
 * Clear the cleanup interval (useful for testing)
 */
export function stopCleanup(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}
