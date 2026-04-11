import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { 
  Users, Search, Building2, Briefcase, X, Eye, Calendar, MapPin, DollarSign
} from 'lucide-react';
import '../../styles/Admin/AdminDash.css';
import '../../styles/Admin/UserManage.css';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('jobSeekers');
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]); 
  const [companies, setCompanies] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const userData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userData);
      setLoading(false);
    });

    const unsubJobs = onSnapshot(collection(db, "jobs"), (snapshot) => {
      const jobData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(jobData);
    });

    const unsubCompanies = onSnapshot(collection(db, "companies"), (snapshot) => {
      const companyData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCompanies(companyData);
    });

    return () => { 
      unsubUsers(); 
      unsubJobs(); 
      unsubCompanies(); 
    };
  }, []);

  // NEW: Helper para makuha ang Job Title (title or jobTitle)
  const resolveJobTitle = (job) => {
    return job.title || job.jobTitle || "Untitled Position";
  };

  const resolveCompanyName = (job) => {
    if (job.companyName) return job.companyName;
    const targetId = job.employerId || job.companyId;
    const found = companies.find(c => c.id === targetId);
    return found ? (found.companyName || found.name) : "Loading Company...";
  };

  const handleStatusUpdate = async (id, newStatus, type = 'user') => {
    try {
      const collectionName = type === 'job' ? 'jobs' : 'users';
      await updateDoc(doc(db, collectionName, id), { status: newStatus });
      
      if (selectedJob) setSelectedJob(null);
      
      alert(`${type.toUpperCase()} status updated to ${newStatus}`);
    } catch (err) { console.error(err); }
  };

  const getDisplayName = (item) => {
    if (item.title || item.jobTitle) return resolveJobTitle(item);
    return item.fullName || item.name || (item.firstName ? `${item.firstName} ${item.lastName || ""}` : null) || "Unnamed User";
  };

  const getFilteredData = () => {
    const term = searchTerm.toLowerCase();
    if (activeTab === 'jobs') {
      return jobs.filter(job => 
        (resolveJobTitle(job).toLowerCase()).includes(term) || 
        (resolveCompanyName(job).toLowerCase()).includes(term)
      );
    }
    return users.filter(user => {
      const name = getDisplayName(user).toLowerCase();
      const email = (user.email?.toLowerCase() || "");
      const role = (user.role?.toLowerCase() || "");
      const matchesSearch = name.includes(term) || email.includes(term);
      if (activeTab === 'jobSeekers') return matchesSearch && (role === "applicant" || role === "job seeker" || role === "seeker");
      if (activeTab === 'employers') return matchesSearch && role === "employer";
      return matchesSearch;
    });
  };

  const filteredData = getFilteredData();

  const JobDetailsModal = ({ job, onClose }) => {
    if (!job) return null;
    return (
      <div className="admin-modal-overlay" onClick={onClose}>
        <div className="admin-modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Job Specifications</h2>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </div>
          <div className="modal-body">
            <div className="job-main-info">
              {/* UPDATED: resolveJobTitle sa Modal */}
              <h3>{resolveJobTitle(job)}</h3>
              <p className="company-tag">
                <Building2 size={16} /> {resolveCompanyName(job)}
              </p>
            </div>
            
            <div className="info-grid">
              <div className="info-item">
                <Calendar size={16} />
                <span><strong>Posted:</strong> {job.createdAt?.toDate ? job.createdAt.toDate().toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="info-item">
                <MapPin size={16} />
                <span><strong>Location:</strong> {job.location || 'Remote / Not Specified'}</span>
              </div>
              <div className="info-item">
                <DollarSign size={16} />
                <span><strong>Salary:</strong> {job.salary || 'Undisclosed'}</span>
              </div>
            </div>

            <div className="details-section">
              <h4>Description</h4>
              <p>{job.description || 'No description provided.'}</p>
            </div>

            <div className="details-section">
              <h4>Requirements</h4>
              <p>{job.requirements || 'No requirements listed.'}</p>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-modal reject" onClick={() => handleStatusUpdate(job.id, 'Rejected', 'job')}>
              Decline
            </button>
            <button className="btn-modal approve" onClick={() => handleStatusUpdate(job.id, 'Approved', 'job')}>
              Approve
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="usermanage-container">
      <header className="usermanage-header">
        <div className="header-title">
          <h1>Management Hub</h1>
          <p>Verifying <strong>{users.length}</strong> accounts and <strong>{jobs.length}</strong> postings</p>
        </div>
        <div className="usermanage-search">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder={activeTab === 'jobs' ? "Search jobs..." : "Search users..."}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="usermanage-tabs">
        <button className={`tab-btn ${activeTab === 'jobSeekers' ? 'active' : ''}`} onClick={() => setActiveTab('jobSeekers')}>
          <Users size={16} /> Job Seekers
        </button>
        <button className={`tab-btn ${activeTab === 'employers' ? 'active' : ''}`} onClick={() => setActiveTab('employers')}>
          <Building2 size={16} /> Employers
        </button>
        <button className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`} onClick={() => setActiveTab('jobs')}>
          <Briefcase size={16} /> Job Postings
        </button>
      </div>

      <div className="usermanage-table-card">
        <table className="usermanage-table">
          <thead>
            {activeTab === 'jobs' ? (
              <tr><th>Job Title</th><th>Company</th><th>Posted Date</th><th>Status</th><th>Actions</th></tr>
            ) : (
              <tr><th>Name</th><th>Email</th><th>Role/Industry</th><th>Status</th><th>Actions</th></tr>
            )}
          </thead>
          <tbody>
            {!loading ? filteredData.map(item => (
              <tr key={item.id}>
                {activeTab === 'jobs' ? (
                  <>
                    {/* UPDATED: Ginamit ang resolveJobTitle dito */}
                    <td><strong>{resolveJobTitle(item)}</strong></td>
                    <td>{resolveCompanyName(item)}</td>
                    <td>{item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'New'}</td>
                  </>
                ) : (
                  <>
                    <td><strong>{getDisplayName(item)}</strong></td>
                    <td>{item.email}</td>
                    <td>{item.role || item.industry || "User"}</td>
                  </>
                )}
                <td><span className={`status-pill ${(item.status || 'pending').toLowerCase()}`}>{item.status || 'Pending'}</span></td>
                <td className="action-cells">
                  {activeTab === 'jobs' && (
                    <button className="table-btn-text view" title="View Details" onClick={() => setSelectedJob(item)}>
                      View
                    </button>
                  )}
                  <button className="table-btn-text approve" onClick={() => handleStatusUpdate(item.id, activeTab === 'jobs' ? 'Approved' : 'Active', activeTab === 'jobs' ? 'job' : 'user')}>
                    Approve
                  </button>
                  <button className="table-btn-text reject" onClick={() => handleStatusUpdate(item.id, 'Rejected', activeTab === 'jobs' ? 'job' : 'user')}>
                    Reject
                  </button>
                </td>
              </tr>
            )) : <tr><td colSpan="5" className="empty-row">Loading...</td></tr>}
          </tbody>
        </table>
      </div>

      {selectedJob && <JobDetailsModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
};

export default UserManagement;