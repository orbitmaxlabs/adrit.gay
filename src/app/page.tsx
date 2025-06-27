"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./auth-context";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import LoadingSpinner from "../components/LoadingSpinner";
import Image from "next/image";
import { Fragment } from "react";

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
  const [showGaali, setShowGaali] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [input, setInput] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

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
    }, (error) => {
      console.error("Error listening to messages:", error);
    });

    // Listen to online users
    const usersRef = collection(db, "users");
    const usersUnsubscribe = onSnapshot(usersRef, (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOnlineUsers(users);
    }, (error) => {
      console.error("Error listening to users:", error);
    });

    return () => {
      unsubscribe();
      usersUnsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

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
    <div className="min-h-screen bg-black text-green-400 p-0 m-0 w-full">
      {/* Fixed Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black p-4 border-b border-green-400 flex justify-between items-center">
        <div className="font-bold text-2xl text-yellow-400 tracking-widest">Lodu Chat</div>
        <div className="text-green-300 font-mono text-lg">Online: {onlineUsers.length}</div>
      </div>

      {/* Persistent Green Border Chat Container */}
      <div className="fixed left-0 right-0 z-30 px-4" style={{ top: '72px', bottom: '198px' }}>
        <div className="h-full border border-green-400 rounded-t-lg p-4 bg-gray-900 flex flex-col">
          {/* Only this inner div scrolls */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="mb-4">
                <div className="flex items-start space-x-3">
                  {message.userPhoto && (
                    <Image 
                      src={message.userPhoto} 
                      alt="User" 
                      width={32}
                      height={32}
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
        </div>
      </div>

      {/* Fixed Message Input Bar above BottomNav */}
      <div className="fixed left-0 right-0 z-50 bg-[#1a2e05] border-t-4 border-[#fff200] p-4 flex items-end gap-2 shadow-2xl rounded-t-xl mb-16" style={{ bottom: '64px', height: '64px' }}>
        {/* Gaali Button */}
        <div className="relative">
          <button
            onClick={() => setShowGaali((v) => !v)}
            className="bg-pink-700 hover:bg-pink-600 text-white px-3 py-2 rounded-full font-bold shadow-lg border-2 border-pink-400"
            title="Send Gaali"
          >
            🤬
          </button>
          {showGaali && (
            <div className="absolute bottom-12 left-0 bg-gray-900 border border-pink-400 rounded-lg p-3 w-64 z-50 shadow-xl">
              <div className="grid grid-cols-1 gap-2">
                {predefinedMessages.map((message, idx) => (
                  <button
                    key={idx}
                    onClick={() => { sendMessage(message); setShowGaali(false); }}
                    className="w-full px-3 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 text-left font-mono text-sm"
                  >
                    {message}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Reactions Button */}
        <div className="relative">
          <button
            onClick={() => setShowReactions((v) => !v)}
            className="bg-cyan-700 hover:bg-cyan-600 text-white px-3 py-2 rounded-full font-bold shadow-lg border-2 border-cyan-400"
            title="Send Reaction"
          >
            😎
          </button>
          {showReactions && (
            <div className="absolute bottom-12 left-0 bg-gray-900 border border-cyan-400 rounded-lg p-3 w-64 z-50 shadow-xl">
              <div className="grid grid-cols-5 gap-2">
                {reactions.map((reaction, idx) => (
                  <button
                    key={idx}
                    onClick={() => { sendReaction(reaction); setShowReactions(false); }}
                    className="px-2 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-2xl"
                  >
                    {reaction}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Message Input */}
        <form
          onSubmit={e => {
            e.preventDefault();
            if (input.trim()) sendMessage(input.trim());
            setInput("");
          }}
          className="flex-1 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your jungle gaali... Use @ to tag!"
            className="flex-1 px-4 py-3 rounded-full bg-[#223a0a] border-2 border-[#fff200] text-yellow-200 placeholder:text-green-400 font-mono focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-lg"
            maxLength={300}
          />
          <button
            type="submit"
            className="ml-2 px-5 py-3 rounded-full bg-[#fff200] text-black font-bold shadow-lg hover:bg-yellow-300 border-2 border-yellow-400"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
