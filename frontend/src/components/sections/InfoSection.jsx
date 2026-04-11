import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { Megaphone, Mail, Handshake, Building2 } from 'lucide-react';
import '../../styles/InfoSection.css'; // Make sure to create this file

const InfoSection = () => {
  const [announcements, setAnnouncements] = useState([]);

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
    <main className="info-container">
      {/* How it Works Section */}
      <section id="how" className="info-section">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          <div className="info-card step-card">
            <span className="step-number">01</span>
            <strong className="card-label">Create your profile</strong>
            <p className="muted-text">Add your course, technical strengths, and soft skills to stand out.</p>
          </div>
          <div className="info-card step-card">
            <span className="step-number">02</span>
            <strong className="card-label">Get suggestions</strong>
            <p className="muted-text">Our matching algorithm finds roles specifically aligned to your profile.</p>
          </div>
          <div className="info-card step-card">
            <span className="step-number">03</span>
            <strong className="card-label">Check requirements</strong>
            <p className="muted-text">Instantly see if experience is needed or if it's entry-level friendly.</p>
          </div>
          <div className="info-card step-card">
            <span className="step-number">04</span>
            <strong className="card-label">Apply</strong>
            <p className="muted-text">Submit your application and track your hiring status in one place.</p>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <section id="updates" className="info-section updates-section">
          <h2 className="section-title announcement-header">
            <Megaphone className="icon-blue" size={28} /> Latest Updates
          </h2>
          <div className="info-grid">
            {announcements.map((item) => (
              <div key={item.id} className="info-card announcement-card">
                <small className="date-text">
                  {item.createdAt?.toDate().toLocaleDateString() || "Just now"}
                </small>
                <p className="announcement-text">{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="info-section">
        <h2 className="section-title">Get in Touch</h2>
        <div className="info-grid">
          <div className="info-card contact-card">
            <Mail className="icon-blue" size={20} />
            <strong className="card-label">Email Support</strong>
            <p className="muted-text">hello@Intjobs.app</p>
          </div>
          <div className="info-card contact-card">
            <Handshake className="icon-blue" size={20} />
            <strong className="card-label">Partnerships</strong>
            <p className="muted-text">tcc.ccs.official@gmail.com</p>
          </div>
          <div className="info-card contact-card">
            <Building2 className="icon-blue" size={20} />
            <strong className="card-label">Employer Inquiries</strong>
            <p className="muted-text">talent@Intjobs.app</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default InfoSection;