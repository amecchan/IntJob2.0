// src/pages/Employer/settings/PasswordSecurity.jsx
import React from 'react';
import { LockClosedIcon } from '@radix-ui/react-icons';

const PasswordSecurity = () => {
  return (
    <div className="glass-card settings-content-card p-10">
      <h3 className="settings-section-title mb-10">Update Password</h3>
      
      <div className="settings-form-grid">
        <div className="input-group full-width">
          <label>Current Password</label>
          <input type="password" placeholder="••••••••••••••" />
        </div>
        <div className="input-group">
          <label>New Password</label>
          <input type="password" />
        </div>
        <div className="input-group">
          <label>Confirm New Password</label>
          <input type="password" />
        </div>
      </div>
      <button className="save-btn-settings mt-8">Update Password</button>
    </div>
  );
};

export default PasswordSecurity;