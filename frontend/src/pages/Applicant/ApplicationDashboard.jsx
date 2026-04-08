import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebase"; 
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { 
  HamburgerMenuIcon, 
  MagnifyingGlassIcon, 
  BellIcon, 
  HomeIcon, 
  LayersIcon, 
  GearIcon, 
  ExitIcon,
  EnvelopeClosedIcon,
  CheckIcon,
  PersonIcon,
  FileTextIcon,
  BackpackIcon 
} from '@radix-ui/react-icons';

// Page Imports
import JobCategories from "./JobCategories";
import Inbox from "./Inbox"; 
import AppliStatus from "./AppliStatus"; 
import AppliResume from "./AppliResume";
import AppliProfile from "./AppliProfile"; 
import Settings from "./Setting";

// Styles and Assets
import "../../styles/Applicant/AppliDash.css"; 
import logoImg from "../../assets/logo.jpg";

// --- UNIVERSAL MOCK DATA (Matched to your Category Strings) ---
const MOCK_JOBS = [
  // TECHNOLOGY & CODING
  { id: 1, title: "Full Stack Developer", company: "Google", location: "BGC, Taguig", skills: ["Web Development", "Python", "Cloud Computing"], salary: "₱55k - ₱75k" },
  { id: 2, title: "AI Research Assistant", company: "Meta", location: "Remote", skills: ["AI/ML", "Data Science", "Python"], salary: "₱60k - ₱90k" },
  { id: 3, title: "Cybersecurity Analyst", company: "Globe Telecom", location: "Manila", skills: ["Cybersecurity", "Software Testing", "DevOps & Automation"], salary: "₱45k - ₱65k" },
  { id: 4, title: "Mobile App Developer", company: "Grab", location: "Makati", skills: ["Mobile Apps", "UI/UX Design", "Software Testing"], salary: "₱50k - ₱70k" },

  // ARTS & DESIGN
  { id: 5, title: "Lead Graphic Designer", company: "Canva", location: "Manila (Hybrid)", skills: ["Graphic Design", "Digital Arts", "Illustration"], salary: "₱40k - ₱55k" },
  { id: 6, title: "Motion Graphics Artist", company: "Ubisoft", location: "Laguna", skills: ["Motion Graphics", "Video Editing", "3D Modeling"], salary: "₱35k - ₱50k" },
  { id: 7, title: "Gallery Curator", company: "National Museum", location: "Manila", skills: ["Traditional Painting", "Drawing & Illustration", "Photography"], salary: "₱25k - ₱35k" },

  // BUSINESS & FINANCE
  { id: 8, title: "Audit Associate", company: "SGV & Co.", location: "Makati", skills: ["Accounting", "Finance", "Investment & Banking"], salary: "₱28k - ₱40k" },
  { id: 9, title: "Digital Marketing Lead", company: "Shopee", location: "BGC", skills: ["Digital Marketing", "Marketing", "Sales"], salary: "₱45k - ₱60k" },
  { id: 10, title: "Junior HR Manager", company: "Jollibee Corp.", location: "Pasig", skills: ["HR Management", "Project Management", "Leadership"], salary: "₱30k - ₱45k" },

  // HUMANITIES & SOCIAL
  { id: 11, title: "Public Relations Officer", company: "ABS-CBN", location: "Quezon City", skills: ["Public Relations", "Journalism", "Content Writing"], salary: "₱30k - ₱42k" },
  { id: 12, title: "Corporate Psychologist", company: "Unilever", location: "Manila", skills: ["Psychology", "Sociology", "Emotional Intelligence"], salary: "₱40k - ₱55k" },

  // HEALTH & SCIENCE
  { id: 13, title: "Registered Nurse", company: "St. Luke's Medical", location: "BGC", skills: ["Nursing", "Public Health", "Critical Thinking"], salary: "₱35k - ₱48k" },
  { id: 14, title: "Medical Researcher", company: "RITM", location: "Muntinlupa", skills: ["Medical Research", "Biology", "Bioinformatics"], salary: "₱32k - ₱45k" },
  { id: 15, title: "Pharmacy Consultant", company: "Mercury Drug", location: "Quezon City", skills: ["Pharmacy", "Chemistry", "Nutrition"], salary: "₱25k - ₱35k" },

  // SOFT SKILLS (Catch-all for "Adaptability" or "Teamwork" focus)
  { id: 16, title: "Operations Supervisor", company: "SM Prime", location: "Pasay", skills: ["Leadership", "Adaptability", "Teamwork"], salary: "₱35k - ₱50k" },
  { id: 17, title: "Customer Success Lead", company: "Zendesk", location: "BGC", skills: ["Negotiation", "Public Speaking", "Time Management"], salary: "₱40k - ₱55k" },
  { id: 18, title: "Product Strategist", company: "GCash", location: "Taguig", skills: ["Critical Thinking", "Entrepreneurship", "Project Management"], salary: "₱50k - ₱75k" }
];

