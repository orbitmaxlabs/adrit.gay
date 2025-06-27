"use client";
import "./globals.css";
import { usePathname } from "next/navigation";
import { AuthProvider } from "./auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        {/* Primary Meta Tags */}
        <title>Lodu Chat - Teri Maa Ki Chut Dalle</title>
        <meta name="title" content="Lodu Chat - Teri Maa Ki Chut Dalle" />
        <meta name="description" content="BKL, yeh hai tera ultimate chat app! Jahan gaali galoch hai, aur conversations mein koi limit nahi. Aaja, apne dost ke saath savage ban!" />
        <meta name="keywords" content="lodu chat, savage chat, hindi chat, gaali galoch, real talk, messaging app, chat app, bkl chat" />
        <meta name="author" content="Lodu Chat Team" />
        <meta name="creator" content="Lodu Chat" />
        <meta name="publisher" content="Lodu Chat" />
        
        {/* Enhanced Mobile Viewport and Responsive Design */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover, shrink-to-fit=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Lodu Chat" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lodu-chat.vercel.app/" />
        <meta property="og:title" content="Lodu Chat - Teri Maa Ki Chut Dalle" />
        <meta property="og:description" content="BKL, yeh hai tera ultimate chat app! Jahan gaali galoch hai, aur conversations mein koi limit nahi. Aaja, apne dost ke saath savage ban!" />
        <meta property="og:image" content="https://lodu-chat.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Lodu Chat - Teri Maa Ki Chut Dalle" />
        <meta property="og:site_name" content="Lodu Chat" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:locale:alternate" content="hi_IN" />
        
        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://lodu-chat.vercel.app/" />
        <meta property="twitter:title" content="Lodu Chat - Teri Maa Ki Chut Dalle" />
        <meta property="twitter:description" content="BKL, yeh hai tera ultimate chat app! Jahan gaali galoch hai, aur conversations mein koi limit nahi. Aaja, apne dost ke saath savage ban!" />
        <meta property="twitter:image" content="https://lodu-chat.vercel.app/og-image.png" />
        <meta property="twitter:image:alt" content="Lodu Chat - Teri Maa Ki Chut Dalle" />
        <meta property="twitter:creator" content="@lodu_chat" />
        <meta property="twitter:site" content="@lodu_chat" />
        
        {/* SEO and Indexing */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <meta name="slurp" content="index, follow" />
        <link rel="canonical" href="https://lodu-chat.vercel.app/" />
        
        {/* Theme and Colors */}
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/web-app-manifest-192x192.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Apple Specific */}
        <meta name="apple-itunes-app" content="app-argument=lodu-chat" />
        
        {/* Favicon and Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Security Headers */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta httpEquiv="Content-Language" content="en" />
        
        {/* Additional Meta for Better SEO */}
        <meta name="application-name" content="Lodu Chat" />
        <meta name="category" content="Social Communication" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        <meta name="revisit-after" content="7 days" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Lodu Chat - Teri Maa Ki Chut Dalle",
              "description": "BKL, yeh hai tera ultimate chat app! Jahan gaali galoch hai, aur conversations mein koi limit nahi.",
              "url": "https://lodu-chat.vercel.app/",
              "applicationCategory": "SocialNetworkingApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "Lodu Chat Team"
              }
            })
          }}
        />
      </head>
      <body className="font-mono antialiased" style={{ fontFamily: '"Press Start 2P", "VT323", "Courier New", Courier, monospace' }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
