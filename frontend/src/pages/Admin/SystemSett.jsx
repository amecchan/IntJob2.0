import React, { useState } from 'react';
import { 
  Settings, SlidersHorizontal, Bell, Database, 
  UserCog, Save, Download, Upload, ShieldAlert,
  CheckCircle, AlertTriangle, ShieldCheck, X
} from 'lucide-react';
import '../../styles/Admin/AdminDash.css'; // I-import ang shared Admin styles
import '../../styles/Admin/SystemSett.css'; // I-import ang bagong CSS

const SystemSett = () => {
  const [activeTab, setActiveTab] = useState('system-config');

  const SectionHeader = ({ icon: Icon, title }) => (
    <h2 className="settings-section-header">
      <Icon size={24} className="header-icon-blue" /> {title}
    </h2>
  );

  const tabs = [
    { id: 'system-config', label: 'System Config', icon: SlidersHorizontal },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck },
    { id: 'backup', label: 'Backup', icon: Database },
    { id: 'admin-accounts', label: 'Admin Accounts', icon: UserCog },
    { id: 'security', label: 'Security', icon: ShieldAlert },
  ];

  return (
    <>
      <header className="settings-main-header">
        <h1>
          <Settings size={32} className="header-icon-blue" /> System Settings
        </h1>
      </header>

      {/* TAB NAVIGATION */}
      <div className="settings-tab-bar">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)} 
            className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            <tab.icon size={18} /> <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SECTIONS AREA */}
      <div className="settings-card">
        
        {activeTab === 'system-config' && (
          <section className="settings-tab-content fade-in">
            <SectionHeader icon={SlidersHorizontal} title="General System Settings" />
            <div className="settings-form-group">
              <label>System Name</label>
              <input type="text" defaultValue="INTJOB Admin System" className="settings-input" />
              
              <label>System Email</label>
              <input type="email" defaultValue="admin@intjob.com" className="settings-input" />

              <div className="settings-grid-row">
                <div className="settings-field">
                  <label>Time Zone</label>
                  <select className="settings-input">
                    <option>UTC +8:00 (Manila)</option>
                    <option>UTC +0:00 (GMT)</option>
                  </select>
                </div>
                <div className="settings-field">
                  <label>Default Language</label>
                  <select className="settings-input">
                    <option>English</option>
                    <option>Filipino</option>
                  </select>
                </div>
              </div>

              <h3 className="settings-sub-header">Job Posting Settings</h3>
              <label>Max Job Post Duration (days)</label>
              <input type="number" defaultValue="60" className="settings-input" />
              
              <div className="settings-toggle-box">
                <label>Require Admin Approval for Posts</label>
                <input type="checkbox" defaultChecked className="settings-checkbox" />
              </div>

              <div className="settings-footer">
                <button className="btn-save" onClick={() => alert('Settings Saved!')}>
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'notifications' && (
          <section className="settings-tab-content fade-in">
            <SectionHeader icon={Bell} title="Notification Settings" />
            <div className="settings-field">
                <label>Email Notifications</label>
                <select className="settings-input"><option>Enabled</option><option>Disabled</option></select>
            </div>
            <div className="settings-field">
                <label>SMS Alerts</label>
                <select className="settings-input"><option>Enabled</option><option>Disabled</option></select>
            </div>
            <div className="settings-footer">
                <button className="btn-save">Save Notifications</button>
            </div>
          </section>
        )}

        {activeTab === 'roles' && (
          <section className="settings-tab-content fade-in">
            <SectionHeader icon={ShieldCheck} title="Roles & Permissions" />
            <div className="settings-table-wrapper">
                <table className="settings-table">
                  <thead>
                    <tr><th>Role</th><th>Description</th><th>Access</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Super Admin</td><td>Full Access</td><td>100%</td><td><button className="btn-table-edit">Edit</button></td></tr>
                    <tr><td>Moderator</td><td>Manage Users</td><td>60%</td><td><button className="btn-table-edit">Edit</button></td></tr>
                  </tbody>
                </table>
            </div>
          </section>
        )}

        {activeTab === 'backup' && (
          <section className="settings-tab-content backup-section fade-in">
            <SectionHeader icon={Database} title="Backup & Restore" />
            <div className="backup-status">
                <p>Last backup: 2 hours ago</p>
                <div className="backup-actions">
                  <button className="btn-save"><Download size={16} /> Backup Now</button>
                  <button className="btn-danger"><Upload size={16} /> Restore Backup</button>
                </div>
            </div>
          </section>
        )}

        {activeTab === 'admin-accounts' && (
          <section className="settings-tab-content fade-in">
            <SectionHeader icon={UserCog} title="Admin User Management" />
            <div className="settings-table-wrapper">
                <table className="settings-table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Michael Cruz</strong></td>
                      <td>michael@admin.com</td>
                      <td>Super Admin</td>
                      <td><span className="status-online">Active</span></td>
                      <td><button className="btn-table-deactivate">Deactivate</button></td>
                    </tr>
                  </tbody>
                </table>
            </div>
          </section>
        )}

        {activeTab === 'security' && (
          <section className="settings-tab-content fade-in">
            <SectionHeader icon={ShieldAlert} title="Security & Monitoring" />
            <div className="settings-field">
                <label>Enable Two-Factor Authentication</label>
                <select className="settings-input"><option>Enabled</option><option>Disabled</option></select>
            </div>
            
            <h3 className="settings-sub-header">Live Status</h3>
            <div className="settings-table-wrapper">
                <table className="settings-table no-head">
                  <tbody>
                    <tr>
                      <td>Firewall Status</td>
                      <td><span className="status-online flex-gap"><CheckCircle size={14} /> Active</span></td>
                    </tr>
                    <tr>
                      <td>Suspicious Activity</td>
                      <td><span className="status-warning flex-gap"><AlertTriangle size={14} /> Review Needed</span></td>
                    </tr>
                  </tbody>
                </table>
            </div>
            <div className="settings-footer">
                <button className="btn-save">Apply Security Policy</button>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default SystemSett;