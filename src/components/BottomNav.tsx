"use client";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../app/auth-context";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuth();

  // Only show navbar if user is logged in
  if (!user) return null;

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/notifications", label: "Activity", icon: "🔔" },
    { path: "/profile", label: "Profile", icon: user && user.photoURL ? (
      <img src={user.photoURL} alt="Profile" className="w-7 h-7 rounded-full border-2 border-[#fff200] object-cover" />
    ) : "👤" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Glow effect behind nav */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#ff00c8]/20 via-[#00ffea]/10 to-transparent blur-xl pointer-events-none"></div>
      {/* Main nav bar */}
      <div className="relative bg-black/90 backdrop-blur-md border-t-4 border-[#fff200] shadow-2xl">
        <div className="flex justify-evenly items-center p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 relative ${
                  isActive
                    ? "bg-gradient-to-b from-[#00ffea] to-[#00ccb8] text-black shadow-lg shadow-[#00ffea]/50 border-2 border-[#fff200]"
                    : "text-[#00ffea] hover:text-[#fff200] hover:bg-[#ff00c8]/20 border-2 border-transparent"
                }`}
                aria-label={item.label}
              >
                <span className="text-2xl filter drop-shadow-lg flex items-center justify-center">{item.icon}</span>
                <span className={`text-xs font-bold tracking-wider ${isActive ? "text-black" : ""}`}>{item.label}</span>
                {isActive && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#fff200] rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>
        {/* Bottom border glow */}
        <div className="h-1 bg-gradient-to-r from-[#ff00c8] via-[#00ffea] to-[#fff200] animate-pulse"></div>
      </div>
    </nav>
  );
} 