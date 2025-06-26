"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider, db } from "../../firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/");
    });
    return () => unsub();
  }, [router]);

  const handleSignIn = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    await setDoc(doc(db, "users", user.uid), {
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastActive: serverTimestamp(),
    }, { merge: true });
    router.replace("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#ff00c8] via-[#00ffea] to-[#fff200] font-mono">
      <div className="bg-black/80 rounded-2xl shadow-2xl p-8 border-8 border-[#fff200] flex flex-col items-center">
        <h1 className="text-4xl text-[#fff200] font-extrabold mb-4 tracking-widest drop-shadow-lg">LODU CHAT</h1>
        <p className="text-center text-[#00ffea] mb-8 text-lg font-bold">Sign in to join the chat!</p>
        <button
          onClick={handleSignIn}
          className="bg-[#00ffea] text-black font-bold border-4 border-[#ff00c8] rounded-lg shadow-lg px-8 py-4 text-2xl mb-4 hover:bg-[#ff00c8] hover:text-white transition-all duration-200 cursor-pointer font-mono tracking-widest outline-dashed outline-2 outline-offset-2 outline-[#00ffea]"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
} 