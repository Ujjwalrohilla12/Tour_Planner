#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Installing Contact Us page dependencies...\n');

try {
  console.log('📦 Installing Resend for email sending...');
  execSync('npm install resend', { stdio: 'inherit' });
  
  console.log('\n✅ Dependencies installed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Get your Resend API key from https://resend.com');
  console.log('2. Add RESEND_API_KEY to your .env.local file');
  console.log('3. Add ADMIN_EMAIL to your .env.local file');
  console.log('4. Run: npx convex dev (to push schema changes)');
  console.log('5. Test the contact form at /contact-us');
  console.log('\n📖 See CONTACT_SETUP.md for detailed instructions');
  
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  console.log('\n🔧 Manual installation:');
  console.log('npm install resend');
}