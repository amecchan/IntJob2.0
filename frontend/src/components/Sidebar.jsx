import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/sidebar.css'; 
import { 
  HomeIcon, 
  BackpackIcon, 
  FileTextIcon, 
  PersonIcon,
  EnvelopeClosedIcon,
  GearIcon,
  ExitIcon,
  ComponentInstanceIcon // Using this for Company Profile
} from '@radix-ui/react-icons';

const Sidebar = () => {
  const { user, logout, getInitials } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const menuItems = [
    { label: 'Dashboard', icon: <HomeIcon />, path: '/employer/dashboard' },
    { label: 'View Applicants', icon: <BackpackIcon />, path: '/employer/dashboard/view-applicants' },
    { label: 'Job Posts', icon: <FileTextIcon />, path: '/employer/dashboard/jobs' },
    { label: 'Applicants', icon: <PersonIcon />, path: '/employer/dashboard/candidates' },
    { label: 'Messages', icon: <EnvelopeClosedIcon />, path: '/employer/dashboard/messages' },
    { label: 'Company Profile', icon: <ComponentInstanceIcon />, path: '/employer/dashboard/profile' },
    { label: 'Settings', icon: <GearIcon />, path: '/employer/dashboard/settings' },
  ];

  // Helper to check if a link is active, including dynamic sub-routes
  const isActive = (path) => {
  if (path === '/dashboard') {
    // Only highlight Dashboard if the URL is EXACTLY /dashboard
    return location.pathname === '/dashboard';
  }
  // For others like /dashboard/jobs, highlight if it starts with that path
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="sidebar-container">
      <div className="sidebar-logo">
        Int<span>Job</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`sidebar-link ${isActive(item.path) ? 'sidebar-link-active' : ''}`}
          >
            {React.cloneElement(item.icon, { className: "w-4 h-4" })}
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
        
        <div className="sidebar-divider" />

        <button onClick={logout} className="sidebar-link text-red-400 hover:bg-red-50/10 hover:text-red-400 mt-auto">
          <ExitIcon className="w-4 h-4" />
          <span className="sidebar-label">Logout</span>
        </button>
      </nav>

      {/* User Card */}
      <div className="sidebar-user-card">
        <div className="user-avatar-mini">
          {getInitials(user.name || "User")}
        </div>
        <div className="flex-1 min-w-0">
          <p className="user-name-text">{user.name}</p>
          <p className="user-role-text">{user.role}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;