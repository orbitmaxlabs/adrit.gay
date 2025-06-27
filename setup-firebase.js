#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔥 Firebase & Cloudinary Setup for Lodu Chat');
console.log('============================================\n');

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
# Removed storage bucket - using Cloudinary instead
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration (for file uploads)
# Follow these steps to get your Cloudinary config:
# 1. Go to https://cloudinary.com/ and create a free account
# 2. Go to Dashboard to get your credentials
# 3. Create an upload preset:
#    - Go to Settings > Upload
#    - Scroll to Upload presets
#    - Click "Add upload preset"
#    - Set name to "lodu-chat"
#    - Set signing mode to "Unsigned"
#    - Save

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=lodu-chat

# After setting up Firebase:
# 1. Enable Authentication > Sign-in method > Google
# 2. Enable Firestore Database > Create database
# 3. Set Firestore rules to allow authenticated users
# 4. Set up Cloudinary account for file uploads
`;

const envPath = path.join(__dirname, '.env.local');

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Backing up...');
  fs.copyFileSync(envPath, envPath + '.backup');
}

fs.writeFileSync(envPath, envContent);
console.log('✅ Created .env.local template');
console.log('📝 Please edit .env.local with your Firebase and Cloudinary credentials');
console.log('🔗 Visit: https://console.firebase.google.com/');
console.log('☁️  Visit: https://cloudinary.com/');
console.log('\nNext steps:');
console.log('1. Create a Firebase project');
console.log('2. Enable Google Authentication');
console.log('3. Create Firestore Database');
console.log('4. Create a Cloudinary account');
console.log('5. Update .env.local with your config');
console.log('6. Run: npm install');
console.log('7. Run: npm run dev'); 