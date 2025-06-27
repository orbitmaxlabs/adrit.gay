"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../auth-context";
import { db } from "../../firebase";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { signOut, updateProfile } from "firebase/auth";
import { auth } from "../../firebase";
import LoadingSpinner from "../../components/LoadingSpinner";
import Image from "next/image";
import { doc, updateDoc } from "firebase/firestore";

export default function ProfilePage() {
  const user = useAuth();
  const [userStats, setUserStats] = useState({
    totalMessages: 0,
    totalReactions: 0,
    timesTagged: 0,
    joinDate: null as any
  });
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState(user?.displayName || "");
  const [editTagline, setEditTagline] = useState("");
  const [editPhoto, setEditPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Get user's messages
    const messagesQuery = query(
      collection(db, "messages"),
      where("userId", "==", user.uid)
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

  // Fetch tagline from Firestore if available
  useEffect(() => {
    if (!user) return;
    const fetchTagline = async () => {
      const userDoc = await import("firebase/firestore").then(({ doc, getDoc }) => getDoc(doc(db, "users", user.uid)));
      if (userDoc.exists()) {
        setEditTagline(userDoc.data().tagline || "");
      }
    };
    fetchTagline();
  }, [user]);

  if (!user) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  const handleLogoutClick = () => setShowConfirm(true);
  const handleCancel = () => setShowConfirm(false);
  const handleConfirm = () => {
    setShowConfirm(false);
    signOut(auth);
  };

  const handleEdit = () => setShowEdit(true);
  const handleEditCancel = () => setShowEdit(false);
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditPhoto(e.target.files[0]);
    }
  };
  const handleEditSave = async () => {
    if (!user) return;
    setSaving(true);
    setError("");
    try {
      // Update displayName and photoURL
      if (editName !== user.displayName || editPhoto) {
        let photoURL = user.photoURL;
        if (editPhoto) {
          // Upload to Firebase Storage (optional: implement this if you want real uploads)
          // For now, just use a local URL for preview
          photoURL = URL.createObjectURL(editPhoto);
        }
        await updateProfile(user, { displayName: editName, photoURL });
      }
      // Update tagline in Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { tagline: editTagline, displayName: editName });
      setShowEdit(false);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 p-4">
      {/* User Info Card */}
      <div className="bg-gray-900 border border-green-400 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-4 mb-4 relative">
          {user.photoURL && (
            <Image 
              src={user.photoURL} 
              alt="Profile" 
              width={80}
              height={80}
              className="w-20 h-20 rounded-full border-4 border-green-400"
            />
          )}
          <div>
            <div className="text-2xl font-bold text-yellow-400">{user.displayName || user.email}</div>
            <div className="text-sm text-green-300">{user.email}</div>
            <div className="text-xs text-gray-400">User ID: {user.uid.slice(0, 8)}...</div>
            {editTagline && <div className="text-sm text-pink-400 mt-1">{editTagline}</div>}
          </div>
          <button
            onClick={handleEdit}
            className="absolute top-0 right-0 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow hover:bg-yellow-300"
          >
            Edit your lodu profile
          </button>
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
      <div className="space-y-3 mb-8">
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

      {/* Logout Button at Bottom */}
      {user && (
        <div className="flex justify-center">
          <button
            onClick={handleLogoutClick}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-mono text-base w-full max-w-xs"
          >
            Logout
          </button>
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-900 border border-red-600 rounded-lg p-8 text-center">
            <div className="mb-4 text-lg text-white">Are you sure you want to logout?</div>
            <div className="flex justify-center gap-4">
              <button onClick={handleConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Yes, Logout</button>
              <button onClick={handleCancel} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="bg-gray-900 border border-yellow-400 rounded-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Edit Your Lodu Profile</h2>
            {error && <div className="text-red-400 mb-2">{error}</div>}
            <div className="mb-4 flex flex-col items-center">
              <label className="mb-2 text-green-300">Profile Picture</label>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="mb-2" />
              {editPhoto && (
                <Image src={URL.createObjectURL(editPhoto)} alt="Preview" width={80} height={80} className="w-20 h-20 rounded-full border-2 border-yellow-400" />
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-green-300">Username</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-green-400 text-yellow-400"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-green-300">Tagline</label>
              <input
                type="text"
                value={editTagline}
                onChange={e => setEditTagline(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 border border-pink-400 text-pink-400"
                maxLength={60}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleEditCancel}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-300 font-bold"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 