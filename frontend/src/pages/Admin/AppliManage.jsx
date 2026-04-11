import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { 
  Download, Calendar, Search, Loader2
} from 'lucide-react';
import '../../styles/Admin/AdminDash.css';
import '../../styles/Admin/AppliManage.css';

const AppliManage = () => {
  const [filterType, setFilterType] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch real-time applications from Firebase
    const q = query(collection(db, "applications"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const appliData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(appliData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching applications:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- FILTER LOGIC ---
  const filteredApplications = applications.filter((app) => {
    const appDate = app.createdAt?.toDate() || new Date();
    const now = new Date();
    
    // Date Filtering
    let matchesDate = true;
    if (filterType === 'today') {
      matchesDate = appDate.toDateString() === now.toDateString();
    } else if (filterType === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      matchesDate = appDate >= weekAgo;
    } else if (filterType === 'month') {
      matchesDate = appDate.getMonth() === new Date().getMonth() && 
                    appDate.getFullYear() === new Date().getFullYear();
    }

    // Search Filtering (by Name, Company, or Job Title)
    const matchesSearch = 
      app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.companyName?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDate && matchesSearch;
  });

  // Export to CSV Function
  const exportToCSV = () => {
    if (filteredApplications.length === 0) return alert("No data to export");
    
    const headers = ["Applicant,Email,Job Title,Company,Date,Status\n"];
    const rows = filteredApplications.map(app => 
      `${app.applicantName},${app.applicantEmail},${app.jobTitle},${app.companyName},${app.createdAt?.toDate().toLocaleDateString()},${app.status}`
    );
    
    const blob = new Blob([headers + rows.join("\n")], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Applications_${filterType}_${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  return (
    <>
      <header className="appli-header">
        <h1>Applications Management</h1>
        <p>Monitor and track job application statuses in real-time</p>
      </header>

      <div className="appli-tools">
        <div className="appli-filters-wrapper">
          <div className="appli-filters">
            {['all', 'today', 'week', 'month'].map((type) => (
              <button 
                key={type}
                onClick={() => setFilterType(type)}
                className={`filter-btn ${filterType === type ? 'active' : ''}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="appli-search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search applicant or company..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="export-container">
          <button className="export-btn" onClick={exportToCSV}>
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="appli-table-card">
        {loading ? (
          <div className="loader-container">
            <Loader2 className="spinner" />
            <p>Loading applications...</p>
          </div>
        ) : (
          <table className="appli-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Email</th>
                <th>Job Title</th>
                <th>Company</th>
                <th>Date Applied</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td><strong>{app.applicantName || "Anonymous"}</strong></td>
                    <td>{app.applicantEmail}</td>
                    <td>{app.jobTitle}</td>
                    <td>{app.companyName}</td>
                    <td className="date-cell">
                      <Calendar size={14} className="calendar-icon" />
                      {app.createdAt?.toDate().toLocaleDateString() || "N/A"}
                    </td>
                    <td>
                      <span className={`status-pill ${(app.status || 'submitted').toLowerCase()}`}>
                        {app.status || "Submitted"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No applications found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AppliManage;