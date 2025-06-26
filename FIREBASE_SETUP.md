# 🔥 Firebase Setup Guide for Lodu Chat

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select existing project
3. Enter project name: `loduchat` (or your preferred name)
4. Follow the setup wizard

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Google** provider
3. Enable it and add your authorized domain (localhost for development)
4. Save

## Step 3: Enable Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location close to you
5. Click **Done**

## Step 4: Get Your Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click **Add app** > **Web app**
4. Register app with name: `Lodu Chat Web`
5. Copy the config object

## Step 5: Create Environment File

Create a file called `.env.local` in your project root with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 6: Test the App

1. Restart your development server: `npm run dev`
2. Open http://localhost:3002
3. Try signing in with Google
4. Send some messages!

## 🔒 Security Rules (Optional)

For production, update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🚀 Deployment

Once working locally, you can deploy to:
- Vercel (recommended)
- Netlify
- GitHub Pages

---

**Need help?** Check the browser console for any error messages! 