import React, { useState, useEffect } from 'react';
import { 
  Download, RefreshCw, PieChart, Briefcase, UserPlus, 
  Tags, Building2, Server, FileDown, TrendingUp, 
  TrendingDown, BarChart3, Users, FileText
} from 'lucide-react';
import '../../styles/Admin/AdminDash.css';
import '../../styles/Admin/AdReport.css';

const AdReport = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  // --- DATABASE READY STATES ---
  const [stats, setStats] = useState({
    totalJobs: 0,
    newUsers: 0,
    applications: 0,
    activeEmployers: 0,
    jobGrowth: "0%",
    userGrowth: "0%",
    appGrowth: "0%",
    empGrowth: "0%"
  });

  const [weeklyActivity, setWeeklyActivity] = useState([
    { day: 'Mon', val: 0 }, { day: 'Tue', val: 0 }, { day: 'Wed', val: 0 },
    { day: 'Thu', val: 0 }, { day: 'Fri', val: 0 }, { day: 'Sat', val: 0 }, { day: 'Sun', val: 0 }
  ]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = () => {
    setIsLoading(true);
    // Placeholder para sa Firebase fetch logic
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  const getMaxVal = () => {
    const max = Math.max(...weeklyActivity.map(o => o.val));
    return max === 0 ? 1 : max;
  };

  const renderTabContent = () => {
    if (isLoading) return (
      <div className="report-loading">
        <RefreshCw className="spin-icon" size={48} />
        <p>Updating from database...</p>
      </div>
    );

    switch (activeTab) {
      case 'overview':
        return (
          <div className="tab-content-fade">
            {/* FIXED HEADER: Icon and Select Alignment */}
            <div className="report-section-header">
              <div className="section-title-group">
                <PieChart size={24} className="header-icon-blue" /> 
                <h2>Dashboard Overview</h2>
              </div>
              
              <div className="section-actions">
                <select className="period-select">
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="3m">Last 3 Months</option>
                </select>
              </div>
            </div>

            {/* STATS GRID */}
            <div className="report-stats-grid">
              {[
                { label: 'Total Job Posts', val: stats.totalJobs, change: stats.jobGrowth, icon: <Briefcase size={18}/> },
                { label: 'New Users', val: stats.newUsers, change: stats.userGrowth, icon: <Users size={18}/> },
                { label: 'Applications', val: stats.applications, change: stats.appGrowth, icon: <FileText size={18}/> },
                { label: 'Active Employers', val: stats.activeEmployers, change: stats.empGrowth, icon: <Building2 size={18}/> },
              ].map((s, i) => (
                <div key={i} className="report-stat-card">
                  <div className="stat-label">{s.icon} {s.label}</div>
                  <div className="stat-value">{s.val.toLocaleString()}</div>
                  <div className={`stat-change ${s.change.startsWith('+') ? 'positive' : s.change.startsWith('-') ? 'negative' : ''}`}>
                    {s.change.startsWith('+') ? <TrendingUp size={12} /> : s.change.startsWith('-') ? <TrendingDown size={12} /> : null}
                    {s.change} from last month
                  </div>
                </div>
              ))}
            </div>

            {/* WEEKLY CHART */}
            <div className="chart-card">
              <h3>Weekly Activity Overview</h3>
              <div className="chart-wrapper">
                {weeklyActivity.map((item, i) => (
                  <div key={i} className="bar-group">
                    <span className="bar-val">{item.val}</span>
                    <div 
                      className="bar-fill" 
                      style={{ height: `${(item.val / getMaxVal()) * 100}%` }}
                    ></div>
                    <span className="bar-day">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="sec-empty-state">
            <BarChart3 size={48} />
            <p>Fetching detailed metrics for {activeTab.replace('-', ' ')}...</p>
          </div>
        );
    }
  };

  return (
    <div className="report-container">
      <div className="report-main-header">
        <h1 className="main-title">
          <BarChart3 size={28} className="title-logo" /> Reports & Analytics
        </h1>
        <div className="header-actions">
           <button className="btn-export"><Download size={16} /> Export Data</button>
           <button className="btn-refresh" onClick={fetchAnalyticsData} disabled={isLoading}>
             <RefreshCw size={16} className={isLoading ? "spin-icon" : ""} /> Refresh
           </button>
        </div>
      </div>

      <nav className="report-tab-bar">
        {[
          { id: 'overview', icon: <PieChart size={16}/>, label: 'Overview' },
          { id: 'job-trends', icon: <Briefcase size={16}/>, label: 'Job Posting Trends' },
          { id: 'user-registration', icon: <UserPlus size={16}/>, label: 'User Registration' },
          { id: 'job-categories', icon: <Tags size={16}/>, label: 'Applied Categories' },
          { id: 'employer-activity', icon: <Building2 size={16}/>, label: 'Employer Activity' },
          { id: 'system-usage', icon: <Server size={16}/>, label: 'System Usage' },
          { id: 'reports', icon: <FileDown size={16}/>, label: 'Export Reports', badge: 3 },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`report-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.icon} {tab.label}
            {tab.badge && <span className="report-badge">{tab.badge}</span>}
          </button>
        ))}
      </nav>

      <div className="analytics-body">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdReport;