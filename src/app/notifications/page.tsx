"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../auth-context";
import { db } from "../../firebase";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import LoadingSpinner from "../../components/LoadingSpinner";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const user = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listen to messages where current user is tagged
    const q = query(
      collection(db, "messages"),
      where("text", ">=", `@${user.displayName || user.email}`),
      where("text", "<=", `@${user.displayName || user.email}\uf8ff`)
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
    <div className="min-h-screen bg-black text-green-400 p-3 sm:p-4 mobile-safe-top mobile-safe-bottom mobile-safe-left mobile-safe-right">
      {/* Header - Mobile Optimized with Back Button */}
      <div className="flex justify-between items-center mb-4 sm:mb-6 border-b border-green-400 pb-3 sm:pb-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => router.push('/')}
            className="touch-target bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-full font-bold shadow-lg border border-green-400 mobile-tap text-sm sm:text-base"
            title="Back to Chat"
          >
            ←
          </button>
          <div className="text-2xl sm:text-3xl">🔔</div>
          <div>
            <div className="font-bold text-xl sm:text-2xl text-pink-400">Notifications</div>
            <div className="text-xs sm:text-sm text-green-300">You&apos;ve been tagged!</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-base sm:text-lg font-bold">{notifications.length}</div>
          <div className="text-xs text-green-300">mentions</div>
        </div>
      </div>

      {/* Notifications List - Mobile Optimized */}
      <div className="space-y-3 sm:space-y-4">
        {loading ? (
          <LoadingSpinner message="Loading notifications..." />
        ) : notifications.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">😴</div>
            <div className="text-lg sm:text-xl font-bold text-yellow-400 mb-2">No notifications yet!</div>
            <div className="text-xs sm:text-sm text-green-300 px-4">You&apos;ll see notifications here when someone tags you.</div>
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="bg-gray-900 border border-green-400 rounded-lg p-3 sm:p-4 hover:bg-gray-800 transition-colors">
              <div className="flex items-start space-x-2 sm:space-x-3">
                {notification.userPhoto && (
                  <Image 
                    src={notification.userPhoto} 
                    alt="User" 
                    width={40}
                    height={40}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-green-400 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2 flex-wrap">
                    <span className="font-bold text-yellow-400 text-sm sm:text-base truncate">{notification.userName}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {notification.timestamp?.toDate?.()?.toLocaleString() || "now"}
                    </span>
                    <span className="text-pink-400 text-xs sm:text-sm">tagged you</span>
                  </div>
                  <div className={`text-sm sm:text-lg break-words ${notification.type === "reaction" ? "text-xl sm:text-2xl" : ""}`}>
                    {notification.text}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 