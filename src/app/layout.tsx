"use client";
import "./globals.css";
import { usePathname } from "next/navigation";
import { AuthProvider } from "./auth-context";
import BottomNav from "../components/BottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showBottomNav = !["/signin", "/login"].includes(pathname);

  return (
    <html lang="en">
      <head>
        <title>Lodu Chat - Teri Gaand Faad Dunga BKL</title>
        <meta name="description" content="The most savage chat app you'll ever use. Where conversations get real and nothing is off limits." />
        <meta name="keywords" content="chat, messaging, savage, real talk, lodu chat" />
        <meta name="author" content="Lodu Chat Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lodu-chat.vercel.app/" />
        <meta property="og:title" content="Lodu Chat - Teri Gaand Faad Dunga BKL" />
        <meta property="og:description" content="The most savage chat app you'll ever use. Where conversations get real and nothing is off limits." />
        <meta property="og:image" content="https://lodu-chat.vercel.app/og-image.png" />
        <meta property="og:site_name" content="Lodu Chat" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://lodu-chat.vercel.app/" />
        <meta property="twitter:title" content="Lodu Chat - Teri Gaand Faad Dunga BKL" />
        <meta property="twitter:description" content="The most savage chat app you'll ever use. Where conversations get real and nothing is off limits." />
        <meta property="twitter:image" content="https://lodu-chat.vercel.app/og-image.png" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Lodu Chat" />
        
        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-mono antialiased" style={{ fontFamily: '"Press Start 2P", "VT323", "Courier New", Courier, monospace' }}>
        <AuthProvider>
          <div className={showBottomNav ? "pb-24" : ""}>
            {children}
          </div>
          {showBottomNav && <BottomNav />}
        </AuthProvider>
      </body>
    </html>
  );
}
