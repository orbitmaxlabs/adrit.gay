"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../auth-context";
import { db } from "../../firebase";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ProfilePage() {
  const user = useAuth();
  const [userStats, setUserStats] = useState({
    totalMessages: 0,
    totalReactions: 0,
    timesTagged: 0,
    joinDate: null as any
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Get user's messages
    const messagesQuery = query(
      collection(db, "messages"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    // Get messages where user is tagged
    const taggedQuery = query(
      collection(db, "messages"),
      where("text", ">=", `@${user.displayName || user.email}`),
      where("text", "<=", `@${user.displayName || user.email}\uf8ff`)
    );

    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => doc.data());
      const reactions = messages.filter(msg => msg.type === "reaction");
      
      setUserStats(prev => ({
        ...prev,
        totalMessages: messages.length,
        totalReactions: reactions.length,
        joinDate: messages[messages.length - 1]?.timestamp || null
      }));
    });

    const unsubscribeTagged = onSnapshot(taggedQuery, (snapshot) => {
      setUserStats(prev => ({
        ...prev,
        timesTagged: snapshot.docs.length
      }));
      setLoading(false);
    });

    return () => {
      unsubscribeMessages();
      unsubscribeTagged();
    };
  }, [user]);

  const handleLogout = () => {
    signOut(auth);
  };

  if (!user) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-green-400 pb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">👤</div>
          <div>
            <div className="font-bold text-2xl text-yellow-400">Profile</div>
            <div className="text-sm text-green-300">Your Lodu Chat stats</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-mono text-sm"
        >
          Logout
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-gray-900 border border-green-400 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          {user.photoURL && (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="w-20 h-20 rounded-full border-4 border-green-400"
            />
          )}
          <div>
            <div className="text-2xl font-bold text-yellow-400">{user.displayName || user.email}</div>
            <div className="text-sm text-green-300">{user.email}</div>
            <div className="text-xs text-gray-400">User ID: {user.uid.slice(0, 8)}...</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-pink-900 border border-pink-400 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-pink-400">{userStats.totalMessages}</div>
          <div className="text-sm text-pink-300">Messages Sent</div>
        </div>
        <div className="bg-cyan-900 border border-cyan-400 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-cyan-400">{userStats.totalReactions}</div>
          <div className="text-sm text-cyan-300">Reactions Sent</div>
        </div>
        <div className="bg-yellow-900 border border-yellow-400 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-yellow-400">{userStats.timesTagged}</div>
          <div className="text-sm text-yellow-300">Times Tagged</div>
        </div>
        <div className="bg-green-900 border border-green-400 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-400">
            {userStats.joinDate ? 
              userStats.joinDate.toDate().toLocaleDateString() : 
              "Now"
            }
          </div>
          <div className="text-sm text-green-300">Joined</div>
        </div>
      </div>

      {/* Fun Stats */}
      <div className="bg-gray-900 border border-green-400 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-pink-400 mb-4">🎯 Your Lodu Level</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>Message Mastery:</span>
            <span className="text-yellow-400">
              {userStats.totalMessages > 50 ? "🔥 Legend" : 
               userStats.totalMessages > 20 ? "💪 Pro" : 
               userStats.totalMessages > 10 ? "😎 Cool" : "😊 Newbie"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Reaction Game:</span>
            <span className="text-cyan-400">
              {userStats.totalReactions > 30 ? "🎭 Drama Queen" : 
               userStats.totalReactions > 15 ? "😄 Emoji King" : 
               userStats.totalReactions > 5 ? "👍 Reactor" : "🤔 Observer"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Popularity:</span>
            <span className="text-pink-400">
              {userStats.timesTagged > 20 ? "⭐ Superstar" : 
               userStats.timesTagged > 10 ? "🌟 Popular" : 
               userStats.timesTagged > 5 ? "👋 Known" : "😴 Hidden"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <a 
          href="/"
          className="block w-full text-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-mono text-sm"
        >
          🏠 Back to Chat
        </a>
        <a 
          href="/notifications"
          className="block w-full text-center px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-mono text-sm"
        >
          🔔 View Notifications
        </a>
      </div>
    </div>
  );
} 