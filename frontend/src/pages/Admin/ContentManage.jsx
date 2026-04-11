import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  deleteDoc, 
  doc, 
  setDoc 
} from 'firebase/firestore';
import { 
  Megaphone, HelpCircle, Info, FileSignature, 
  ChevronRight, Plus, Trash2, Send, Zap
} from 'lucide-react';
import '../../styles/Admin/AdminDash.css';
import '../../styles/Admin/ContentManage.css';

const ContentManage = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [announcements, setAnnouncements] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [legalDocs, setLegalDocs] = useState({ terms: "", privacy: "" });
  
  // Form States
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [newFAQ, setNewFAQ] = useState({ q: "", a: "" });

  // 1. Fetch Data Real-time from Firebase
  useEffect(() => {
    // Announcements Listener
    const unsubAnnounce = onSnapshot(
      query(collection(db, "announcements"), orderBy("createdAt", "desc")),
      (snap) => setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );

    // FAQ Listener
    const unsubFAQ = onSnapshot(
      collection(db, "faqs"),
      (snap) => setFaqs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );

    // Legal Docs (Terms/Privacy) Listener
    const unsubLegal = onSnapshot(doc(db, "settings", "legal"), (snap) => {
      if (snap.exists()) {
        setLegalDocs(snap.data());
      }
    });

    return () => { 
      unsubAnnounce(); 
      unsubFAQ(); 
      unsubLegal();
    };
  }, []);

  // 2. Handlers
  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;
    try {
      await addDoc(collection(db, "announcements"), {
        text: newAnnouncement,
        createdAt: serverTimestamp(),
        type: "system-wide"
      });
      setNewAnnouncement("");
      alert("Announcement posted successfully!");
    } catch (err) { 
      console.error("Error posting announcement:", err);
      alert("Failed to post announcement.");
    }
  };

  const handleAddFAQ = async (e) => {
    e.preventDefault();
    if (!newFAQ.q || !newFAQ.a) return;
    try {
      await addDoc(collection(db, "faqs"), newFAQ);
      setNewFAQ({ q: "", a: "" });
      alert("FAQ added!");
    } catch (err) { 
      console.error("Error adding FAQ:", err);
    }
  };

  const handleUpdateLegal = async () => {
    try {
      const legalRef = doc(db, "settings", "legal");
      await setDoc(legalRef, legalDocs, { merge: true });
      alert(`${activeTab.toUpperCase()} updated successfully!`);
    } catch (err) {
      console.error("Error updating legal content:", err);
      alert("Error updating content.");
    }
  };

  const handleDelete = async (col, id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        await deleteDoc(doc(db, col, id));
      } catch (err) {
        console.error("Error deleting document:", err);
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'announcements':
        return (
          <div className="tab-content-fade">
            <h2 className="content-title"><Megaphone size={20} className="title-icon" /> Announcements</h2>
            <form className="content-form" onSubmit={handlePostAnnouncement}>
              <textarea 
                placeholder="Write a new announcement for all users..."
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
              />
              <button type="submit" className="btn-post">
                <Send size={18} /> Post Announcement
              </button>
            </form>

            <div className="content-table-wrapper">
              <table className="content-table">
                <thead>
                  <tr><th>Date</th><th>Announcement</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {announcements.map(item => (
                    <tr key={item.id}>
                      <td>{item.createdAt ? item.createdAt.toDate().toLocaleDateString() : "Posting..."}</td>
                      <td>{item.text}</td>
                      <td>
                        <button className="btn-del" onClick={() => handleDelete("announcements", item.id)}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'faq':
        return (
          <div className="tab-content-fade">
            <h2 className="content-title"><HelpCircle size={20} className="title-icon" /> Frequently Asked Questions</h2>
            <form className="faq-form" onSubmit={handleAddFAQ}>
              <input type="text" placeholder="Question" value={newFAQ.q} onChange={e => setNewFAQ({...newFAQ, q: e.target.value})} />
              <textarea placeholder="Answer" value={newFAQ.a} onChange={e => setNewFAQ({...newFAQ, a: e.target.value})} />
              <button type="submit" className="btn-add"><Plus size={18} /> Add FAQ</button>
            </form>

            {faqs.map((item) => (
              <div key={item.id} className="faq-item">
                <div className="faq-header">
                  <h3 className="faq-question"><ChevronRight size={16} /> {item.q}</h3>
                  <button className="btn-del-small" onClick={() => handleDelete("faqs", item.id)}><Trash2 size={14} /></button>
                </div>
                <p className="faq-answer">{item.a}</p>
              </div>
            ))}
          </div>
        );
      case 'terms':
      case 'privacy':
        return (
          <div className="tab-content-fade">
            <h2 className="content-title">
              <FileSignature size={20} className="title-icon" /> 
              {activeTab === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
            </h2>
            <div className="content-form">
              <textarea 
                style={{ minHeight: '350px', lineHeight: '1.6' }}
                placeholder={`Edit the ${activeTab} content...`}
                value={activeTab === 'terms' ? legalDocs.terms : legalDocs.privacy}
                onChange={(e) => setLegalDocs({
                  ...legalDocs,
                  [activeTab]: e.target.value
                })}
              />
              <button className="btn-post" onClick={handleUpdateLegal}>
                <Zap size={18} /> Update {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </button>
            </div>
            <p className="helper-text" style={{marginTop: '10px', fontSize: '0.85rem', color: '#64748b'}}>
              Tip: This content is synced with the registration and footer legal links.
            </p>
          </div>
        );
      case 'about':
        return (
          <div className="tab-content-fade">
            <h2 className="content-title"><Info size={20} className="title-icon" /> About This System</h2>
            <div className="content-card">
              <p>Manage the core information of the IntJob platform here. Updates are instant.</p>
            </div>
            <div className="info-grid">
                <div className="info-box"><h3>Configurable</h3><p>Every module is modular.</p></div>
                <div className="info-box"><h3>Secure</h3><p>Encrypted data storage.</p></div>
                <div className="info-box"><h3>Fast</h3><p>Powered by Firebase.</p></div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="content-manage-wrapper">
      <header className="content-header">
        <h1>Content Management</h1>
        <p>Post updates and manage system information</p>
      </header>
      <div className="cm-tab-bar">
        {['announcements', 'faq', 'about', 'terms', 'privacy'].map(id => (
          <button 
            key={id} 
            onClick={() => setActiveTab(id)} 
            className={`cm-tab-btn ${activeTab === id ? 'active' : ''}`}
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </button>
        ))}
      </div>
      <div className="content-display-area">{renderTabContent()}</div>
    </div>
  );
};

export default ContentManage;