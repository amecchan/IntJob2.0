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

  // Improved isActive to handle dynamic sub-routes
  // This ensures the "View Applicants" tab stays active when viewing a specific profile
  const isTabActive = (path) => {
    if (path === '/employer/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { 
      label: 'Dashboard', 
      icon: <DashboardIcon />, 
      path: '/employer/dashboard' 
    },
    { 
      label: 'View Applicants', 
      icon: <EyeOpenIcon />, 
      path: '/employer/dashboard/view-applicants' 
    },
    { 
      label: 'Job Posts', 
      icon: <FileTextIcon />, 
      path: '/employer/dashboard/jobs' 
    },
    { 
      label: 'Messages', 
      icon: <EnvelopeClosedIcon />, 
      path: '/employer/dashboard/messages' 
    },
    { 
      label: 'Company Profile', 
      icon: <ComponentInstanceIcon />, 
      path: '/employer/dashboard/profile' 
    },
    { 
      label: 'Settings', 
      icon: <GearIcon />, 
      path: '/employer/dashboard/settings' 
    },
  ];

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

      {/* User Card */}
      <div className="sidebar-footer">
        <div className="user-profile-widget">
          <div className="user-avatar-circle">
             {getInitials ? getInitials(user.name) : user.name?.charAt(0) || "E"}
          </div>
          <div className="user-meta">
            <p className="user-full-name">{user.name || "Employer User"}</p>
            <p className="user-role-badge">Premium {user.role || 'Employer'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;