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
