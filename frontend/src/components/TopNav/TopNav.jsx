import React from 'react';
import { MagnifyingGlassIcon, BellIcon } from '@radix-ui/react-icons';
import '../../styles/topnav.css';

const TopNav = () => {
  return (
    <header className="topnav-container">
      {/* Search Bar */}
      <div className="topnav-search-wrapper">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search for candidates..." 
          className="search-input"
        />
      </div>
      
      {/* Action Icons */}
      <div className="flex items-center gap-4">
        <button className="notification-btn">
          <BellIcon className="w-5 h-5" />
          <span className="notification-badge"></span>
        </button>
        
        {/* Optional: Add a small help icon or Divider */}
        <div className="h-8 w-[1px] bg-white/20 mx-2"></div>
        
        <div className="hidden md:block">
          <p className="text-[10px] font-black text-white/60 uppercase tracking-widest text-right leading-tight">
            System Status
          </p>
          <p className="text-[11px] font-bold text-green-400 text-right">Online</p>
        </div>
      </div>
    </header>
  );
};

export default TopNav;