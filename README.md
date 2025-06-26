# 🎮 Lodu Chat App

A funky, retro 2005-style group chat webapp with Indian humor and real-time messaging!

## ✨ Features

- 🔐 **Google Sign-In Only** - Simple authentication
- 💬 **Real-time Chat** - Instant message updates
- 🎯 **Predefined Messages** - 10 funny Indian gaali messages
- 😄 **Emoji Reactions** - 10 emoji reactions
- 👥 **User Tagging** - Tag users with @username
- 📱 **Retro UI Design** - Neon colors, glowing effects
- 📊 **User Stats** - Message count, reactions, popularity
- 🔔 **Notifications** - See when you're tagged
- 📱 **Responsive Design** - Works on mobile and desktop

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google account for Firebase

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd LoduChat
npm install
```

### 2. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication > Google Sign-in
4. Create Firestore Database
5. Get your config from Project Settings > General > Web app

### 3. Environment Variables
Create `.env.local` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with auth
│   ├── page.tsx                # Main chat page
│   ├── auth-context.tsx        # Authentication context
│   ├── signin/page.tsx         # Sign-in page
│   ├── notifications/page.tsx  # Notifications
│   └── profile/page.tsx        # User profile
├── components/
│   └── BottomNav.tsx           # Navigation
└── firebase.ts                 # Firebase config
```

## 🎨 Design Features

- **Retro Theme**: Black background with neon colors
- **Custom Fonts**: Press Start 2P, VT323, Courier
- **Glowing Effects**: Hover animations and borders
- **Responsive**: Mobile-first design
- **Achievement System**: Fun user levels and titles

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Manual Build
```bash
npm run build
npm start
```

## 🔧 Tech Stack

- **Framework**: Next.js 14.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Deployment**: Vercel

## 📱 Pages

- **Home** (`/`) - Main chat interface
- **Sign In** (`/signin`) - Google authentication
- **Notifications** (`/notifications`) - User mentions
- **Profile** (`/profile`) - User stats and info

## 🎯 User Levels

Based on activity, users get fun titles:
- **Message Mastery**: Newbie → Cool → Pro → Legend
- **Reaction Game**: Observer → Reactor → Emoji King → Drama Queen
- **Popularity**: Hidden → Known → Popular → Superstar

## 🔐 Security

- Route protection for authenticated users
- Firebase security rules
- Environment variable configuration
- User data validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Check the browser console for errors
- Verify Firebase configuration
- Ensure all environment variables are set
- Check network connectivity

---

**Made with ❤️ and lots of 😂** 