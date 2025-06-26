"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../auth-context";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function NotificationsPage() {
  const user = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listen to messages where current user is tagged
    const q = query(
      collection(db, "messages"),
      where("text", ">=", `@${user.displayName || user.email}`),
      where("text", "<=", `@${user.displayName || user.email}\uf8ff`),
      orderBy("text"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(notifs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return <LoadingSpinner message="Loading notifications..." />;
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-green-400 pb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">🔔</div>
          <div>
            <div className="font-bold text-2xl text-pink-400">Notifications</div>
            <div className="text-sm text-green-300">You've been tagged!</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">{notifications.length}</div>
          <div className="text-xs text-green-300">mentions</div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <LoadingSpinner message="Loading notifications..." />
        ) : notifications.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">😴</div>
            <div className="text-xl font-bold text-yellow-400 mb-2">No notifications yet!</div>
            <div className="text-sm text-green-300">You'll see notifications here when someone tags you.</div>
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="bg-gray-900 border border-green-400 rounded-lg p-4 hover:bg-gray-800 transition-colors">
              <div className="flex items-start space-x-3">
                {notification.userPhoto && (
                  <img 
                    src={notification.userPhoto} 
                    alt="User" 
                    className="w-10 h-10 rounded-full border border-green-400"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-bold text-yellow-400">{notification.userName}</span>
                    <span className="text-xs text-gray-400">
                      {notification.timestamp?.toDate?.()?.toLocaleString() || "now"}
                    </span>
                    <span className="text-pink-400 text-sm">tagged you</span>
                  </div>
                  <div className={`text-lg ${notification.type === "reaction" ? "text-2xl" : ""}`}>
                    {notification.text}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Back to Chat Button */}
      <div className="mt-8 text-center">
        <a 
          href="/"
          className="inline-block px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-mono text-sm"
        >
          ← Back to Chat
        </a>
      </div>
    </div>
  );
} 