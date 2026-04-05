// src/pages/Employer/settings/Notifications.jsx
import React, { useState } from 'react';
import { BellIcon, CheckCircledIcon, UpdateIcon, EnvelopeClosedIcon, MobileIcon } from '@radix-ui/react-icons';

const Notifications = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [prefs, setPrefs] = useState({
    emailApplicants: true,
    emailMessages: true,
    smsAlerts: false,
    marketing: false
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1200);
  };

  return (
    <div className="glass-card settings-content-card p-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
        <h3 className="settings-section-title">Notification Channels</h3>
        <button onClick={handleSave} className="save-btn-settings" disabled={isSaving}>
          {isSaving ? <UpdateIcon className="animate-spin" /> : <CheckCircledIcon />}
          {isSaving ? "Syncing..." : "Save Preferences"}
        </button>
      </div>

      <div className="toggle-list space-y-8">
        {/* Email Section */}
        <div className="notification-group">
          <div className="flex items-center gap-2 mb-6">
            <EnvelopeClosedIcon className="text-indigo-600" />
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Alerts</h4>
          </div>
          
          <div className="toggle-item flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl mb-4">
            <div>
              <h5 className="text-sm font-black text-slate-700">New Candidate Applications</h5>
              <p className="text-xs text-slate-400 font-bold mt-1">Receive a summary when someone applies to your jobs.</p>
            </div>
            <input 
              type="checkbox" 
              className="w-5 h-5 accent-indigo-600 cursor-pointer"
              checked={prefs.emailApplicants} 
              onChange={() => setPrefs({...prefs, emailApplicants: !prefs.emailApplicants})}
            />
          </div>

          <div className="toggle-item flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl">
            <div>
              <h5 className="text-sm font-black text-slate-700">Direct Messages</h5>
              <p className="text-xs text-slate-400 font-bold mt-1">Instant email when a candidate replies to a thread.</p>
            </div>
            <input 
              type="checkbox" 
              className="w-5 h-5 accent-indigo-600 cursor-pointer"
              checked={prefs.emailMessages} 
              onChange={() => setPrefs({...prefs, emailMessages: !prefs.emailMessages})}
            />
          </div>
        </div>

        {/* SMS Section */}
        <div className="notification-group pt-8 border-t border-slate-50">
          <div className="flex items-center gap-2 mb-6">
            <MobileIcon className="text-indigo-600" />
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mobile Push</h4>
          </div>
          
          <div className="toggle-item flex justify-between items-center p-4 border border-slate-100 rounded-3xl opacity-60">
            <div>
              <h5 className="text-sm font-black text-slate-400">SMS Notifications</h5>
              <p className="text-xs text-slate-400 font-bold mt-1">Standard rates apply. Available for Premium Employers.</p>
            </div>
            <div className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500">LOCKED</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;