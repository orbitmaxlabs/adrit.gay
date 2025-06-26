#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase Setup for Lodu Chat');
console.log('================================\n');

const envContent = `# Firebase Configuration
# Follow these steps to get your Firebase config:
# 1. Go to https://console.firebase.google.com/
# 2. Create a new project or select existing one
# 3. Go to Project Settings > General
# 4. Scroll down to "Your apps" section
# 5. Click "Add app" > Web app
# 6. Copy the config values and paste them below

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# After setting up Firebase:
# 1. Enable Authentication > Sign-in method > Google
# 2. Enable Firestore Database > Create database
# 3. Set Firestore rules to allow authenticated users
`;

const envPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Backing up...');
  fs.copyFileSync(envPath, envPath + '.backup');
}

fs.writeFileSync(envPath, envContent);
console.log('✅ Created .env.local template');
console.log('📝 Please edit .env.local with your Firebase credentials');
console.log('🔗 Visit: https://console.firebase.google.com/');
console.log('\nNext steps:');
console.log('1. Create a Firebase project');
console.log('2. Enable Google Authentication');
console.log('3. Create Firestore Database');
console.log('4. Update .env.local with your config');
console.log('5. Run: npm run dev'); 