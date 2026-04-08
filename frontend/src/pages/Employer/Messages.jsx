import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../services/firebase';
import { 
  collection, query, where, onSnapshot, orderBy, 
  addDoc, serverTimestamp, doc, updateDoc 
} from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { PaperPlaneIcon, DotsVerticalIcon, CheckCircledIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import '../../styles/Messages.css';

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const scrollRef = useRef();

  // 1. Fetch Conversations (Rooms where I am a participant)
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setConversations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  // 2. Fetch Messages for Active Chat
  useEffect(() => {
    if (!activeChat) return;
    const q = query(
      collection(db, "chats", activeChat.id, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsub();
  }, [activeChat]);

  // 3. Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChat) return;

    const text = messageText;
    setMessageText("");

    // Add to sub-collection
    await addDoc(collection(db, "chats", activeChat.id, "messages"), {
      text,
      senderId: user.uid,
      timestamp: serverTimestamp(),
    });

    // Update parent chat metadata
    await updateDoc(doc(db, "chats", activeChat.id), {
      lastMessage: text,
      updatedAt: serverTimestamp()
    });
  };

  return (
    <div className="messages-container animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h2 className="text-xl font-black text-slate-800">Messages</h2>
          <div className="search-bar">
            <MagnifyingGlassIcon />
            <input type="text" placeholder="Search chats..." />
          </div>
        </div>

        <div className="conversation-list">
          {conversations.map((chat) => (
            <button 
              key={chat.id} 
              onClick={() => setActiveChat(chat)}
              className={`conversation-item ${activeChat?.id === chat.id ? 'active' : ''}`}
            >
              <div className="avatar-small">{chat.chatName?.[0] || "C"}</div>
              <div className="chat-info">
                <div className="chat-top">
                  <span className="contact-name">{chat.chatName || "Candidate"}</span>
                </div>
                <p className="last-msg text-truncate">{chat.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="chat-main">
        {activeChat ? (
          <>
            <div className="chat-header">
              <div className="flex items-center gap-4">
                <div className="avatar-medium">{activeChat.chatName?.[0]}</div>
                <h3 className="font-black text-slate-800">{activeChat.chatName}</h3>
              </div>
              <DotsVerticalIcon className="text-slate-400 cursor-pointer" />
            </div>

            <div className="chat-body">
              {messages.map((msg) => (
                <div key={msg.id} className={`message-row ${msg.senderId === user.uid ? 'me' : 'them'}`}>
                  <div className="msg-bubble">
                    <p>{msg.text}</p>
                    <span className="msg-meta">
                      {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <form className="chat-footer" onSubmit={handleSendMessage}>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <button type="submit" className="send-btn">
                  <PaperPlaneIcon />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
             <p className="font-bold">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;