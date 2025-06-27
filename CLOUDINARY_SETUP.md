# 🎵 Cloudinary Setup for LoduChat

This guide will help you set up Cloudinary for image and audio uploads in your LoduChat app.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Cloudinary Account
1. Go to [Cloudinary.com](https://cloudinary.com/)
2. Sign up for a free account
3. Verify your email

### 3. Get Your Credentials
1. Go to your Cloudinary Dashboard
2. Copy your **Cloud Name**, **API Key**, and **API Secret**

### 4. Create Upload Preset
1. Go to **Settings** > **Upload**
2. Scroll down to **Upload presets**
3. Click **"Add upload preset"**
4. Set **Preset name** to: `lodu-chat`
5. Set **Signing mode** to: `Unsigned`
6. Click **Save**

### 5. Update Environment Variables
Create or update your `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=lodu-chat
```

### 6. Run the App
```bash
npm run dev
```

## 🎯 Features Added

### 📸 Image Uploads
- **Profile Pictures**: Users can upload profile photos
- **Automatic Optimization**: Images are optimized for web
- **Secure URLs**: All images use HTTPS

### 🎵 Audio Messages
- **Voice Recording**: Click 🎤 to start recording
- **Audio Playback**: Click 🎵 to send recorded audio
- **Browser Support**: Works on all modern browsers

### 🔧 Technical Features
- **Free Tier**: 25GB storage, 25GB bandwidth/month
- **CDN Delivery**: Fast global content delivery
- **Automatic Format**: Supports WebM, MP3, and more
- **Mobile Optimized**: Touch-friendly recording interface

## 🎮 How to Use

### Recording Audio Messages
1. Click the **🎤** button to start recording
2. Speak your message
3. Click **⏹️** to stop recording
4. Click **🎵** to send the audio message

### Uploading Profile Pictures
1. Go to your **Profile** page
2. Click **Edit**
3. Choose an image file
4. Click **Save**

## 🆓 Free Tier Limits

- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month
- **Uploads**: Unlimited

## 🔒 Security

- **API Secret**: Never exposed to the client
- **Upload Preset**: Uses unsigned uploads for security
- **HTTPS**: All URLs use secure connections

## 🐛 Troubleshooting

### Audio Recording Not Working
- Make sure you're using HTTPS (required for microphone access)
- Check browser permissions for microphone access
- Try refreshing the page

### Image Upload Failing
- Check your Cloudinary credentials in `.env.local`
- Verify your upload preset is set to "Unsigned"
- Make sure the image file is under 10MB

### Environment Variables Not Loading
- Restart your development server after updating `.env.local`
- Make sure variable names start with `NEXT_PUBLIC_` for client-side access

## 📞 Support

If you need help:
1. Check the [Cloudinary Documentation](https://cloudinary.com/documentation)
2. Review the [Next.js Documentation](https://nextjs.org/docs)
3. Check the browser console for error messages

## 🎉 You're All Set!

Your LoduChat app now supports:
- ✅ Image uploads for profile pictures
- ✅ Audio recording and messaging
- ✅ Free cloud storage with Cloudinary
- ✅ Mobile-optimized interface
- ✅ Secure file handling

Enjoy your enhanced chat experience! 🚀 