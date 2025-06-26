"use client";
import { useState, useEffect } from "react";
import { useAuth } from "./auth-context";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import LoadingSpinner from "../components/LoadingSpinner";

const predefinedMessages = [
  "Bhai tu toh lodu hai! 😂",
  "Kya bakwas kar raha hai? 🤦‍♂️",
  "Tere se kuch nahi hoga! 💀",
  "Chup kar be! 😤",
  "Tu toh pagal hai! 🤪",
  "Kya scene hai? 🤔",
  "Bhai tu toh legend hai! 👑",
  "Kya baat hai? 🔥",
  "Tu toh hero hai! 💪",
  "Kya masti hai? 😎"
];

const reactions = ["😂", "🤦‍♂️", "💀", "😤", "🤪", "🤔", "👑", "🔥", "💪", "😎"];

export default function Home() {
  const user = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");

  useEffect(() => {
    if (!user) return;

    // Listen to messages
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    // Listen to online users
    const usersRef = collection(db, "users");
    const usersUnsubscribe = onSnapshot(usersRef, (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOnlineUsers(users);
    });

    return () => {
      unsubscribe();
      usersUnsubscribe();
    };
  }, [user]);

  const sendMessage = async (text: string) => {
    if (!user) return;
    
    const messageText = selectedUser ? `@${selectedUser} ${text}` : text;
    
    await addDoc(collection(db, "messages"), {
      text: messageText,
      userId: user.uid,
      userName: user.displayName || user.email,
      userPhoto: user.photoURL,
      timestamp: serverTimestamp(),
      type: "message"
    });
    
    setSelectedUser("");
  };

  const sendReaction = async (reaction: string) => {
    if (!user) return;
    
    const reactionText = selectedUser ? `@${selectedUser} ${reaction}` : reaction;
    
    await addDoc(collection(db, "messages"), {
      text: reactionText,
      userId: user.uid,
      userName: user.displayName || user.email,
      userPhoto: user.photoURL,
      timestamp: serverTimestamp(),
      type: "reaction"
    });
    
    setSelectedUser("");
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (!user) {
    return <LoadingSpinner message="Loading chat..." />;
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-green-400 pb-4">
        <div className="flex items-center space-x-3">
          {user.photoURL && (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-green-400"
            />
          )}
          <div>
            <div className="font-bold text-lg">{user.displayName || user.email}</div>
            <div className="text-sm text-green-300">Online</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-mono text-sm"
        >
          Logout
        </button>
      </div>

      {/* Online Users */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-yellow-400">Online Users ({onlineUsers.length})</h3>
        <div className="flex flex-wrap gap-2">
          {onlineUsers.map((onlineUser) => (
            <button
              key={onlineUser.id}
              onClick={() => setSelectedUser(onlineUser.userName)}
              className={`px-3 py-1 rounded-full text-sm border transition-all ${
                selectedUser === onlineUser.userName
                  ? "bg-green-400 text-black border-green-400"
                  : "border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
              }`}
            >
              {onlineUser.userName}
            </button>
          ))}
        </div>
        {selectedUser && (
          <div className="mt-2 text-sm text-yellow-400">
            Tagging: @{selectedUser}
            <button
              onClick={() => setSelectedUser("")}
              className="ml-2 text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="mb-6 h-96 overflow-y-auto border border-green-400 rounded-lg p-4 bg-gray-900">
        {messages.map((message) => (
          <div key={message.id} className="mb-4">
            <div className="flex items-start space-x-3">
              {message.userPhoto && (
                <img 
                  src={message.userPhoto} 
                  alt="User" 
                  className="w-8 h-8 rounded-full border border-green-400"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-bold text-yellow-400">{message.userName}</span>
                  <span className="text-xs text-gray-400">
                    {message.timestamp?.toDate?.()?.toLocaleTimeString() || "now"}
                  </span>
                </div>
                <div className={`text-lg ${message.type === "reaction" ? "text-2xl" : ""}`}>
                  {message.text}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Predefined Messages */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-pink-400">Send Gaali</h3>
        <div className="grid grid-cols-2 gap-2">
          {predefinedMessages.map((message, index) => (
            <button
              key={index}
              onClick={() => sendMessage(message)}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-mono text-sm text-center"
            >
              {message}
            </button>
          ))}
        </div>
      </div>

      {/* Reactions */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3 text-cyan-400">Send Reactions</h3>
        <div className="grid grid-cols-5 gap-2">
          {reactions.map((reaction, index) => (
            <button
              key={index}
              onClick={() => sendReaction(reaction)}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-2xl"
            >
              {reaction}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
