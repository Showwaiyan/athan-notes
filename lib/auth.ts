import bcrypt from 'bcryptjs';

/**
 * Verify if provided credentials match the environment variables
 * @param username - Username to verify
 * @param password - Plain text password to verify
 * @returns True if credentials are valid
 */
export async function verifyCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const envUsername = process.env.APP_USERNAME;
  // Remove backslashes from password hash to support both local (.env.local with escaped \$)
  // and Vercel (raw value with literal backslashes) environments
  const envPasswordHash = process.env.APP_PASSWORD_HASH?.replace(/\\/g, '');

  // Check if environment variables are set
  if (!envUsername || !envPasswordHash) {
    console.error('Authentication environment variables not configured');
    return false;
  }

  // Verify username matches
  if (username !== envUsername) {
    return false;
  }

  // Verify password matches hash
  try {
    const isValid = await bcrypt.compare(password, envPasswordHash);
    return isValid;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Bcrypt hash
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}
