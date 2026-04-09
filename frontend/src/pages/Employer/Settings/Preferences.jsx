import React, { useState, useEffect } from 'react';
import { db } from '../../../services/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { 
  CheckCircledIcon, 
  UpdateIcon, 
  MoonIcon, 
  SunIcon,
  GlobeIcon,
  ClockIcon
} from '@radix-ui/react-icons';

const Preferences = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [settings, setSettings] = useState({
    language: 'English (US)',
    timezone: '(GMT+08:00) Manila',
    theme: 'light'
  });

  // 1. Listen for preference changes
  useEffect(() => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.preferences) {
          setSettings(data.preferences);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Save to Firestore
  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        preferences: settings,
        updatedAt: new Date()
      });
      showToast("System Updated", "Preferences saved to your account.", "success");
    } catch (error) {
      showToast("Error", "Failed to update preferences.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-slate-400 font-bold">Loading system preferences...</div>;

  return (
    <div className="glass-card settings-content-card p-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
        <div>
          <h3 className="settings-section-title mb-1">System Preferences</h3>
          <p className="text-xs text-slate-400 font-bold">Customize your workspace experience.</p>
        </div>
        <button onClick={handleSave} className="save-btn-settings" disabled={isSaving}>
          {isSaving ? <UpdateIcon className="animate-spin" /> : <CheckCircledIcon />}
          {isSaving ? "Syncing..." : "Save Changes"}
        </button>
      </div>

      <div className="settings-form-grid">
        {/* Localization */}
        <div className="input-group">
          <label className="flex items-center gap-2">
            <GlobeIcon className="w-3 h-3" /> Preferred Language
          </label>
          <select 
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 outline-none hover:border-indigo-200 transition-colors"
            value={settings.language}
            onChange={(e) => setSettings({...settings, language: e.target.value})}
          >
            <option>English (US)</option>
            <option>English (UK)</option>
            <option>Filipino</option>
          </select>
        </div>

        <div className="input-group">
          <label className="flex items-center gap-2">
            <ClockIcon className="w-3 h-3" /> Timezone
          </label>
          <select 
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 outline-none hover:border-indigo-200 transition-colors"
            value={settings.timezone}
            onChange={(e) => setSettings({...settings, timezone: e.target.value})}
          >
            <option>(GMT+08:00) Manila</option>
            <option>(GMT+00:00) UTC</option>
            <option>(GMT-08:00) Pacific Time</option>
          </select>
        </div>

        {/* Theme Selection */}
        <div className="input-group full-width mt-6">
          <label className="mb-4">Dashboard Theme</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Light Mode */}
            <div 
              onClick={() => setSettings({...settings, theme: 'light'})}
              className={`group p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between ${settings.theme === 'light' ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-3xl flex items-center justify-center transition-colors ${settings.theme === 'light' ? 'bg-white text-orange-400' : 'bg-slate-50 text-slate-400'}`}>
                  <SunIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-700">Light Mode</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">System Default</p>
                </div>
              </div>
              {settings.theme === 'light' && <CheckCircledIcon className="text-indigo-600 w-5 h-5" />}
            </div>

            {/* Dark Mode */}
            <div 
              onClick={() => setSettings({...settings, theme: 'dark'})}
              className={`group p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between ${settings.theme === 'dark' ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-3xl flex items-center justify-center transition-colors ${settings.theme === 'dark' ? 'bg-slate-900 text-indigo-400' : 'bg-slate-50 text-slate-400'}`}>
                  <MoonIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-700">Dark Mode</p>
                  <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">Premium Feature</p>
                </div>
              </div>
              {settings.theme === 'dark' && <CheckCircledIcon className="text-indigo-600 w-5 h-5" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;