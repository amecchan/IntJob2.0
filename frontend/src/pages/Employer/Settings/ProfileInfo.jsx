// src/pages/Employer/settings/ProfileInfo.jsx
import React, { useState } from 'react';
import { CameraIcon, CheckCircledIcon, UpdateIcon } from '@radix-ui/react-icons';

const ProfileInfo = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "Lew Dew",
    title: "HR Director",
    email: "lewdew@techflow.io"
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500); // Mock save delay
  };

  return (
    <div className="glass-card settings-content-card p-10">
      
      {/* Title + Action Area */}
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
        <h3 className="settings-section-title">Personal Profile</h3>
        <button 
          onClick={handleSave} 
          className="save-btn-settings"
          disabled={isSaving}
        >
          {isSaving ? <UpdateIcon className="animate-spin" /> : <CheckCircledIcon />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="profile-zone mb-10">
          <div className="avatar-lg bg-indigo-100 text-indigo-700 font-black">LD</div>
          <button className="change-photo-btn mt-4 flex items-center gap-2 text-xs text-slate-500 font-bold hover:text-indigo-600 transition-colors">
            <CameraIcon /> Update Profile Photo
          </button>
      </div>
      
      <div className="settings-form-grid">
        <div className="input-group">
          <label>Full Name</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
        </div>
        
        <div className="input-group">
          <label>Job Title</label>
          <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
        </div>
        
        <div className="input-group full-width">
          <label>Email Address</label>
          <input type="email" value={formData.email} disabled className="bg-slate-50 cursor-not-allowed opacity-70" />
          <span className="text-[10px] text-slate-400 font-medium italic mt-1">*managed by organization admin</span>
        </div>
      </div>

    </div>
  );
};

export default ProfileInfo;