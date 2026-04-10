import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { Megaphone } from 'lucide-react';

const InfoSection = () => {
  const [announcements, setAnnouncements] = useState([]);

  // Fetch latest 3 announcements from Firebase
  useEffect(() => {
    const q = query(
      collection(db, "announcements"), 
      orderBy("createdAt", "desc"), 
      limit(3)
    );

    const unsub = onSnapshot(q, (snap) => {
      setAnnouncements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, []);

  return (
    <main className="container">
      {/* How it Works Section */}
      <section id="how" style={{ padding: '60px 0' }}>
        <h2 className="section-title">How It Works</h2>
        <div className="steps">
          <div className="card">
            <span className="step-number">01</span>
            <strong>Create your profile</strong>
            <p className="muted">Add your course, technical strengths, and soft skills to stand out.</p>
          </div>
          <div className="card">
            <span className="step-number">02</span>
            <strong>Get suggestions</strong>
            <p className="muted">Our matching algorithm finds roles specifically aligned to your profile.</p>
          </div>
          <div className="card">
            <span className="step-number">03</span>
            <strong>Check requirements</strong>
            <p className="muted">Instantly see if experience is needed or if it's entry-level friendly.</p>
          </div>
          <div className="card">
            <span className="step-number">04</span>
            <strong>Apply</strong>
            <p className="muted">Submit your application and track your hiring status in one place.</p>
          </div>
        </div>
      </section>

      {/* NEW: Announcements Section */}
      {announcements.length > 0 && (
        <section id="updates" style={{ padding: '40px 0' }}>
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <Megaphone size={24} color="#2563eb" /> Latest Updates
          </h2>
          <div className="grid">
            {announcements.map((item) => (
              <div key={item.id} className="card" style={{ borderLeft: '4px solid #2563eb' }}>
                <small style={{ color: '#64748b' }}>
                  {item.createdAt?.toDate().toLocaleDateString() || "Just now"}
                </small>
                <p style={{ marginTop: '10px', fontWeight: '500' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" style={{ padding: '60px 0' }}>
        <h2 className="section-title">Get in Touch</h2>
        <div className="grid">
          <div className="card">
            <strong>Email Support</strong>
            <p className="muted">hello@Intjobs.app</p>
          </div>
          <div className="card">
            <strong>Partnerships</strong>
            <p className="muted">tcc.ccs.official@gmail.com</p>
          </div>
          <div className="card">
            <strong>Employer Inquiries</strong>
            <p className="muted">talent@Intjobs.app</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default InfoSection;