const ApplicationDashboard = () => {
  const [currentView, setCurrentView] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          
          // CRITICAL: Double-check that this user is actually an applicant
          // This prevents an employer from manually typing /applicant/dashboard
          if (data.role?.toLowerCase() === "applicant") {
            setUserData(data);
          } else {
            console.error("Unauthorized: User role is not applicant");
            navigate("/"); 
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      // No authenticated user found, redirect to landing
      navigate("/");
    }
  });
  return () => unsubscribe();
}, [navigate]);

  // The Matching Logic: Every skill from your categories list is represented in MOCK_JOBS
  const getRecommendedJobs = () => {
    if (!userData?.selectedSkills) return [];
    return MOCK_JOBS.filter(job => 
      job.skills.some(skill => userData.selectedSkills.includes(skill))
    );
  };

  const recommendedJobs = getRecommendedJobs();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      auth.signOut();
      navigate("/");
    }
  };

  if (loading) return <div className="loading-screen">Loading IntJob...</div>;

  return (
    <div className="dashboard-wrapper">
      <aside className={`sidebar ${isCollapsed ? 'is-collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-group">
            <div className="logo-placeholder" style={{ width: '40px', height: '40px', overflow: 'hidden', flexShrink: 0 }}>
              <img src={logoImg} alt="IntJob Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
            </div>
            {!isCollapsed && <span className="logo-name" style={{ marginLeft: '10px', fontWeight: 'bold' }}>IntJob</span>}
          </div>
          <button className="sidebar-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
            <HamburgerMenuIcon />
          </button>
        </div>

        <ul className="nav-list">
          <li><button className={`sidebar-link ${currentView === 'home' ? 'active' : ''}`} onClick={() => setCurrentView('home')}><HomeIcon /> {!isCollapsed && <span>Home page</span>}</button></li>
          <li><button className={`sidebar-link ${currentView === 'categories' ? 'active' : ''}`} onClick={() => setCurrentView('categories')}><LayersIcon /> {!isCollapsed && <span>Job categories</span>}</button></li>
          <li><button className={`sidebar-link ${currentView === 'inbox' ? 'active' : ''}`} onClick={() => setCurrentView('inbox')}><EnvelopeClosedIcon /> {!isCollapsed && <span>Inbox</span>}</button></li>
          <li><button className={`sidebar-link ${currentView === 'status' ? 'active' : ''}`} onClick={() => setCurrentView('status')}><CheckIcon /> {!isCollapsed && <span>Applied status</span>}</button></li>
          <li><button className={`sidebar-link ${currentView === 'resume' ? 'active' : ''}`} onClick={() => setCurrentView('resume')}><FileTextIcon /> {!isCollapsed && <span>Resume</span>}</button></li>
        </ul>

        <div className="sidebar-footer">
          <button className={`footer-item ${currentView === 'settings' ? 'active' : ''}`} onClick={() => setCurrentView('settings')}><GearIcon /> {!isCollapsed && <span>Settings</span>}</button>
          <button className={`footer-item ${currentView === 'profile' ? 'active' : ''}`} onClick={() => setCurrentView('profile')}><PersonIcon /> {!isCollapsed && <span>Profile</span>}</button>
          <button className="footer-item logout" onClick={handleLogout}><ExitIcon /> {!isCollapsed && <span>Logout</span>}</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="search-container">
            <MagnifyingGlassIcon color="#4cd2f3" />
            <input type="text" placeholder="Search jobs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="topbar-right">
            <BellIcon width="24" height="24" className="notification-icon" />
            <button className="user-avatar-wrapper" onClick={() => setCurrentView('profile')}>
              <div className="user-avatar">{userData?.fullName?.charAt(0).toUpperCase() || "U"}</div>
            </button>
          </div>
        </header>

        <div className="view-container">
          {(() => {
            switch(currentView) {
              case "categories": return <JobCategories searchTerm={searchTerm} userSkills={userData?.selectedSkills} />;
              case "inbox":      return <Inbox />;
              case "status":     return <AppliStatus />;
              case "resume":     return <AppliResume />;
              case "profile":    return <AppliProfile userData={userData} />;
              case "settings":   return <Settings />;
              default:
                return (
                  <div className="home-view fade-in">
                    <div className="welcome-header">
                        <h2 style={{ fontSize: "28px", color: "#0F2573", marginBottom: "4px" }}>
                            {getGreeting()}, {userData?.fullName?.split(" ")[0] || "User"}!
                        </h2>
                        <p style={{ color: "#64748b", fontSize: "14px", fontWeight: "500", marginBottom: "30px" }}>Job Seeker</p>
                    </div>

                    <div className="content-card" style={{ marginBottom: '30px', padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "#0F2573" }}>Your Expertise:</h3>
                      <div className="chip-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {userData?.selectedSkills?.length > 0 ? (
                           userData.selectedSkills.map(skill => (
                             <span key={skill} style={{ background: '#266CA9', color: '#fff', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                               {skill}
                             </span>
                           ))
                        ) : (
                           <p style={{color: '#94a3b8', fontSize: '14px'}}>Complete your survey to see matches.</p>
                        )}
                      </div>
                    </div>

                    <h3 style={{ fontSize: "18px", color: "#0F2573", marginBottom: "20px" }}>Jobs Recommended for You</h3>
                    
                    <div className="job-suggestions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                      {recommendedJobs.length > 0 ? (
                        recommendedJobs.map(job => (
                          <div key={job.id} className="job-section" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <div style={{ width: '45px', height: '45px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <BackpackIcon width="24" height="24" color="#266CA9" />
                                </div>
                                <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '20px', fontWeight: '700' }}>Skills Match</span>
                              </div>
                              <h4 style={{ fontSize: '17px', color: '#0F2573', marginBottom: '4px', fontWeight: 'bold' }}>{job.title}</h4>
                              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>{job.company} • {job.location}</p>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '15px' }}>
                                {job.skills.map(s => (
                                  <span key={s} style={{ 
                                    fontSize: '10px', padding: '2px 8px', borderRadius: '4px', 
                                    background: userData?.selectedSkills?.includes(s) ? '#dcfce7' : '#f1f5f9', 
                                    color: userData?.selectedSkills?.includes(s) ? '#166534' : '#94a3b8', 
                                    fontWeight: '600' 
                                  }}>#{s}</span>
                                ))}
                              </div>
                            </div>
                            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: '700', color: '#266CA9', fontSize: '14px' }}>{job.salary}</span>
                              <button style={{ padding: '8px 16px', fontSize: '12px', borderRadius: '8px', cursor: 'pointer', background: '#266CA9', color: '#fff', border: 'none' }}>Apply Now</button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                           <p style={{ color: '#94a3b8' }}>No direct matches. Try adding more skills in your profile survey!</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
            }
          })()}
        </div>
      </main>
    </div>
  );
};

export default ApplicationDashboard;