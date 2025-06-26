"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "../firebase";
import LoadingSpinner from "../components/LoadingSpinner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log("AuthProvider: Initializing Firebase auth...");
    
    const unsub = onAuthStateChanged(auth, (u) => {
      console.log("AuthProvider: Auth state changed", u ? "User logged in" : "No user");
      setUser(u);
      setLoading(false);
      setError(null);
      
      if (!u && pathname !== "/signin" && pathname !== "/login") {
        console.log("AuthProvider: Redirecting to signin");
        router.replace("/signin");
      }
      if (u && (pathname === "/signin" || pathname === "/login")) {
        console.log("AuthProvider: Redirecting to home");
        router.replace("/");
      }
    }, (error) => {
      console.error("AuthProvider: Firebase auth error", error);
      setError(error.message);
      setLoading(false);
    });

    // Timeout fallback to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn("AuthProvider: Timeout reached, setting loading to false");
        setLoading(false);
      }
    }, 10000); // 10 seconds timeout

    return () => {
      unsub();
      clearTimeout(timeout);
    };
  }, [pathname, router, loading]);

  if (loading) return <LoadingSpinner message="Authenticating..." />;
  if (error) {
    console.error("AuthProvider: Error state", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-red-400">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Authentication Error</h1>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context.user;
} 