const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔐 Password Hash Generator for Athan Notes\n');
console.log('This script will generate a bcrypt hash for your password.');
console.log('Copy the hash to your .env.local file as APP_PASSWORD_HASH\n');

rl.question('Enter your password: ', (password) => {
  if (!password || password.length < 6) {
    console.error('❌ Password must be at least 6 characters long');
    rl.close();
    process.exit(1);
  }

  // Generate salt and hash (10 rounds is a good balance of security and performance)
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);
  
  // Escape dollar signs for .env files
  const escapedHash = hash.replace(/\$/g, '\\$');

  console.log('\n✅ Password hash generated successfully!\n');
  console.log('Copy this line to your .env.local file:\n');
  console.log(`APP_PASSWORD_HASH=${escapedHash}\n`);
  console.log('⚠️  Note: The backslashes (\\) before $ are required!\n');
  
  // Verify the hash works
  const isValid = bcrypt.compareSync(password, hash);
  if (isValid) {
    console.log('✓ Hash verified - it matches your password\n');
  } else {
    console.error('❌ Hash verification failed - something went wrong\n');
  }

  rl.close();
});
