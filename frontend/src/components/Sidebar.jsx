import React, { useState } from 'react'; // Added useState
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/sidebar.css'; 
import { 
  DashboardIcon, 
  EyeOpenIcon, 
  FileTextIcon, 
  EnvelopeClosedIcon,
  GearIcon,
  ExitIcon,
  ComponentInstanceIcon,
  ChevronRightIcon,
  QuestionMarkIcon // Added for the modal icon
} from '@radix-ui/react-icons';

const Sidebar = () => {
  const { user, logout, getInitials } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Modal state

  if (!user) return null;

  const isTabActive = (path) => {
    if (path === '/employer/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/employer/dashboard' },
    { label: 'View Applicants', icon: <EyeOpenIcon />, path: '/employer/dashboard/view-applicants' },
    { label: 'Job Management', icon: <FileTextIcon />, path: '/employer/dashboard/jobs' },
    { label: 'Messages', icon: <EnvelopeClosedIcon />, path: '/employer/dashboard/messages' },
    { label: 'Company Profile', icon: <ComponentInstanceIcon />, path: '/employer/dashboard/profile' },
    { label: 'Settings', icon: <GearIcon />, path: '/employer/dashboard/settings' },
  ];

  const displayName = user.displayName || user.name || "Employer User";

  return (
    <>
      <aside className="sidebar-container">
        {/* Brand Section */}
        <div className="sidebar-brand">
          <div className="brand-logo-square">
            <div className="logo-inner-dot" />
          </div>
          <h1 className="brand-title">Int<span>Job</span></h1>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="nav-group-label">Recruitment System</div>
          
          <div className="nav-items-stack">
            {menuItems.map((item) => {
              const active = isTabActive(item.path);
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`nav-btn ${active ? 'nav-btn-active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                  {active && (
                    <>
                      <div className="active-glow" />
                      <ChevronRightIcon className="ml-auto w-3 h-3 opacity-50" />
                    </>
                  )}
                </button>
              );
            })}
          </div>

          <div className="nav-divider" />

          <div className="nav-group-label">Account</div>
          {/* Changed logout call to open modal instead */}
          <button onClick={() => setShowLogoutModal(true)} className="nav-btn logout-btn group">
            <span className="nav-icon group-hover:text-red-500 transition-colors">
              <ExitIcon />
            </span>
            <span className="nav-text group-hover:text-red-600 transition-colors">Sign Out</span>
          </button>
        </nav>

        {/* User Card */}
        <div className="sidebar-footer">
          <div className="user-profile-widget">
            <div className="user-avatar-circle">
               {getInitials ? getInitials(displayName) : displayName.charAt(0).toUpperCase()}
            </div>
            <div className="user-meta">
              <p className="user-full-name" title={displayName}>
                {displayName}
              </p>
              <p className="user-role-badge">
                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Employer'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal-card animate-in zoom-in duration-200">
            <div className="logout-modal-icon">
              <QuestionMarkIcon className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="logout-modal-title">Confirm Logout</h3>
            <p className="logout-modal-text">Are you sure you want to end your session? You will need to login again to manage your job posts.</p>
            
            <div className="logout-modal-actions">
              <button 
                onClick={() => setShowLogoutModal(false)} 
                className="modal-btn-cancel"
              >
                Go Back
              </button>
              <button 
                onClick={logout} 
                className="modal-btn-confirm"
              >
                Sign Me Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;