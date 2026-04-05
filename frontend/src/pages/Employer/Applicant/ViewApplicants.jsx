import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BackpackIcon, 
  MagnifyingGlassIcon, 
  DownloadIcon,
  UpdateIcon,
  ExternalLinkIcon
} from '@radix-ui/react-icons';
import { useAuth } from '../../../contexts/AuthContext';
import StatusBadge from '../../../components/ui/StatusBadge'; 
import '../../../styles/ViewApplicants.css';

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
        // Mock Data reflecting your screenshot
        setApplicants([
          { id: "APP-9210", name: "Juan Dela Cruz", jobTitle: "Frontend Developer", status: "NEW", date: "2026-03-25" },
          { id: "APP-4432", name: "Maria Clara", jobTitle: "UI/UX Designer", status: "SHORTLISTED", date: "2026-03-24" },
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        // Subtle delay for a premium feel
        setTimeout(() => setLoading(false), 800);
      }
    };
    if (token) loadData();
  }, [token]);

  const handleDownloadAll = async () => {
    setDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Downloading resumes for:", applicants.length, "candidates");
    } finally {
      setDownloading(false);
    }
  };

  // Filter logic for search
  const filteredApplicants = applicants.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="applicants-page-container animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="applicants-header">
        <div className="header-left">
          <div className="header-icon-box bg-indigo-600 shadow-lg shadow-indigo-100">
            <BackpackIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Applicant Tracking</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Manage and review your incoming talent pool
            </p>
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
              className="search-input"
            />
          </div>
          
          <button 
            onClick={handleDownloadAll}
            disabled={downloading || applicants.length === 0}
            className="download-all-btn"
          >
            {downloading ? <UpdateIcon className="animate-spin" /> : <DownloadIcon />}
            <span>{downloading ? 'Preparing...' : 'Download All Resumes'}</span>
          </button>
        </div>
      </header>

      <div className="applicants-card shadow-2xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="applicants-table">
            <thead>
              <tr>
                <th className="table-head-text">Candidate Name</th>
                <th className="table-head-text">Position</th>
                <th className="table-head-text">Status</th>
                <th className="table-head-text">Date Applied</th>
                <th className="table-head-text text-right">Profile</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <UpdateIcon className="animate-spin w-10 h-10 text-indigo-500" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fetching candidates...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredApplicants.length > 0 ? (
                filteredApplicants.map((app) => (
                  <tr key={app.id} className="applicant-row group">
                    <td className="py-6 px-8">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">
                          {app.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">REF: #{app.id}</span>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <span className="job-tag bg-slate-50 text-slate-500 border border-slate-100 px-3 py-1 rounded-lg text-[11px] font-bold">
                        {app.jobTitle}
                      </span>
                    </td>
                    <td className="py-6 px-8">
                      <StatusBadge currentStatus={app.status} />
                    </td>
                    <td className="py-6 px-8 text-slate-400 text-xs font-bold uppercase tracking-tight">
                      {new Date(app.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-6 px-8 text-right">
                      <button 
                        onClick={() => navigate(`/employer/dashboard/applicants/${app.id}`)}
                        className="view-link-btn"
                      >
                        View Details
                        <ExternalLinkIcon className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No candidates found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewApplicants;