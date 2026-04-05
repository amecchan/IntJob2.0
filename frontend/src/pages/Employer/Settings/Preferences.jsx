// src/pages/Employer/settings/Preferences.jsx
import React, { useState } from 'react';
import { GearIcon, CheckCircledIcon, UpdateIcon, GlobeIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';

const Preferences = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState('light');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1200);
  };

  return (
    <div className="glass-card settings-content-card p-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-50">
        <h3 className="settings-section-title">System Preferences</h3>
        <button onClick={handleSave} className="save-btn-settings" disabled={isSaving}>
          {isSaving ? <UpdateIcon className="animate-spin" /> : <CheckCircledIcon />}
          {isSaving ? "Update System" : "Save Changes"}
        </button>
      </div>

      <div className="settings-form-grid">
        {/* Localization */}
        <div className="input-group">
          <label>Preferred Language</label>
          <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 outline-none">
            <option>English (US)</option>
            <option>English (UK)</option>
            <option>Filipino</option>
          </select>
        </div>

        <div className="input-group">
          <label>Timezone</label>
          <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 outline-none">
            <option>(GMT+08:00) Manila</option>
            <option>(GMT+00:00) UTC</option>
            <option>(GMT-08:00) Pacific Time</option>
          </select>
        </div>

        {/* Theme Selection */}
        <div className="input-group full-width mt-4">
          <label className="mb-4">Dashboard Theme</label>
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => setTheme('light')}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 ${theme === 'light' ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 bg-white'}`}
            >
              <div className="w-10 h-10 rounded-3xl bg-white border border-slate-200 flex items-center justify-center text-orange-400">
                <SunIcon />
              </div>
              <div>
                <p className="text-sm font-black text-slate-700">Light Mode</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">System Default</p>
              </div>
            </div>

            <div 
              onClick={() => setTheme('dark')}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex items-center gap-4 ${theme === 'dark' ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 bg-white'}`}
            >
              <div className="w-10 h-10 rounded-3xl bg-slate-900 flex items-center justify-center text-indigo-400">
                <MoonIcon />
              </div>
              <div>
                <p className="text-sm font-black text-slate-700">Dark Mode</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Available Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;