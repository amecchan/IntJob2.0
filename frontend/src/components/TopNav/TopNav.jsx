import React, { useState, useRef, useEffect } from 'react';
import { BellIcon, CheckIcon, MixerHorizontalIcon } from '@radix-ui/react-icons';
import { db } from '../../services/firebase'; // Adjust path to your firebase config
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/topnav.css';

const TopNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const modalRef = useRef(null);

  // 1. Real-time Listener
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(notifData);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Mark Single as Read
  const markAsRead = async (id) => {
    const ref = doc(db, "notifications", id);
    await updateDoc(ref, { isRead: true });
  };

  // 3. Mark All as Read
  const markAllRead = async () => {
    const batch = writeBatch(db);
    notifications.forEach((n) => {
      if (!n.isRead) {
        const ref = doc(db, "notifications", n.id);
        batch.update(ref, { isRead: true });
      }
    });
    await batch.commit();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="topnav-minimal">
      <div className="topnav-content-end">
        <div className="relative" ref={modalRef}>
          <button 
            className={`notif-trigger ${isOpen ? 'active' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <BellIcon className="w-5 h-5" />
            {unreadCount > 0 && <span className="notif-dot"></span>}
          </button>

          {isOpen && (
            <div className="notif-modal animate-in fade-in zoom-in-95 duration-200">
              <div className="notif-header">
                <h3 className="notif-title">Notifications ({unreadCount})</h3>
                <button className="mark-read-btn" onClick={markAllRead}>
                  <CheckIcon /> Mark all read
                </button>
              </div>

              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs italic">No notifications yet.</div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`notif-item ${!n.isRead ? 'is-unread' : ''}`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div className="notif-indicator"></div>
                      <div className="notif-body">
                        <p className="notif-item-title">{n.title}</p>
                        <p className="notif-item-desc">{n.message}</p>
                        <span className="notif-item-time">
                          {n.timestamp ? n.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
        <button className="topnav-utility-btn"><MixerHorizontalIcon /></button>
      </div>
    </header>
  );
};

export default TopNav;