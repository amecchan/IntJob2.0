import React, { useState, useEffect, useRef } from "react";
import { db } from "../../services/firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  addDoc, 
  serverTimestamp, 
  doc,
  updateDoc
} from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext";
import { PaperPlaneIcon, ChevronLeftIcon } from '@radix-ui/react-icons'; // Added ChevronLeft
import "../../styles/Applicant/Inbox.css";

const Inbox = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMobileView, setIsMobileView] = useState(true); // Toggle for mobile view
  const scrollRef = useRef();

  // 1. Fetch all chat rooms
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatList);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Fetch messages
  useEffect(() => {
    if (!activeChat) return;

    const msgsQuery = query(
      collection(db, "chats", activeChat.id, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(msgsQuery, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    return () => unsubscribe();
  }, [activeChat]);

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setIsMobileView(false); // Hide list, show chat on mobile
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const messageData = {
      text: newMessage,
      senderId: user.uid,
      timestamp: serverTimestamp(),
    };

    setNewMessage("");
    await addDoc(collection(db, "chats", activeChat.id, "messages"), messageData);
    await updateDoc(doc(db, "chats", activeChat.id), {
      lastMessage: newMessage,
      updatedAt: serverTimestamp()
    });
  };

  return (
    <div className="inbox-page animate-in fade-in duration-500">
      <div className={`inbox-wrapper ${!isMobileView ? "show-chat" : ""}`}>
        
        {/* Left Message List */}
        <aside className="message-list">
          <div className="list-header p-6 border-b border-slate-50">
            <h3 className="font-black text-slate-800 tracking-tight">Messages</h3>
          </div>
          {chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => handleSelectChat(chat)}
              className={`message-item ${activeChat?.id === chat.id ? 'active' : ''}`}
            >
              <div className="msg-info">
                <h4>{chat.employerName || "Hiring Manager"}</h4>
                <p>{chat.lastMessage || "No messages yet..."}</p>
              </div>
            </div>
          ))}
        </aside>

        {/* Right Chat View */}
        <section className="chat-view">
          {activeChat ? (
            <>
              <div className="chat-header">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button 
                    className="mobile-back-btn" 
                    onClick={() => setIsMobileView(true)}
                  >
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  <div className="chat-user-details">
                    <h2>{activeChat.employerName || "Company HR"}</h2>
                    <span className="status-subtext">Active Thread</span>
                  </div>
                </div>
              </div>

              <div className="chat-body">
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-bubble ${msg.senderId === user.uid ? 'sent' : 'received'}`}>
                    <p>{msg.text}</p>
                    <span className="timestamp">
                      {/* Add the '?' check here to prevent crashes during the "sending" state */}
                      {msg.timestamp ? msg.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                    </span>
                  </div>
                ))}
                <div ref={scrollRef} />
              </div>

              <form className="chat-input-container" onSubmit={sendMessage}>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-btn">
                  <PaperPlaneIcon />
                </button>
              </form>
            </>
          ) : (
            <div className="empty-chat-state">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Inbox;