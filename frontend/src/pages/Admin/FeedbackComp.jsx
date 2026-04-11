import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, AlertCircle, Clock, CheckCircle2,
  Building, List, Eye, Send, Flag, Check, X, 
  RefreshCw, FileBarChart, Reply, Users, Filter, Download, CheckSquare
} from 'lucide-react';
import '../../styles/Admin/AdminDash.css';
import '../../styles/Admin/FeedbackComp.css';

const FeedbackComp = () => {
  const [activeTab, setActiveTab] = useState('applicants');
  const [isLoading, setIsLoading] = useState(false);
  const [viewModal, setViewModal] = useState({ show: false, data: null });
  const [respondModal, setRespondModal] = useState({ show: false, user: '' });
  const [responseText, setResponseText] = useState('');

  // --- DATABASE READY STATES ---
  const [feedbackList, setFeedbackList] = useState([]);
  const [stats, setStats] = useState({
    totalFeedback: 0, totalComplaints: 0, pending: 0, resolved: 0
  });

  // --- FILTER STATES ---
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    userType: 'all'
  });

  useEffect(() => {
    fetchFeedbackData();
  }, [activeTab, filters]);

  const fetchFeedbackData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 600);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="feedback-container">
      <header className="feedback-header">
        <div className="header-title-row">
          <h1>
              <MessageSquare size={28} className="header-icon" /> Feedback & Complaints
          </h1>
          <button className="btn-f-refresh" onClick={fetchFeedbackData} disabled={isLoading}>
            <RefreshCw size={14} className={isLoading ? "spin-icon" : ""} /> 
            {isLoading ? "Syncing..." : "Refresh Database"}
          </button>
        </div>
      </header>

      {/* STATS GRID */}
      <div className="feedback-stats-grid">
        <div className="f-stat-card"><MessageSquare size={26} className="icon-blue" /><h3>Total Feedback</h3><div className="f-stat-value">{stats.totalFeedback}</div></div>
        <div className="f-stat-card"><AlertCircle size={26} className="icon-red" /><h3>Total Complaints</h3><div className="f-stat-value">{stats.totalComplaints}</div></div>
        <div className="f-stat-card"><Clock size={26} className="icon-orange" /><h3>Pending</h3><div className="f-stat-value">{stats.pending}</div></div>
        <div className="f-stat-card"><CheckCircle2 size={26} className="icon-green" /><h3>Resolved</h3><div className="f-stat-value">{stats.resolved}</div></div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="feedback-tab-bar">
        <button onClick={() => setActiveTab('applicants')} className={`f-tab-btn ${activeTab === 'applicants' ? 'active' : ''}`}>
          <Users size={16} /> Applicant Feedback
        </button>
        <button onClick={() => setActiveTab('employers')} className={`f-tab-btn ${activeTab === 'employers' ? 'active' : ''}`}>
          <Building size={16} /> Employer Feedback
        </button>
        <button onClick={() => setActiveTab('all')} className={`f-tab-btn ${activeTab === 'all' ? 'active' : ''}`}>
          <List size={16} /> Combined Records
        </button>
      </div>

      {/* ACTION & FILTER BAR */}
      <div className="f-action-bar">
        <div className="f-filters-group">
          <div className="filter-item">
            <Filter size={14} />
            <select name="type" onChange={handleFilterChange} value={filters.type}>
              <option value="all">All Types</option>
              <option value="feedback">Feedback</option>
              <option value="complaint">Complaint</option>
              <option value="suggestion">Suggestion</option>
            </select>
          </div>

          <div className="filter-item">
            <CheckSquare size={14} />
            <select name="status" onChange={handleFilterChange} value={filters.status}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>

          {activeTab === 'all' && (
            <div className="filter-item">
              <Users size={14} />
              <select name="userType" onChange={handleFilterChange} value={filters.userType}>
                <option value="all">All Users</option>
                <option value="applicants">Applicants</option>
                <option value="employers">Employers</option>
              </select>
            </div>
          )}
        </div>

        <div className="f-bulk-actions">
          {(activeTab === 'employers' || activeTab === 'all') && (
            <>
              <button className="btn-bulk-resolve">
                <CheckCircle2 size={14} /> Bulk Resolve
              </button>
              <button className="btn-export">
                <Download size={14} /> {activeTab === 'all' ? 'Export All' : 'Export Data'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* TABLE CONTENT */}
      <div className="feedback-table-container">
        <table className="f-table">
          <thead>
            <tr>
              <th>Name</th>
              {activeTab === 'all' && <th>User Type</th>}
              <th>Type</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.length > 0 ? (
              feedbackList.map((item) => (
                <tr key={item.id}>
                   {/* ... same mapping logic ... */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={activeTab === 'all' ? 7 : 6} className="empty-table-row">
                  {isLoading ? "Updating list..." : "No records found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODALS ... same modal code ... */}
    </div>
  );
};

export default FeedbackComp;