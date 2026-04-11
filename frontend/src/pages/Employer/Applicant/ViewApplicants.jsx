import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BackpackIcon, 
  MagnifyingGlassIcon, 
  DownloadIcon,
  UpdateIcon,
  ExternalLinkIcon,
  ClockIcon,
  PersonIcon,
  CheckIcon,
  EnvelopeOpenIcon 
} from '@radix-ui/react-icons';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../services/firebase'; 
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore'; // Changed to onSnapshot
import StatusBadge from '../../../components/ui/StatusBadge'; 
import '../../../styles/ViewApplicants.css';

const ViewApplicants = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const appsRef = collection(db, "applications");
    const q = query(appsRef, orderBy("createdAt", "desc")); // Using createdAt for better accuracy

    // Use onSnapshot for REAL-TIME updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedApplicants = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplicants(fetchedApplicants);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching applicants:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredApplicants = applicants.filter(app => 
    (app.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
    (app.jobTitle?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  // Statistics Calculation with Case Insensitivity
  const statsList = [
    { 
      label: 'Total Candidates', 
      value: applicants.length, 
      icon: <PersonIcon />, 
      color: '#4f46e5', 
      bg: '#eef2ff' 
    },
    { 
      label: 'New Applications', 
      // Checking for both "NEW" and "pending" just in case
      value: applicants.filter(a => a.status?.toUpperCase() === 'NEW' || a.status?.toLowerCase() === 'pending').length, 
      icon: <EnvelopeOpenIcon />, 
      color: '#d97706', 
      bg: '#fffbeb' 
    },
    { 
      label: 'Shortlisted', 
      // Using .toUpperCase() ensures it counts regardless of how it was saved
      value: applicants.filter(a => a.status?.toUpperCase() === 'SHORTLISTED').length, 
      icon: <CheckIcon />, 
      color: '#10b981', 
      bg: '#ecfdf5' 
    },
  ];

  return (
    <div className="view-applicants-flow">
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

      <div className="applicants-stats-grid">
        {statsList.map((stat, i) => (
          <div key={i} className="stat-card-modern">
            <div 
              className="stat-icon-box" 
              style={{ backgroundColor: stat.bg, color: stat.color }}
            >
              {stat.icon}
            </div>
            <div className="stat-info">
              <span className="stat-number">{loading ? "..." : stat.value}</span>
              <span className="stat-name">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

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