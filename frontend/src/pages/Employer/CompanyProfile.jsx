import React, { useEffect, useState } from 'react';
import { 
  CameraIcon, EnvelopeClosedIcon, MobileIcon, PinBottomIcon, 
  CheckCircledIcon, UpdateIcon, GlobeIcon, Link2Icon, ShadowIcon, UploadIcon
} from '@radix-ui/react-icons';
import { db, storage } from '../../services/firebase';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../context/ToastContext'; // Import Toast
import '../../styles/CompanyProfile.css';

const CompanyProfile = () => {
  const { user } = useAuth();
  const { showToast } = useToast(); // Initialize Toast
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", location: "",
    website: "", taxId: "", permitNo: "", foundedDate: "",
    logoUrl: "", tinDocUrl: ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, "companies", user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      }
    }, (error) => {
      showToast("Sync Error", "Failed to fetch real-time updates.", "error");
    });
    return () => unsubscribe();
  }, [user, showToast]);

  const handleSync = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, "companies", user.uid);
      await setDoc(docRef, { ...formData, updatedAt: new Date() }, { merge: true });
      showToast("Profile Updated", "Your company information is now synced.", "success");
    } catch (error) {
      showToast("Update Failed", error.message, "error");
    } finally {
      setTimeout(() => setIsSaving(false), 1000);
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `companies/${user.uid}/${field}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      
      const docRef = doc(db, "companies", user.uid);
      await updateDoc(docRef, { [field]: url });
      
      const fileName = field === 'logoUrl' ? "Company Logo" : "TIN Document";
      showToast("Upload Success", `${fileName} has been saved.`, "success");
    } catch (error) {
      showToast("Upload Failed", "Could not save document.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="intjob-profile-v2-container animate-in fade-in duration-500">
      <header className="profile-header-area">
        <div>
          <h1 className="profile-main-title">Company Center</h1>
          <p className="profile-sub-title">Manage your public presence and legal identity</p>
        </div>
        <button onClick={handleSync} className="premium-sync-btn" disabled={isSaving}>
          {isSaving ? <UpdateIcon className="animate-spin" /> : <CheckCircledIcon />}
          {isSaving ? "Syncing..." : "Sync Changes"}
        </button>
      </header>

      <div className="profile-master-grid">
        <aside className="brand-sidebar">
          <div className="glass-card brand-card">
            <div className="logo-v2-container">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo" className="logo-sq-preview object-cover" />
              ) : (
                <div className="logo-sq-preview">{formData.name?.charAt(0) || "?"}</div>
              )}
              <label htmlFor="logo-input" className="logo-cam-btn">
                <CameraIcon />
              </label>
              <input type="file" id="logo-input" hidden onChange={(e) => handleFileUpload(e, 'logoUrl')} />
            </div>
            <div className="brand-text-block">
              <h2>{formData.name || "Set Company Name"}</h2>
              <div className="verified-badge">
                <span className="dot-pulse"></span>
                <p>Verified Employer</p>
              </div>
            </div>
          </div>

          <div className="glass-card verification-card">
            <h3 className="micro-label">Legal Documents</h3>
            <div className="verification-stack">
              <div className="verification-item">
                <span className="info-label">TIN Document</span>
                {formData.tinDocUrl ? (
                  <span className="info-value status-success">UPLOADED</span>
                ) : (
                  <label className="upload-placeholder-btn">
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, 'tinDocUrl')} />
                    {uploading ? "Uploading..." : "Click to Upload TIN"}
                  </label>
                )}
              </div>
              <div className="verification-item">
                <span className="info-label">Permit Status</span>
                <span className="info-value">{formData.permitNo ? "RECORDED" : "PENDING"}</span>
              </div>
            </div>
          </div>
        </aside>

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
                <div className="input-field-group full-width with-icon-box">
                  <label>Website URL</label>
                  <GlobeIcon className="field-icon" />
                  <input type="text" className="pad-icon" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
                </div>
              </div>
            </section>
            {/* Legal section remains same */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyProfile;