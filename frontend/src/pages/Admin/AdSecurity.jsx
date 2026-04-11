import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, History, UserX, 
  Search, Lock, MapPin, Clock, AlertTriangle, RefreshCw 
} from 'lucide-react';
import '../../styles/Admin/AdminDash.css';
import '../../styles/Admin/AdSecurity.css';

const AdSecurity = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- DATABASE READY STATES ---
  const [logs, setLogs] = useState([]); // Dito papasok ang login/activity logs
  const [alerts, setAlerts] = useState([]); // Dito papasok ang suspicious behavior
  const [securityStats, setSecurityStats] = useState({
    totalToday: 0,
    successful: 0,
    failed: 0
  });

  const tabs = [
    { label: "Login Logs", icon: <History size={16} /> },
    { label: "Activity Logs", icon: <ShieldCheck size={16} /> },
    { label: "Failed Logins", icon: <Lock size={16} /> },
    { label: "Suspicious", icon: <AlertTriangle size={16} /> },
    { label: "Blacklisted", icon: <UserX size={16} /> }
  ];

  useEffect(() => {
    fetchSecurityLogs();
  }, [activeTab]);

  const fetchSecurityLogs = () => {
    setIsLoading(true);
    // Simulating Firebase fetch
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <div className="security-container">
      <div className="sec-header">
        <div className="sec-header-row">
          <h1>
            <ShieldAlert size={32} className="header-icon-blue" /> Security & Monitoring
          </h1>
          <button className="btn-f-refresh" onClick={fetchSecurityLogs} disabled={isLoading}>
            <RefreshCw size={14} className={isLoading ? "spin-icon" : ""} />
            {isLoading ? "Analyzing..." : "Sync Security Data"}
          </button>
        </div>
        <p>Periodic Security Monitoring and Threat Detection System</p>
      </div>

      {/* Tabs */}
      <div className="sec-tabs-container">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`sec-tab-btn ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.icon} <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="sec-content-area">
        {/* STATS SECTION (Visible only on login-related tabs) */}
        {(activeTab === 0 || activeTab === 2) && (
          <div className="sec-stats-grid">
            <div className="sec-stat-card">
              <h3>Total Logins Today</h3>
              <div className="sec-stat-value">{securityStats.totalToday}</div>
            </div>
            <div className="sec-stat-card">
              <h3>Successful Logins</h3>
              <div className="sec-stat-value success">{securityStats.successful}</div>
            </div>
            <div className="sec-stat-card">
              <h3>Failed Attempts</h3>
              <div className="sec-stat-value danger">{securityStats.failed}</div>
            </div>
          </div>
        )}

        {/* LOGS TABLE (Tabs: Login, Activity, Failed, Blacklisted) */}
        {(activeTab === 0 || activeTab === 1 || activeTab === 2 || activeTab === 4) && (
          <div className="fade-in">
            <div className="sec-search-wrapper">
              <Search size={18} className="sec-search-icon" />
              <input 
                type="text" 
                className="sec-search-input" 
                placeholder={`Search ${tabs[activeTab].label.toLowerCase()}...`}
                onChange={handleSearch}
              />
            </div>

            <div className="sec-table-container">
              <table className="sec-table">
                <thead>
                  <tr>
                    <th><Clock size={14} /> Timestamp</th>
                    <th>User Identity</th>
                    <th><MapPin size={14} /> Location / IP</th>
                    <th>Status / Action</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length > 0 ? (
                    logs.map((log, idx) => (
                      <tr key={idx}>
                        <td>{log.timestamp}</td>
                        <td><strong>{log.userId}</strong></td>
                        <td>{log.location}</td>
                        <td>
                          <span className={`sec-badge ${log.status.toLowerCase()}`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="sec-empty-state">
                        <History size={48} />
                        <p>{isLoading ? "Updating logs..." : `No ${tabs[activeTab].label.toLowerCase()} recorded.`}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUSPICIOUS BEHAVIOR (Alert Cards) */}
        {activeTab === 3 && (
          <div className="fade-in">
            {alerts.length > 0 ? (
              alerts.map((alert, idx) => (
                <div key={idx} className={`sec-alert ${alert.riskLevel.toLowerCase()}`}>
                  <div className="sec-alert-title">
                    {alert.riskLevel === 'High' ? <AlertTriangle size={20} /> : <ShieldAlert size={20} />}
                    {alert.title}
                  </div>
                  <p>{alert.description}</p>
                  <div className="sec-alert-meta">
                    <strong>Time:</strong> {alert.timestamp} | <strong>Risk Level:</strong> {alert.riskLevel}
                  </div>
                </div>
              ))
            ) : (
              <div className="sec-empty-state">
                <ShieldCheck size={48} color="#22c55e" />
                <p>{isLoading ? "Scanning system..." : "No suspicious activities detected. System secure."}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdSecurity;