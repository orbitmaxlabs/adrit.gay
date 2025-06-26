#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Lodu Chat Deployment Script');
console.log('==============================\n');

// Check if .env.local exists and has real values
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local not found!');
  console.log('📝 Please create .env.local with your Firebase credentials first.');
  console.log('🔗 See FIREBASE_SETUP.md for instructions.');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
if (envContent.includes('your_api_key_here') || envContent.includes('your_project_id')) {
  console.log('❌ Firebase credentials not configured!');
  console.log('📝 Please update .env.local with your real Firebase credentials.');
  console.log('🔗 See FIREBASE_SETUP.md for instructions.');
  process.exit(1);
}

console.log('✅ Firebase credentials found');
console.log('🔨 Building project...\n');

try {
  // Build the project
  execSync('npm run build', { stdio: 'inherit' });
  console.log('\n✅ Build successful!');
  
  console.log('\n🚀 Ready to deploy!');
  console.log('Choose your deployment option:');
  console.log('\n1. Vercel (Recommended):');
  console.log('   npm install -g vercel');
  console.log('   vercel');
  console.log('\n2. Manual deployment:');
  console.log('   npm start');
  console.log('\n3. Static export:');
  console.log('   npm run export');
  
} catch (error) {
  console.log('\n❌ Build failed!');
  console.log('Please fix the errors above and try again.');
  process.exit(1);
} 