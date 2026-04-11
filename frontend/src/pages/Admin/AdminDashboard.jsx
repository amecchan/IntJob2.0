import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  doc, 
  updateDoc,
  where
} from 'firebase/firestore';
import { 
  LayoutDashboard, Users, FileText, Code, BarChart3, 
  CreditCard, MessageSquare, Settings, ShieldCheck, 
  Check, X, Search, Activity, LogOut, TrendingUp, Calendar, HeartPulse
} from 'lucide-react';

// --- PAGE IMPORTS ---
import UserManage from "./UserManage";
import AdReport from "./AdReport";
import AdSecurity from "./AdSecurity";
import AppliManage from "./AppliManage";
import ContentManage from "./ContentManage";
import FeedbackComp from "./FeedbackComp";
import PaySubManage from "./PaySubManage";
import SystemSett from "./SystemSett";

import '../../styles/Admin/AdminDash.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [jobStats, setJobStats] = useState({ total: 0, pending: 0 });
  const [reportCounts, setReportCounts] = useState({ daily: 0, weekly: 0, monthly: 0 });
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState("Checking...");

  useEffect(() => {
    // 1. Fetch Users & System Health Check
    const uQ = collection(db, "users");
    const unsubUsers = onSnapshot(uQ, (snapshot) => {
      const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedUsers = allUsers.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setUsers(sortedUsers);
      setLoading(false);
      setSystemStatus("Optimal"); // Connected to Firestore successfully
    }, (error) => {
      console.error("Firestore Error:", error);
      setSystemStatus("Degraded");
    });

    // 2. Fetch Job Posts Statistics
    const jQ = collection(db, "jobs");
    const unsubJobs = onSnapshot(jQ, (snapshot) => {
      const allJobs = snapshot.docs.map(doc => doc.data());
      setJobStats({
        total: allJobs.length,
        pending: allJobs.filter(j => (j.status || "").toLowerCase() === "pending").length
      });
    });

    // 3. Reports & Analytics (Daily, Weekly, Monthly)
    const now = new Date();
    const startOfDay = new Date(now.setHours(0,0,0,0));
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const rQ = collection(db, "reports");
    const unsubReports = onSnapshot(rQ, (snapshot) => {
      const allReports = snapshot.docs.map(doc => ({
          ...doc.data(),
          date: doc.data().createdAt?.toDate() || new Date()
      }));

      setReportCounts({
        daily: allReports.filter(r => r.date >= startOfDay).length,
        weekly: allReports.filter(r => r.date >= startOfWeek).length,
        monthly: allReports.filter(r => r.date >= startOfMonth).length
      });
    });

    // 4. Monthly Income (Example: from 'payments' or 'subscriptions' collection)
    const pQ = collection(db, "payments");
    const unsubPayments = onSnapshot(pQ, (snapshot) => {
        let total = 0;
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            // Only count if within the current month
            if (data.createdAt?.toDate() >= startOfMonth) {
                total += (data.amount || 0);
            }
        });
        setMonthlyIncome(total);
    });

    return () => { 
      unsubUsers(); 
      unsubJobs(); 
      unsubReports();
      unsubPayments();
    };
  }, []);

  // --- ENHANCED DYNAMIC COUNTERS ---
  const stats = [
    { label: "Registered Users", value: users.length, id: "totalUsers" },
    { 
      label: "Job Seekers", 
      value: users.filter(u => (u.role || "").toLowerCase() === "applicant").length, 
      id: "seekers" 
    },
    { 
      label: "Employers", 
      value: users.filter(u => (u.role || "").toLowerCase() === "employer").length, 
      id: "employers" 
    },
    { label: "Job Posts", value: jobStats.total, id: "totalJobs" },
    { label: "System Health", value: systemStatus, id: "health" },
  ];

  const handleStatus = async (id, newStatus) => {
    try { 
        await updateDoc(doc(db, "users", id), { status: newStatus }); 
    } catch (e) { 
        console.error("Error updating status: ", e); 
    }
  };

  const getUserDisplayName = (u) => {
    return u.fullName || u.name || (u.firstName ? `${u.firstName} ${u.lastName || ""}` : null) || "New User";
  };

  const filteredUsers = users.filter(u => 
    (getUserDisplayName(u).toLowerCase()).includes(searchTerm.toLowerCase()) || 
    (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users Management', icon: Users },
    { id: 'applications', label: 'Applications Management', icon: FileText },
    { id: 'content', label: 'Content Management', icon: Code },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'payments', label: 'Payment & Subscriptions Management', icon: CreditCard },
    { id: 'feedback', label: 'Feedback & Complaints', icon: MessageSquare },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'security', label: 'Security & Monitoring', icon: ShieldCheck },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <header className="main-header">
              <h1>Admin Command Center</h1>
              <p>Centralized view of activity and engagement for {users.length} registered accounts.</p>
            </header>

            <div className="stats-grid">
              {stats.map(stat => (
                <div key={stat.id} className={`stat-card ${stat.id === 'health' ? (systemStatus === 'Optimal' ? 'health-good' : 'health-bad') : ''}`}>
                  <h3>{stat.label}</h3>
                  <p className="stat-value">
                    {stat.id === 'health' && <HeartPulse size={20} className="pulse-icon" />}
                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="analytics-section">
              <div className="section-title">
                <TrendingUp size={20} /> <h2>Performance Analytics</h2>
              </div>
              <div className="reports-grid">
                <div className="report-card blue">
                  <div className="report-icon"><Calendar size={24} /></div>
                  <div className="report-info"><h4>Daily Reports</h4><p>{reportCounts.daily}</p></div>
                </div>
                <div className="report-card purple">
                  <div className="report-icon"><BarChart3 size={24} /></div>
                  <div className="report-info"><h4>Weekly Reports</h4><p>{reportCounts.weekly}</p></div>
                </div>
                <div className="report-card orange">
                  <div className="report-icon"><FileText size={24} /></div>
                  <div className="report-info"><h4>Monthly Reports</h4><p>{reportCounts.monthly}</p></div>
                </div>
                <div className="report-card green">
                  <div className="report-icon"><CreditCard size={24} /></div>
                  <div className="report-info"><h4>Monthly Income</h4><p>₱{monthlyIncome.toLocaleString()}</p></div>
                </div>
              </div>
            </div>

            <div className="activities-wrapper">
              <div className="activities-card">
                <div className="activities-header">
                  <Activity size={20} color="#38bdf8" />
                  <h3>Recent User Engagement</h3>
                </div>
                <div className="activities-body">
                  {users.slice(0, 6).map(u => (
                    <li key={u.id}>
                      <div className="activity-dot"></div>
                      <div className="activity-info">
                        <strong>{getUserDisplayName(u)}</strong> 
                        <span> initialized </span>
                        <span className="role-highlight">{u.role}</span> account
                      </div>
                    </li>
                  ))}
                </div>
              </div>
            </div>

            <div className="table-container">
              <div className="table-header">
                <h3>User Registration Queue</h3>
                <div className="search-box">
                  <Search size={18} />
                  <input type="text" placeholder="Search records..." onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading ? filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="user-name-cell">
                          <strong>{getUserDisplayName(user)}</strong>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td><span className={`role-badge ${(user.role || "").toLowerCase()}`}>{user.role}</span></td>
                      <td><span className={`status-badge ${(user.status || "pending").toLowerCase()}`}>{user.status || "Pending"}</span></td>
                      <td className="table-actions">
                        {(user.role || "").toLowerCase() === 'admin' ? (
                          <span className="system-label">System Admin</span>
                        ) : (
                          <>
                            <button className="btn-approve" title="Approve" onClick={() => handleStatus(user.id, 'Active')}><Check size={16} /></button>
                            <button className="btn-reject" title="Reject" onClick={() => handleStatus(user.id, 'Rejected')}><X size={16} /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  )) : <tr><td colSpan="5" className="empty-table-row">Fetching data...</td></tr>}
                </tbody>
              </table>
            </div>
          </>
        );
      case 'users': return <UserManage />;
      case 'applications': return <AppliManage />;
      case 'content': return <ContentManage />;
      case 'reports': return <AdReport />;
      case 'payments': return <PaySubManage />;
      case 'feedback': return <FeedbackComp />;
      case 'settings': return <SystemSett />;
      case 'security': return <AdSecurity />;
      default: return <div>Select a tab</div>;
    }
  };

  return (
    <div className="admin-container">
      <nav className="admin-sidebar">
        <div className="sidebar-logo">
          <span className="logo-main">Int<span>Job</span></span>
          <small className="logo-sub">ADMIN PORTAL</small>
        </div>
        <ul className="nav-menu">
          {menuItems.map((item) => (
            <li key={item.id} className={activeTab === item.id ? 'active' : ''}>
              <button onClick={() => setActiveTab(item.id)}>
                <item.icon size={20} className="nav-icon" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <button className="logout-btn"><LogOut size={18} /> <span>Logout</span></button>
        </div>
      </nav>
      <main className="admin-main">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;