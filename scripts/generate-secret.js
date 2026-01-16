const crypto = require('crypto');

console.log('\n🔑 Session Secret Generator for Athan Notes\n');
console.log('This script generates a cryptographically secure random string');
console.log('for your SESSION_SECRET environment variable.\n');

// Generate a 32-byte random string (256 bits of entropy)
const secret = crypto.randomBytes(32).toString('hex');

console.log('Copy this to your .env.local file:\n');
console.log(`SESSION_SECRET=${secret}\n`);
console.log('✓ Secret generated successfully!\n');
