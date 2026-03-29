import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BackpackIcon, 
  MagnifyingGlassIcon, 
  DownloadIcon,
  UpdateIcon
} from '@radix-ui/react-icons';
import { useAuth } from '../../contexts/AuthContext';
import StatusBadge from '../../components/ui/StatusBadge'; // The component we created
import '../../styles/ViewApplicants.css';

const ViewApplicants = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // const data = await fetchAllApplicants(token);
        // setApplicants(data);
        
        // Mock Data for UI
        setApplicants([
          { id: 1, name: "Juan Dela Cruz", jobTitle: "Frontend Developer", status: "New", date: "2026-03-25", resumeUrl: "/mock/resume1.pdf" },
          { id: 2, name: "Maria Clara", jobTitle: "UI/UX Designer", status: "Shortlisted", date: "2026-03-24", resumeUrl: "/mock/resume2.pdf" },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) loadData();
  }, [token]);

  const handleDownloadAll = async () => {
    setDownloading(true);
    try {
      // Logic: In a real app, you'd request a ZIP from the backend
      // For now, we simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Preparing ZIP file for " + applicants.length + " applicants...");
    } catch (err) {
      alert("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  const handleStatusUpdate = (id, newStatus) => {
    setApplicants(prev => prev.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
    // Call your API: updateApplicantStatus(id, newStatus, token);
  };

  return (
    <div className="applicants-page-container">
      <header className="applicants-header">
        <div className="header-left">
          <div className="header-icon-box">
            <BackpackIcon className="w-6 h-6" />
          </div>
          <div>
            <h1>Applicant Tracking</h1>
            <p>Manage and review your incoming talent pool</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="search-wrapper">
            <MagnifyingGlassIcon className="search-icon" />
            <input 
              type="text" 
              placeholder="Search candidates..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            onClick={handleDownloadAll}
            disabled={downloading || applicants.length === 0}
            className="download-all-btn"
          >
            {downloading ? <UpdateIcon className="animate-spin" /> : <DownloadIcon />}
            {downloading ? 'Zipping...' : 'Download All Resumes'}
          </button>
        </div>
      </header>

      <div className="applicants-card">
        <table className="applicants-table">
          <thead>
            <tr>
              <th>Candidate Name</th>
              <th>Position</th>
              <th>Status</th>
              <th>Date Applied</th>
              <th className="text-right">Profile</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="table-loader">
                  <UpdateIcon className="animate-spin w-8 h-8 text-indigo-500" />
                </td>
              </tr>
            ) : applicants.map((app) => (
              <tr key={app.id} className="applicant-row">
                <td className="font-bold text-slate-700">{app.name}</td>
                <td>
                  <span className="job-tag">{app.jobTitle}</span>
                </td>
                <td>
                  <StatusBadge 
                    currentStatus={app.status} 
                    onUpdate={(status) => handleStatusUpdate(app.id, status)} 
                  />
                </td>
                <td className="text-slate-400 text-xs font-medium">
                  {new Date(app.date).toLocaleDateString()}
                </td>
                <td className="text-right">
                  <button 
                    onClick={() => navigate(`/dashboard/applicants/${app.id}`)}
                    className="view-link"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewApplicants;