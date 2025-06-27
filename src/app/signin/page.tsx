"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider, db } from "../../firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("SignInPage: User already signed in, redirecting");
        router.replace("/");
      }
    });
    return () => unsub();
  }, [router]);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("SignInPage: Attempting Google sign-in...");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("SignInPage: Sign-in successful", user.email);
      
      await setDoc(doc(db, "users", user.uid), {
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastActive: serverTimestamp(),
      }, { merge: true });
      
      console.log("SignInPage: User data saved to Firestore");
      router.replace("/");
    } catch (error: any) {
      console.error("SignInPage: Sign-in error", error);
      setError(error.message);
      
      // Common error messages
      if (error.code === 'auth/popup-closed-by-user') {
        setError("Sign-in was cancelled. Please try again.");
      } else if (error.code === 'auth/unauthorized-domain') {
        setError("This domain is not authorized for sign-in. Please contact support.");
      } else if (error.code === 'auth/network-request-failed') {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(`Sign-in failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#ff00c8] via-[#00ffea] to-[#fff200] font-mono mobile-safe-top mobile-safe-bottom mobile-safe-left mobile-safe-right">
      <div className="bg-black/80 rounded-2xl shadow-2xl p-6 sm:p-8 border-4 sm:border-8 border-[#fff200] flex flex-col items-center mx-4 max-w-sm sm:max-w-md w-full">
        <h1 className="text-2xl sm:text-4xl text-[#fff200] font-extrabold mb-4 tracking-widest drop-shadow-lg text-center">LODU CHAT</h1>
        <p className="text-center text-[#00ffea] mb-6 sm:mb-8 text-base sm:text-lg font-bold">Sign in to join the chat!</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-400 rounded text-red-300 text-sm w-full">
            {error}
          </div>
        )}
        
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="w-full touch-target bg-[#00ffea] text-black font-bold border-4 border-[#ff00c8] rounded-lg shadow-lg px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-2xl mb-4 hover:bg-[#ff00c8] hover:text-white transition-all duration-200 cursor-pointer font-mono tracking-widest outline-dashed outline-2 outline-offset-2 outline-[#00ffea] disabled:opacity-50 disabled:cursor-not-allowed mobile-tap"
        >
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </button>
        
        <div className="text-xs text-[#00ffea]/70 text-center">
          <p>Make sure you&apos;re using a supported browser</p>
          <p>and have JavaScript enabled</p>
        </div>
      </div>
    </div>
  );
} 