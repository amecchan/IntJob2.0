import React, { useState } from 'react';
import { 
  EnvelopeClosedIcon, 
  MagnifyingGlassIcon, 
  PaperPlaneIcon, 
  DotsVerticalIcon,
  CheckCircledIcon,
  ClockIcon
} from '@radix-ui/react-icons';
import '../../styles/Messages.css';

const Messages = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [messageText, setMessageText] = useState("");

  const contacts = [
    { id: 1, name: "Juan Dela Cruz", lastMsg: "I've sent the updated portfolio...", time: "10:24 AM", online: true, unread: 2 },
    { id: 2, name: "Maria Clara", lastMsg: "When is the next interview?", time: "Yesterday", online: false, unread: 0 },
    { id: 3, name: "Leonor Rivera", lastMsg: "Thank you for the opportunity!", time: "Mar 28", online: true, unread: 0 },
  ];

  const mockMessages = [
    { id: 1, sender: "Juan Dela Cruz", text: "Hi! I'm interested in the Frontend role.", time: "10:15 AM", isMe: false },
    { id: 2, sender: "Me", text: "Hello Juan! We reviewed your profile. Can you send your portfolio?", time: "10:20 AM", isMe: true },
    { id: 3, sender: "Juan Dela Cruz", text: "Sure thing! I've sent the updated portfolio to your email just now.", time: "10:24 AM", isMe: false },
  ];

  return (
    <div className="messages-container animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Sidebar: Conversation List */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h2 className="text-xl font-black text-slate-800">Messages</h2>
          <div className="search-bar">
            <MagnifyingGlassIcon />
            <input type="text" placeholder="Search chats..." />
          </div>
        </div>

        <div className="conversation-list">
          {contacts.map((contact) => (
            <button 
              key={contact.id} 
              onClick={() => setActiveChat(contact.id)}
              className={`conversation-item ${activeChat === contact.id ? 'active' : ''}`}
            >
              <div className="avatar-wrapper">
                <div className="avatar-small">
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </div>
                {contact.online && <div className="online-indicator" />}
              </div>
              <div className="chat-info">
                <div className="chat-top">
                  <span className="contact-name">{contact.name}</span>
                  <span className="msg-time">{contact.time}</span>
                </div>
                <p className="last-msg">{contact.lastMsg}</p>
              </div>
              {contact.unread > 0 && <div className="unread-badge">{contact.unread}</div>}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main: Chat Window */}
      <div className="chat-main">
        <div className="chat-header">
          <div className="flex items-center gap-4">
            <div className="avatar-medium">J</div>
            <div>
              <h3 className="font-black text-slate-800 leading-none">Juan Dela Cruz</h3>
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Online Now</span>
            </div>
          </div>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <DotsVerticalIcon className="text-slate-400" />
          </button>
        </div>

        <div className="chat-body">
          <div className="date-separator">Today, April 2</div>
          
          {mockMessages.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.isMe ? 'me' : 'them'}`}>
              {!msg.isMe && <div className="msg-avatar">{msg.sender[0]}</div>}
              <div className="msg-bubble">
                <p>{msg.text}</p>
                <span className="msg-meta">
                  {msg.time} {msg.isMe && <CheckCircledIcon className="inline ml-1 w-3 h-3" />}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-footer">
          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
            <button className="send-btn">
              <PaperPlaneIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;