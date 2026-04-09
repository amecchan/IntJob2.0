import React, { useState, useEffect } from 'react';
import { db } from '../../../services/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { 
  CheckCircledIcon, 
  UpdateIcon, 
  EnvelopeClosedIcon, 
  MobileIcon,
  LockClosedIcon 
} from '@radix-ui/react-icons';

const Notifications = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State matches the keys we will use in Firestore
  const [prefs, setPrefs] = useState({
    emailApplicants: true,
    emailMessages: true,
    smsAlerts: false
  });

  // 1. Fetch preferences on mount
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // If the 'notifications' object exists in Firestore, use it
        if (data.notifications) {
          setPrefs(data.notifications);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Save preferences
  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        notifications: prefs,
        updatedAt: new Date()
      });
      showToast("Settings Updated", "Your notification preferences are now live.", "success");
    } catch (error) {
      showToast("Error", "Could not sync preferences.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const togglePref = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) return <div className="p-10 text-slate-400 font-bold">Loading preferences...</div>;

  return (
    <div className="glass-card settings-content-card p-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
        <div>
          <h3 className="settings-section-title mb-1">Notification Channels</h3>
          <p className="text-xs text-slate-400 font-bold">Control how you want to be reached.</p>
        </div>
        <button 
          onClick={handleSave} 
          className="save-btn-settings" 
          disabled={isSaving}
        >
          {isSaving ? <UpdateIcon className="animate-spin" /> : <CheckCircledIcon />}
          {isSaving ? "Syncing..." : "Save Preferences"}
        </button>
      </div>

      <div className="toggle-list space-y-8">
        {/* Email Section */}
        <div className="notification-group">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <EnvelopeClosedIcon className="text-indigo-600 w-4 h-4" />
            </div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Alerts</h4>
          </div>
          
          <div className={`toggle-item flex justify-between items-center p-5 rounded-2xl mb-4 transition-all duration-300 border ${prefs.emailApplicants ? 'bg-indigo-50/30 border-indigo-100' : 'bg-slate-50/50 border-transparent'}`}>
            <div>
              <h5 className="text-sm font-black text-slate-700">New Candidate Applications</h5>
              <p className="text-xs text-slate-400 font-bold mt-1">Receive a summary when someone applies to your jobs.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={prefs.emailApplicants} 
                onChange={() => togglePref('emailApplicants')}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className={`toggle-item flex justify-between items-center p-5 rounded-2xl transition-all duration-300 border ${prefs.emailMessages ? 'bg-indigo-50/30 border-indigo-100' : 'bg-slate-50/50 border-transparent'}`}>
            <div>
              <h5 className="text-sm font-black text-slate-700">Direct Messages</h5>
              <p className="text-xs text-slate-400 font-bold mt-1">Instant email when a candidate replies to a thread.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={prefs.emailMessages} 
                onChange={() => togglePref('emailMessages')}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {/* SMS Section */}
        <div className="notification-group pt-8 border-t border-slate-50">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-slate-100 rounded-lg">
              <MobileIcon className="text-slate-500 w-4 h-4" />
            </div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Push</h4>
          </div>
          
          <div className="toggle-item flex justify-between items-center p-5 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
            <div className="flex items-center gap-4">
              <div className="text-slate-300"><LockClosedIcon /></div>
              <div>
                <h5 className="text-sm font-black text-slate-400">SMS Notifications</h5>
                <p className="text-xs text-slate-400 font-bold mt-1">Standard rates apply. Available for Premium Employers.</p>
              </div>
            </div>
            <button className="text-[9px] font-black bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-400 shadow-sm uppercase tracking-tighter">Upgrade Plan</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;