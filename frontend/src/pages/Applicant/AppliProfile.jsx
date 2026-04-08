import React, { useState, useEffect } from 'react';
import { auth } from "../../services/firebase"; 
import { 
  PersonIcon, 
  FileTextIcon, 
  BackpackIcon, 
  RocketIcon, 
  IdCardIcon,
  CameraIcon 
} from '@radix-ui/react-icons';
import "../../styles/Applicant/AppliProfile.css";

const AppliProfile = () => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      // Kung may Google photo, gamitin. Kung wala, null muna.
      if (currentUser.photoURL) {
        setProfilePic(currentUser.photoURL);
      }
    }
  }, []);

  // --- LOGIC PARA SA INITIALS ---
  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      // Kunin ang first letter ng unang dalawang salita (e.g., "John Doe" -> "JD")
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase(); // Isang letra lang kung isang salita lang ang name
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-view-wrapper">
      <header className="profile-header-card">
        <div className="title-group">
          <h1><PersonIcon width="30" height="30" /> Profile</h1>
          <p className="user-name">{user?.displayName || "Guest User"}</p>
          <p className="user-location">Municipality, Province, Country</p>
        </div>
        
        <div className="profile-avatar-large">
          <label htmlFor="avatar-upload" className="avatar-label">
            <div className="avatar-circle">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="user-photo" />
              ) : (
                /* DITO LALABAS ANG INITIALS */
                <span className="initials-text">
                  {getInitials(user?.displayName || "John Doe")}
                </span>
              )}
              
              <div className="camera-overlay">
                <CameraIcon width="18" height="18" />
              </div>
            </div>
          </label>
          <input 
            id="avatar-upload" 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }} 
            onChange={handleImageUpload}
          />
        </div>
      </header>

      {/* Profile Sections Grid (same as before) */}
      <div className="profile-sections-grid">
        <section className="profile-card">
          <div className="card-title"><FileTextIcon /> <h2>Personal Summary</h2></div>
          <p>Add a personal summary to your profile as a way to introduce yourself.</p>
          <button className="profile-add-btn">Add Summary</button>
        </section>

        <section className="profile-card">
          <div className="card-title"><RocketIcon /> <h2>Career History</h2></div>
          <p>Highlight your experience to employers.</p>
          <button className="profile-add-btn">Add Role</button>
        </section>

        <section className="profile-card">
          <div className="card-title"><BackpackIcon /> <h2>Education</h2></div>
          <p>Tell employers about your education.</p>
          <button className="profile-add-btn">Add Education</button>
        </section>

        <section className="profile-card">
          <div className="card-title"><IdCardIcon /> <h2>Licenses</h2></div>
          <p>Show your licenses to prove yourself.</p>
          <button className="profile-add-btn">Upload Licenses</button>
        </section>
      </div>
    </div>
  );
};

export default AppliProfile;