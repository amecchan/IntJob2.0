import React from 'react';
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
  ChevronRightIcon
} from '@radix-ui/react-icons';

const Sidebar = () => {
  const { user, logout, getInitials } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  /**
   * Updated Name Logic:
   * Firebase stores the name in user.displayName after updateProfile() is called.
   * We fallback to user.name (from Firestore/Context) or "Employer User".
   */
  const displayName = user.displayName || user.name || "Employer User";

  return (
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
        <button onClick={logout} className="nav-btn logout-btn group">
          <span className="nav-icon group-hover:text-red-500 transition-colors">
            <ExitIcon />
          </span>
          <span className="nav-text group-hover:text-red-600 transition-colors">Sign Out</span>
        </button>
      </nav>

      {/* User Card - Bottom Left */}
      <div className="sidebar-footer">
        <div className="user-profile-widget">
          <div className="user-avatar-circle">
             {/* If getInitials exists, use it; otherwise uppercase the first letter */}
             {getInitials ? getInitials(displayName) : displayName.charAt(0).toUpperCase()}
          </div>
          <div className="user-meta">
            <p className="user-full-name" title={displayName}>
              {displayName}
            </p>
            <p className="user-role-badge">
              {/* Capitalizes the first letter of the role (e.g., 'employer' -> 'Employer') */}
              {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Employer'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;