import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BackpackIcon, 
  MagnifyingGlassIcon, 
  DownloadIcon,
  UpdateIcon,
  ExternalLinkIcon,
  ClockIcon
} from '@radix-ui/react-icons';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../services/firebase'; 
import { collection, query, getDocs, orderBy } from 'firebase/firestore'; 
import StatusBadge from '../../../components/ui/StatusBadge'; 
import '../../../styles/ViewApplicants.css';

const ViewApplicants = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const appsRef = collection(db, "applications");
        const q = query(appsRef, orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedApplicants = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setApplicants(fetchedApplicants);
      } catch (err) {
        console.error("Error fetching applicants:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchApplicants();
  }, [user]);

  const filteredApplicants = applicants.filter(app => 
    (app.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
    (app.jobTitle?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: applicants.length,
    new: applicants.filter(a => a.status === 'NEW').length,
    shortlisted: applicants.filter(a => a.status === 'SHORTLISTED').length
  };

  return (
    <div className="view-applicants-flow">
      {/* 1. Header Section */}
      <header className="applicants-page-header">
        <div className="header-left-side">
          <div className="brand-badge">
            <BackpackIcon /> <span>Talent Pipeline</span>
          </div>
          <h1 className="main-title">Review Candidates</h1>
        </div>

        <div className="header-right-side">
          <div className="search-box-pill">
            <MagnifyingGlassIcon className="s-icon" />
            <input 
              type="text" 
              placeholder="Search by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="export-btn">
            <DownloadIcon /> <span>Export</span>
          </button>
        </div>
      </header>

      {/* 2. Mini Stats Row */}
      <div className="applicants-stats-grid">
        <div className="mini-stat-card">
          <span className="v">{stats.total}</span>
          <span className="l">Total Candidates</span>
        </div>
        <div className="mini-stat-card">
          <span className="v text-indigo-600">{stats.new}</span>
          <span className="l">New Applications</span>
        </div>
        <div className="mini-stat-card">
          <span className="v text-emerald-600">{stats.shortlisted}</span>
          <span className="l">Shortlisted</span>
        </div>
      </div>

      {/* 3. Table Section */}
      <div className="applicants-table-container">
        <table className="modern-data-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Position</th>
              <th>Status</th>
              <th>Applied</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="loader-state">
                  <UpdateIcon className="animate-spin" />
                  <span>Loading Pipeline...</span>
                </td>
              </tr>
            ) : filteredApplicants.length > 0 ? (
              filteredApplicants.map((app) => (
                <tr key={app.id} className="data-row">
                  <td>
                    <div className="candidate-cell">
                      <div className="c-avatar">{app.name?.charAt(0)}</div>
                      <div className="c-info">
                        <span className="c-name">{app.name}</span>
                        <span className="c-id">#{app.id.slice(0, 6).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="job-chip">{app.jobTitle}</span></td>
                  <td><StatusBadge currentStatus={app.status} /></td>
                  <td>
                    <div className="date-cell">
                      <ClockIcon />
                      {app.date ? new Date(app.date).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="text-right">
                    <button 
                      className="action-link"
                      onClick={() => navigate(`/employer/dashboard/applicants/${app.id}`)}
                    >
                      View Details <ExternalLinkIcon />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-state">No matching candidates found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplicants;