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
import { useRouter } from "next/navigation";
import { uploadToCloudinary } from "../cloudinary";

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
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [showGaali, setShowGaali] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioMessage = async () => {
    if (!audioBlob || !user) return;
    
    try {
      const file = new File([audioBlob], 'audio-message.webm', { type: 'audio/webm' });
      
      // Upload audio file to Cloudinary
      const uploadResult = await uploadToCloudinary(file, 'audio-messages');
      
      // Save to Firestore
      await addDoc(collection(db, "messages"), {
        text: "🎵 Audio Message",
        audioURL: uploadResult.url,
        userId: user.uid,
        userName: user.displayName || user.email,
        userPhoto: user.photoURL,
        timestamp: serverTimestamp(),
        type: "audio"
      });
      
      setAudioBlob(null);
    } catch (error) {
      console.error('Error sending audio:', error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (!user) {
    return <LoadingSpinner message="Loading chat..." />;
  }

  return (
    <div className="min-h-screen bg-black text-green-400 p-0 m-0 w-full mobile-safe-left mobile-safe-right">
      {/* Fixed Top Bar - Mobile Optimized with Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black mobile-safe-top mobile-safe-left mobile-safe-right">
        <div className="px-4 py-3 sm:py-4 border-b border-green-400 flex justify-between items-center">
          <div className="font-bold text-lg sm:text-2xl text-yellow-400 tracking-widest">Lodu Chat</div>
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="text-green-300 font-mono text-sm sm:text-lg">Online: {onlineUsers.length}</div>
            <button
              onClick={() => router.push('/notifications')}
              className="touch-target bg-pink-600 hover:bg-pink-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-full font-bold shadow-lg border border-pink-400 mobile-tap text-sm sm:text-base"
              title="Activity"
            >
              🔔
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="touch-target bg-cyan-600 hover:bg-cyan-700 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-full font-bold shadow-lg border border-cyan-400 mobile-tap text-sm sm:text-base"
              title="Profile"
            >
              {user.photoURL ? (
                <Image 
                  src={user.photoURL} 
                  alt="Profile" 
                  width={20} 
                  height={20} 
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white object-cover" 
                />
              ) : (
                "👤"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container - Mobile Optimized */}
      <div className="fixed left-0 right-0 z-30 mobile-safe-left mobile-safe-right" 
           style={{ 
             top: 'calc(env(safe-area-inset-top, 0px) + 60px)', 
             bottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)' 
           }}>
        <div className="h-full mx-2 sm:mx-4 border border-green-400 rounded-t-lg p-2 sm:p-4 bg-gray-900 flex flex-col">
          {/* Scrollable chat area */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className="mb-3 sm:mb-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  {message.userPhoto && (
                    <Image 
                      src={message.userPhoto} 
                      alt="User" 
                      width={32}
                      height={32}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-green-400 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-bold text-yellow-400 text-sm sm:text-base truncate">{message.userName}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {message.timestamp?.toDate?.()?.toLocaleTimeString() || "now"}
                      </span>
                    </div>
                    <div className={`text-sm sm:text-lg break-words ${message.type === "reaction" ? "text-xl sm:text-2xl" : ""}`}>
                      {message.text}
                    </div>
                    {message.type === "audio" && message.audioURL && (
                      <audio controls className="mt-2 w-full max-w-xs">
                        <source src={message.audioURL} type="audio/webm" />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Input Bar - Mobile Optimized */}
      <div className="fixed left-0 right-0 z-50 bg-[#1a2e05] border-t-4 border-[#fff200] mobile-safe-left mobile-safe-right mobile-safe-bottom" 
           style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 0px)' }}>
        <div className="p-3 sm:p-4 flex items-end gap-2 shadow-2xl rounded-t-xl">
          {/* Audio Recording Button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className="touch-target bg-purple-700 hover:bg-purple-600 text-white px-3 py-2 rounded-full font-bold shadow-lg border-2 border-purple-400 mobile-tap"
            title={isRecording ? "Stop Recording" : "Record Audio"}
          >
            {isRecording ? "⏹️" : "🎤"}
          </button>

          {/* Send Audio Button */}
          {audioBlob && (
            <button
              onClick={sendAudioMessage}
              className="touch-target bg-green-700 hover:bg-green-600 text-white px-3 py-2 rounded-full font-bold shadow-lg border-2 border-green-400 mobile-tap"
              title="Send Audio"
            >
              🎵
            </button>
          )}

          {/* Gaali Button - Mobile Optimized */}
          <div className="relative">
            <button
              onClick={() => setShowGaali((v) => !v)}
              className="touch-target bg-pink-700 hover:bg-pink-600 text-white px-3 py-2 rounded-full font-bold shadow-lg border-2 border-pink-400 mobile-tap"
              title="Send Gaali"
            >
              🤬
            </button>
            {showGaali && (
              <div className="absolute bottom-12 left-0 bg-gray-900 border border-pink-400 rounded-lg p-3 w-64 sm:w-80 z-50 shadow-xl max-h-60 overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {predefinedMessages.map((message, idx) => (
                    <button
                      key={idx}
                      onClick={() => { sendMessage(message); setShowGaali(false); }}
                      className="w-full px-3 py-2 touch-target bg-pink-600 text-white rounded hover:bg-pink-700 text-left font-mono text-sm mobile-tap"
                    >
                      {message}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Reactions Button - Mobile Optimized */}
          <div className="relative">
            <button
              onClick={() => setShowReactions((v) => !v)}
              className="touch-target bg-cyan-700 hover:bg-cyan-600 text-white px-3 py-2 rounded-full font-bold shadow-lg border-2 border-cyan-400 mobile-tap"
              title="Send Reaction"
            >
              😎
            </button>
            {showReactions && (
              <div className="absolute bottom-12 left-0 bg-gray-900 border border-cyan-400 rounded-lg p-3 w-64 sm:w-80 z-50 shadow-xl">
                <div className="grid grid-cols-5 gap-2">
                  {reactions.map((reaction, idx) => (
                    <button
                      key={idx}
                      onClick={() => { sendReaction(reaction); setShowReactions(false); }}
                      className="touch-target px-2 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-xl sm:text-2xl mobile-tap"
                    >
                      {reaction}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Message Input - Mobile Optimized */}
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
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-full bg-[#223a0a] border-2 border-[#fff200] text-yellow-200 placeholder:text-green-400 font-mono focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-lg mobile-input"
              maxLength={300}
            />
            <button
              type="submit"
              className="ml-2 px-4 sm:px-5 py-2 sm:py-3 rounded-full bg-[#fff200] text-black font-bold shadow-lg hover:bg-yellow-300 border-2 border-yellow-400 touch-target mobile-tap"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
