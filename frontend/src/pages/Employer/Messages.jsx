import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../services/firebase';
import { 
  collection, query, where, onSnapshot, orderBy, 
  addDoc, serverTimestamp, doc, updateDoc, increment 
} from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext'; 
import { PaperPlaneIcon, DotsVerticalIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import '../../styles/Messages.css';

const Messages = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const scrollRef = useRef();

  // Helper to determine the chat partner's identity
  const getChatPartnerName = (chat) => {
    if (chat.participantNames && user?.uid) {
      const partnerId = chat.participants.find(id => id !== user.uid);
      return chat.participantNames[partnerId] || "Applicant";
    }
    return chat.chatName || "Applicant";
  };

  // 1. Fetch conversation list
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setConversations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error("Chat list error:", err);
    });
    return () => unsub();
  }, [user]);

  // 2. Fetch messages for active chat
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

  // 3. Mark as Read: Reset unread count when clicking a chat
  useEffect(() => {
    if (!activeChat || !user) return;
    if (activeChat.unreadCount?.[user.uid] > 0) {
      const resetUnread = async () => {
        try {
          await updateDoc(doc(db, "chats", activeChat.id), {
            [`unreadCount.${user.uid}`]: 0
          });
        } catch (err) {
          console.error("Error resetting unread:", err);
        }
      };
      resetUnread();
    }
  }, [activeChat, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChat) return;

    const text = messageText;
    const partnerId = activeChat.participants.find(id => id !== user.uid);
    setMessageText("");

    try {
      // Add message to sub-collection
      await addDoc(collection(db, "chats", activeChat.id, "messages"), {
        text,
        senderId: user.uid,
        timestamp: serverTimestamp(),
      });

      // Update parent chat metadata
      await updateDoc(doc(db, "chats", activeChat.id), {
        lastMessage: text,
        updatedAt: serverTimestamp(),
        [`unreadCount.${partnerId}`]: increment(1)
      });
    } catch (err) {
      showToast("Error", "Could not send message.", "error");
    }
  };

  return (
    <div className="messages-container animate-in fade-in zoom-in-95 duration-500">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h2 className="text-2xl font-black text-blue-600 tracking-tight">Messages</h2>
          <div className="search-bar">
            <MagnifyingGlassIcon className="text-slate-400" />
            <input type="text" placeholder="Search conversations..." />
          </div>
        </div>

        <div className="conversation-list">
          {conversations.map((chat) => {
            const partnerName = getChatPartnerName(chat);
            const isUnread = chat.unreadCount?.[user.uid] > 0;

            return (
              <button 
                key={chat.id} 
                onClick={() => setActiveChat(chat)}
                className={`conversation-item ${activeChat?.id === chat.id ? 'active' : ''}`}
              >
                <div className="avatar-small">{partnerName[0]}</div>
                <div className="chat-info">
                  <div className="chat-top">
                    <span className="contact-name">{partnerName}</span>
                    {isUnread && (
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {chat.unreadCount[user.uid]}
                      </span>
                    )}
                  </div>
                  <p className={`last-msg ${isUnread ? 'font-black text-slate-900' : ''}`}>
                    {chat.lastMessage || "No messages yet"}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {activeChat ? (
          <>
            <div className="chat-header">
              <div className="flex items-center gap-4">
                <div className="avatar-medium">{getChatPartnerName(activeChat)[0]}</div>
                <div>
                  <h3 className="font-bold text-slate-800">{getChatPartnerName(activeChat)}</h3>
                  <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Online</span>
                </div>
              </div>
              <DotsVerticalIcon className="text-slate-400 cursor-pointer w-5 h-5" />
            </div>

            <div className="chat-body">
              {messages.map((msg) => (
                <div key={msg.id} className={`message-row ${msg.senderId === user.uid ? 'me' : 'them'}`}>
                  <div className="msg-bubble shadow-sm">
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
                  placeholder="Type a message..." 
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
          <div className="empty-state">
             <div className="empty-icon text-5xl mb-4">✉️</div>
             <p className="font-black text-slate-300 text-xl">Select a chat to begin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;