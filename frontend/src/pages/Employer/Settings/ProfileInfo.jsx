import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../services/firebase'; 
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { CameraIcon, CheckCircledIcon, UpdateIcon } from '@radix-ui/react-icons';

const ProfileInfo = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    email: "",
    photoURL: ""
  });

  // 1. Real-time fetch from the 'users' collection
  useEffect(() => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          name: data.fullName || "", // Matches 'fullName' in your screenshot
          jobTitle: data.jobTitle || "",
          email: data.email || "", // Matches 'email' in your screenshot
          photoURL: data.photoURL || ""
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Update text fields (fullName and jobTitle)
  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        fullName: formData.name,
        jobTitle: formData.jobTitle,
        updatedAt: new Date()
      });
      showToast("Success", "Personal profile updated.", "success");
    } catch (error) {
      showToast("Error", "Failed to save profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Handle Profile Photo Upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `users/${user.uid}/profile_photo_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { photoURL: url });
      
      showToast("Success", "Photo updated.", "success");
    } catch (error) {
      showToast("Error", "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const initials = formData.name 
    ? formData.name.split(" ").map(n => n[0]).join("").toUpperCase() 
    : "?";

  return (
    <div className="glass-card settings-content-card p-10">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
        <h3 className="settings-section-title">Personal Profile</h3>
        <button onClick={handleSave} className="save-btn-settings" disabled={isSaving}>
          {isSaving ? <UpdateIcon className="animate-spin" /> : <CheckCircledIcon />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="profile-zone mb-10">
          <div className="avatar-lg bg-indigo-100 text-indigo-700 font-black overflow-hidden flex items-center justify-center rounded-full w-24 h-24 text-2xl">
            {formData.photoURL ? (
              <img src={formData.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <label className="change-photo-btn mt-4 flex items-center gap-2 text-xs text-slate-500 font-bold hover:text-indigo-600 transition-colors cursor-pointer">
            <CameraIcon /> {uploading ? "Uploading..." : "Update Profile Photo"}
            <input type="file" hidden onChange={handlePhotoUpload} accept="image/*" />
          </label>
      </div>
      
      <div className="settings-form-grid">
        <div className="input-group">
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Full Name</label>
          <input 
            type="text" 
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all"
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
        </div>
        
        <div className="input-group">
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Job Title</label>
          <input 
            type="text" 
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all"
            placeholder="e.g. HR Manager"
            value={formData.jobTitle} 
            onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} 
          />
        </div>
        
        <div className="input-group full-width">
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
          <input type="email" value={formData.email} disabled className="w-full p-3 bg-slate-100 cursor-not-allowed opacity-70 rounded-xl font-bold text-slate-500" />
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;