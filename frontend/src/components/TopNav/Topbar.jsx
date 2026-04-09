import React from "react";
import { MagnifyingGlassIcon, BellIcon } from '@radix-ui/react-icons';
import "../../styles/Applicant/Topbar.css";

const Topbar = ({ searchTerm, setSearchTerm, userData, setCurrentView }) => {
  
  // Handle the search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <header className="topbar">
      {/* Search Bar: Now direct child of topbar */}
      <div className="search-container">
        <MagnifyingGlassIcon className="search-icon" />
        <input 
          type="text" 
          placeholder="Search jobs by title or company..." 
          value={searchTerm} 
          onChange={handleSearchChange} 
        />
      </div>
      
      <div className="topbar-right">
        <div className="notification-wrapper">
          <BellIcon width="22" height="22" className="bell-icon" />
          <span className="notification-dot"></span>
        </div>
        
        <button className="user-profile-trigger" onClick={() => setCurrentView('profile')}>
          <div className="user-avatar-box">
            {/* Dynamic initial from Firebase userData */}
            {userData?.fullName ? userData.fullName.charAt(0).toUpperCase() : "F"}
          </div>
        </button>
      </div>
    </header>
  );
};

export default Topbar;