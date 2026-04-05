// src/pages/Employer/settings/SettingsLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  PersonIcon, 
  LockClosedIcon, 
  BellIcon, 
  GearIcon 
} from '@radix-ui/react-icons';
import '../../../styles/SettingsLayout.css'; // We will use shared CSS

const SettingsLayout = () => {
  // Navigation mapping directly from your image
  const settingsNavItems = [
    { label: 'Profile Info', icon: <PersonIcon />, path: 'profile' },
    { label: 'Password & Security', icon: <LockClosedIcon />, path: 'security' },
    { label: 'Notifications', icon: <BellIcon />, path: 'notifications' },
    { label: 'Preferences', icon: <GearIcon />, path: 'preferences' },
  ];

  return (
    <div className="intjob-settings-masteranimate-in fade-in duration-700">
      
      {/* 1. Header Area */}
      <header className="settings-page-header">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Account Settings</h1>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Manage your personal preferences</p>
      </header>

      {/* 2. Grid Layout from your design */}
      <div className="settings-sub-grid mt-10">
        
        {/* The Sidebar you sent (Mapping based on the image) */}
        <aside className="settings-tab-nav">
          <div className="glass-card nav-card p-4">
            {settingsNavItems.map(item => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={({ isActive }) => `sub-nav-item ${isActive ? 'active' : ''}`}
                // end={item.path === 'profile'} // Use 'end' if ProfileInfo is the index route
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </aside>

        {/* This is where the actual ProfileInfo/Security content goes */}
        <main className="settings-outlet-area">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default SettingsLayout;