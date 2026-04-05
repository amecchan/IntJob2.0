import React, { useState } from 'react';
import { 
  CameraIcon, 
  EnvelopeClosedIcon, 
  MobileIcon, 
  PinBottomIcon, 
  CheckCircledIcon, 
  UpdateIcon,
  GlobeIcon,
  Link2Icon,
  ShadowIcon // Replaced CheckBadgeIcon with ShadowIcon to avoid the ReferenceError
} from '@radix-ui/react-icons';
import '../../styles/CompanyProfile.css';

const CompanyProfile = () => {
  const [formData, setFormData] = useState({
    name: "TechFlow Solutions Inc.",
    email: "hr@techflow.io",
    phone: "+63 917 123 4567",
    location: "BGC, Taguig City, Philippines",
    website: "techflow.io",
    taxId: "001-234-567-000",
    permitNo: "BP-2026-77881",
    foundedDate: "2018-05-15",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500); 
  };

  return (
    <div className="intjob-profile-v2-container animate-in fade-in duration-500">
      
      {/* HEADER */}
      <header className="profile-header-area">
        <div>
          <h1 className="profile-main-title">Company Center</h1>
          <p className="profile-sub-title">Manage your public presence and legal identity</p>
        </div>
        <button onClick={handleSave} className="premium-sync-btn" disabled={isSaving}>
          {isSaving ? <UpdateIcon className="animate-spin" /> : <CheckCircledIcon />}
          {isSaving ? "Syncing..." : "Sync Changes"}
        </button>
      </header>

      {/* MAIN GRID */}
      <div className="profile-master-grid">
        
        {/* SIDEBAR */}
        <aside className="brand-sidebar">
          <div className="glass-card brand-card">
            <div className="logo-v2-container">
              <div className="logo-sq-preview">{formData.name.charAt(0)}</div>
              <label htmlFor="logo-input" className="logo-cam-btn"><CameraIcon /></label>
              <input type="file" id="logo-input" hidden />
            </div>
            <div className="brand-text-block">
              <h2>{formData.name}</h2>
              <div className="verified-badge">
                <span className="dot-pulse"></span>
                <p>Verified Employer</p>
              </div>
              <div className="website-link">
                <Link2Icon /> <span>{formData.website}</span>
              </div>
            </div>
          </div>

          {/* FIXED VERIFICATION SECTION */}
          {/* FIXED VERIFICATION SECTION */}
            <div className="glass-card verification-card">
                <h3 className="micro-label">Verification Details</h3>
            
            {/* The stack ensures labels and values stay together and inside the card */}
                <div className="verification-stack">
                    <div className="verification-item">
                    <span className="info-label">TIN Status</span>
                    <span className="info-value status-success">COMPLIANT</span>
                </div>
                
                <div className="verification-item">
                    <span className="info-label">Permit Exp</span>
                    <span className="info-value">Dec 2026</span>
                </div>
                </div>
            </div>
        </aside>

        {/* FORM CONTENT */}
        <main className="form-content-area">
          <div className="glass-card main-entry-card">
            <section className="form-section">
              <h3 className="section-heading">General Information</h3>
              <div className="input-row-grid">
                <div className="input-field-group">
                  <label>Legal Company Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="input-field-group">
                  <label>Founded Date</label>
                  <input type="date" value={formData.foundedDate} onChange={(e) => setFormData({...formData, foundedDate: e.target.value})} />
                </div>
                <div className="input-field-group with-icon-box">
                  <label>Company Email</label>
                  <EnvelopeClosedIcon className="field-icon" />
                  <input type="email" className="pad-icon" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="input-field-group with-icon-box">
                  <label>Contact Number</label>
                  <MobileIcon className="field-icon" />
                  <input type="text" className="pad-icon" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="input-field-group full-width with-icon-box">
                  <label>Business Address</label>
                  <PinBottomIcon className="field-icon" />
                  <input type="text" className="pad-icon" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                </div>
              </div>
            </section>

            <section className="form-section legal-top-border">
              <h3 className="section-heading">Legal & Compliance</h3>
              <div className="input-row-grid">
                <div className="input-field-group">
                  <label>Tax ID (TIN)</label>
                  <input type="text" placeholder="000-000-000-000" value={formData.taxId} onChange={(e) => setFormData({...formData, taxId: e.target.value})} />
                </div>
                <div className="input-field-group">
                  <label>Business Permit No.</label>
                  <input type="text" placeholder="BP-2026-XXXXX" value={formData.permitNo} onChange={(e) => setFormData({...formData, permitNo: e.target.value})} />
                </div>
              </div>
              <p className="legal-notice">* Data is encrypted for platform compliance checks.</p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyProfile;