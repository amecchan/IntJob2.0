import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GearIcon, 
  LockClosedIcon, 
  BellIcon, 
  PersonIcon, 
  ChevronRightIcon 
} from '@radix-ui/react-icons';
import "../../styles/Applicant/Setting.css";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="settings-view-wrapper">
      <header className="settings-header">
        <h2><GearIcon width="25" height="25" /> Settings</h2>
      </header>

      <div className="settings-grid">
        {/* Account Settings Card */}
        <div className="settings-card clickable" onClick={() => navigate("/settings/account")}>
          <div className="card-top">
            <div className="card-icon-title">
              <PersonIcon color="#266CA9" width="22" height="22" />
              <h3>Account Settings</h3>
            </div>
            <p>Update your name, email, and profile information.</p>
          </div>
          
          <button className="settings-view-btn">
            View <ChevronRightIcon />
          </button>
        </div>

        {/* Notifications Card */}
        <div className="settings-card">
          <div className="card-top">
            <div className="card-icon-title">
              <BellIcon color="#266CA9" width="22" height="22" />
              <h3>Notifications</h3>
            </div>
            <p>Manage your email alerts and push notifications.</p>
          </div>
          <button className="settings-view-btn">View <ChevronRightIcon /></button>
        </div>

        {/* Privacy Card */}
        <div className="settings-card">
          <div className="card-top">
            <div className="card-icon-title">
              <LockClosedIcon color="#266CA9" width="22" height="22" />
              <h3>Privacy</h3>
            </div>
            <p>Control who sees your profile and resume data.</p>
          </div>
          <button className="settings-view-btn">View <ChevronRightIcon /></button>
        </div>
      </div>
    </div>
  );
};

export default Settings;