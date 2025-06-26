# LoduChat 🚀

A fun, retro-styled chat application built with Next.js and Firebase. Features Google Sign-In, real-time messaging, and a unique "gaali" (fun insults) system!

<!-- DEPLOYMENT TRIGGER -->

## 🌟 Features

- 🔐 Google Authentication
- 💬 Real-time messaging with Firebase Firestore
- 🎭 Predefined "gaali" messages and reactions
- 👥 User tagging system
- 📱 Responsive design with retro aesthetics
- 🔔 Notifications for mentions
- 📊 User profile with statistics

## 🚀 Live Demo

Visit: [https://orbitmaxlabs.github.io/adrit.gay](https://orbitmaxlabs.github.io/adrit.gay)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore)
- **Deployment**: GitHub Pages

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/orbitmaxlabs/adrit.gay.git
   cd adrit.gay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Google Authentication
   - Create a Firestore database
   - Copy your Firebase config

4. **Create environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### GitHub Pages (Automatic)

The app is automatically deployed to GitHub Pages when you push to the main branch. The GitHub Actions workflow will:

1. Build the static site
2. Deploy to the `gh-pages` branch
3. Make it available at `https://arjunbishnoi1.github.io/LoduChat`

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   npm run deploy:gh
   ```

## 🔧 Configuration

### Firebase Setup

1. **Authentication**: Enable Google Sign-In in Firebase Console
2. **Firestore**: Create a database in test mode for development
3. **Security Rules**: Update Firestore rules for production

### Environment Variables

All Firebase configuration is handled through environment variables. Make sure to add these to your GitHub repository secrets for deployment.

## 🎨 Customization

- **Colors**: Modify the color scheme in `tailwind.config.js`
- **Messages**: Add more predefined messages in `src/app/page.tsx`
- **Styling**: Update the retro theme in the CSS files

## 📱 Usage

1. **Sign In**: Use Google authentication to access the chat
2. **Send Messages**: Use predefined "gaali" messages or type custom ones
3. **Tag Users**: Click on online users to tag them in messages
4. **View Profile**: Check your statistics and achievements
5. **Notifications**: See when others tag you

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for the backend infrastructure
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first styling
- All contributors and users of LoduChat!

---

Made with ❤️ by Arjun Bishnoi 