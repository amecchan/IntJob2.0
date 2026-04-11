import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../services/firebase"; 
import { 
  doc, getDoc, collection, query, where, 
  onSnapshot, orderBy, updateDoc, writeBatch 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { 
  HamburgerMenuIcon, MagnifyingGlassIcon, BellIcon, HomeIcon, 
  LayersIcon, GearIcon, ExitIcon, EnvelopeClosedIcon, 
  CheckIcon, PersonIcon, FileTextIcon, BackpackIcon,
  DotFilledIcon, CheckCircledIcon,
} from '@radix-ui/react-icons';

// Page View Imports
import JobCategories from "./JobCategories";
import Inbox from "./Inbox"; 
import AppliStatus from "./AppliStatus"; 
import AppliResume from "./AppliResume";
import AppliProfile from "./AppliProfile"; 
import Settings from "./Setting";

// Local Styles & Assets
import "../../styles/Applicant/AppliDash.css"; 
import logoImg from "../../assets/logo.jpg";

const ApplicationDashboard = () => {
  // UI State
  const [currentView, setCurrentView] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Data State
  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState(""); // Dynamic Name State
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const notifRef = useRef(null);

  // For Job and Insights and Recommendations"
  const [recommendedJobs, setRecommendedJobs] = useState([]);
const [appStats, setAppStats] = useState({ total: 0, pending: 0, accepted: 0 });
const [insights, setInsights] = useState({ matchRate: 0, message: "" });

useEffect(() => {
  let unsubNotifs = null;
  let unsubJobs = null;
  let unsubApps = null;

  const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);
        const nameParts = data.fullName ? data.fullName.trim().split(" ") : ["Guest"];
        setFirstName(nameParts[0]);

        // 1. Listen for Recommended Jobs (Real-time)
        const jobsQuery = query(collection(db, "jobs"), where("status", "==", "open"));
        unsubJobs = onSnapshot(jobsQuery, (snapshot) => {
          const allJobs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          const userSkills = data.selectedSkills || [];
          
          const matches = allJobs.filter(job => 
            job.skillsRequired?.some(s => userSkills.includes(s))
          );
          setRecommendedJobs(matches.slice(0, 3));

          // 2. Generate Insights based on Survey/Profile
          const rate = matches.length > 0 ? Math.min(matches.length * 20, 100) : 0;
          setInsights({
            matchRate: rate,
            message: rate > 50 ? "Your profile is highly competitive!" : "Consider adding more skills to improve matches."
          });
        });

        // 3. Listen for Application Progress
        const appsQuery = query(collection(db, "applications"), where("userId", "==", user.uid));
        unsubApps = onSnapshot(appsQuery, (snapshot) => {
          const apps = snapshot.docs.map(d => d.data());
          setAppStats({
            total: apps.length,
            pending: apps.filter(a => a.status === "pending").length,
            accepted: apps.filter(a => a.status === "accepted").length
          });
        });

        // 4. Notifications (Existing logic)
        const qNotif = query(collection(db, "notifications"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
        unsubNotifs = onSnapshot(qNotif, (snapshot) => {
          const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setNotifications(notifs);
          setHasUnread(notifs.some(n => !n.read));
        });
      }
      setLoading(false);
    } else {
      navigate("/");
    }
  });

  return () => {
    unsubscribeAuth();
    if (unsubNotifs) unsubNotifs();
    if (unsubJobs) unsubJobs();
    if (unsubApps) unsubApps();
  };
}, [navigate]);

  // 1. Firebase Auth & Real-time Data
  useEffect(() => {
    let unsubscribeNotifications = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Listen to User Profile changes in real-time
          const userDocRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDocRef);
          
          if (userSnap.exists()) {
            const data = userSnap.data();
            
            if (data.role?.toLowerCase() === "applicant") {
              setUserData(data);
              
              // Safely extract the first name
              const nameParts = data.fullName ? data.fullName.trim().split(" ") : ["Guest"];
              setFirstName(nameParts[0]);

              // 2. Real-time Notifications
              const q = query(
                collection(db, "notifications"),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc")
              );

              unsubscribeNotifications = onSnapshot(q, (snapshot) => {
                const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setNotifications(notifs);
                setHasUnread(notifs.some(n => n.read === false));
              });

            } else {
              navigate("/"); // Wrong role
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/"); // No user
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeNotifications) unsubscribeNotifications();
    };
  }, [navigate]);

  // Click-away listener for notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    const unreadNotifs = notifications.filter(n => !n.read);
    if (unreadNotifs.length === 0) return;

    const batch = writeBatch(db);
    unreadNotifs.forEach((n) => {
      const ref = doc(db, "notifications", n.id);
      batch.update(ref, { read: true });
    });
    await batch.commit();
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      auth.signOut();
      navigate("/");
    }
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Loading your dashboard...</p>
    </div>
  );

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className={`app-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="brand-section">
          <div className="brand-logo">
            <img src={logoImg} alt="IntJob Logo" />
          </div>
          {!isCollapsed && <span className="brand-name">IntJob</span>}
        </div>

        <nav className="sidebar-nav">
          <NavItem icon={<HomeIcon />} label="Dashboard" active={currentView === 'home'} onClick={() => setCurrentView('home')} collapsed={isCollapsed} />
          <NavItem icon={<LayersIcon />} label="Browse Jobs" active={currentView === 'categories'} onClick={() => setCurrentView('categories')} collapsed={isCollapsed} />
          <NavItem icon={<EnvelopeClosedIcon />} label="Messages" active={currentView === 'inbox'} onClick={() => setCurrentView('inbox')} collapsed={isCollapsed} />
          <NavItem icon={<CheckIcon />} label="Applications" active={currentView === 'status'} onClick={() => setCurrentView('status')} collapsed={isCollapsed} />
          <NavItem icon={<FileTextIcon />} label="Documents" active={currentView === 'resume'} onClick={() => setCurrentView('resume')} collapsed={isCollapsed} />
        </nav>

        <div className="sidebar-bottom">
          <NavItem icon={<GearIcon />} label="Settings" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} collapsed={isCollapsed} />
          <NavItem icon={<PersonIcon />} label="Profile" active={currentView === 'profile'} onClick={() => setCurrentView('profile')} collapsed={isCollapsed} />
          <button className="logout-action" onClick={handleLogout}>
            <ExitIcon /> {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main UI Area */}
      <main className="app-main">
        <header className="app-header">
          <div className="header-left">
            <button className="icon-btn toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
              <HamburgerMenuIcon />
            </button>
            <div className="header-search">
              <MagnifyingGlassIcon />
              <input 
                type="text" 
                placeholder="Search jobs, companies..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="header-right">
            {/* Notification Bell */}
            <div className="notif-container" ref={notifRef}>
              <button 
                className={`icon-btn notification-btn ${showNotifications ? 'active' : ''}`}
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications && hasUnread) markAllAsRead();
                }}
              >
                <BellIcon />
                {hasUnread && <span className="dot"></span>}
              </button>

              {showNotifications && (
                <div className="notif-dropdown">
                  <div className="notif-header">
                    <span>Notifications</span>
                    {hasUnread && <button onClick={markAllAsRead}>Mark all read</button>}
                  </div>
                  <div className="notif-list">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                          <div className="notif-content">
                            <p className="notif-title">{n.title}</p>
                            <p className="notif-msg">{n.message}</p>
                            <span className="notif-time">
                                {n.createdAt?.toDate().toLocaleDateString()}
                            </span>
                          </div>
                          {!n.read && <DotFilledIcon className="unread-dot" />}
                        </div>
                      ))
                    ) : (
                      <div className="notif-empty">No new notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="user-pill" onClick={() => setCurrentView('profile')}>
              <div className="pill-avatar">
                {firstName?.charAt(0) || "U"}
              </div>
              <div className="pill-info">
                <span className="pill-name">{firstName}</span>
                <span className="pill-role">Applicant</span>
              </div>
            </div>
          </div>
        </header>

        <div className="app-content">
          {(() => {
            switch(currentView) {
              case "categories": return <JobCategories searchTerm={searchTerm} userSkills={userData?.selectedSkills} onSwitchView={setCurrentView} />;
              case "inbox":      return <Inbox />;
              case "status":     return <AppliStatus />;
              case "resume":     return <AppliResume />;
              case "profile":    return <AppliProfile userData={userData} />;
              case "settings":   return <Settings />;
              default:
                return (
                  <div className="dashboard-home">
                  <header className="home-hero">
                    <h1>Welcome back, {firstName}</h1>
                    <p>Here’s what’s happening with your career search today.</p>
                  </header>

                    <section className="info-grid">
                      {/* 1. PROGRESS CARD */}
                      <div className="card stat-card progress-card-blue"> {/* Changed class name here */}
                        <h3>Application Progress</h3>
                        <div className="progress-stats">
                          <div className="stat-item">
                            <span className="stat-num">{appStats.total}</span>
                            <span className="stat-label">Total</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-num pending">{appStats.pending}</span>
                            <span className="stat-label">Pending</span>
                          </div>
                        </div>
                      </div>

                      {/* 3. SKILLS CARD */}
                        <div className="card stat-card featured-card">
                          <h3>Registered Skills</h3>
                          <div className="skill-tags">
                            {userData?.selectedSkills?.map(skill => (
                              <span key={skill} className="skill-pill">{skill}</span>
                            ))}
                          </div>
                        </div>
                    </section>
                    
                    <h2 className="section-heading">Recommended for You</h2>
                      <div className="jobs-layout-grid">
                        {recommendedJobs.length > 0 ? (
                          recommendedJobs.map(job => (
                            <div key={job.id} className="card job-card">
                              <h4>{job.title}</h4>
                              <p>{job.companyName}</p>
                              <div className="job-tags">
                                {job.skillsRequired?.slice(0, 2).map(s => <span className="mini-tag" key={s}>{s}</span>)}
                              </div>
                              <button className="btn-view" onClick={() => setCurrentView('categories')}>View Job</button>
                            </div>
                          ))
                        ) : (
                          <div className="empty-state-card">
                            <BackpackIcon />
                            <p>No new matches. Try updating your skills!</p>
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

const NavItem = ({ icon, label, active, onClick, collapsed }) => (
  <button className={`nav-button ${active ? 'active' : ''}`} onClick={onClick}>
    {icon}
    {!collapsed && <span>{label}</span>}
  </button>
);

export default ApplicationDashboard;