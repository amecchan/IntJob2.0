import React, { useEffect, useState } from 'react';
import JobTable from '../../components/Dashboard/JobTable';
import PostJobModal from '../../components/Modals/PostJobModal';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal';
import JobPreviewModal from '../../components/Modals/JobPreviewModal';
import { MagnifyingGlassIcon, PlusIcon, LayersIcon } from '@radix-ui/react-icons';
import { db } from '../../services/firebase';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../context/ToastContext'; // Import Toast
import '../../styles/JobManagement.css';

const JobManagement = () => {
  const { user } = useAuth();
  const { showToast } = useToast(); // Initialize Toast
  const [counts, setCounts] = useState({ active: 0, totalApps: 0 });
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  const [searchTerm, setSearchTerm] = useState(""); 
  
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, jobId: null, jobTitle: '' });
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPreviewJob, setSelectedPreviewJob] = useState(null);

  useEffect(() => {
    const fetchQuickStats = async () => {
      if (!user?.uid) return;
      try {
        const jobsQuery = query(collection(db, "jobs"), where("employerId", "==", user.uid));
        const jobsSnap = await getDocs(jobsQuery);
        
        const appsQuery = query(collection(db, "applications"), where("employerId", "==", user.uid));
        const appsSnap = await getDocs(appsQuery);
        
        setCounts({
          active: jobsSnap.docs.filter(d => d.data().isActive).length,
          totalApps: appsSnap.size
        });
      } catch (err) {
        showToast("Stats Error", "Could not load dashboard stats.", "error");
      }
    };
    fetchQuickStats();
  }, [refreshTrigger, user?.uid, showToast]);

  const handlePostSuccess = (type) => {
    setIsPostModalOpen(false);
    setEditData(null);
    setRefreshTrigger(prev => prev + 1); 
    
    // Logic to distinguish between Create and Update if needed
    const msg = editData ? "Job listing updated." : "Job listing created successfully.";
    showToast("Listing Saved", msg, "success");
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, "jobs", deleteModal.jobId));
      showToast("Listing Removed", `${deleteModal.jobTitle} was deleted.`, "info");
      setDeleteModal({ isOpen: false, jobId: null, jobTitle: '' });
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      showToast("Delete Failed", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-mgmt-flow animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mgmt-header">
        <div className="header-left">
          <div className="mgmt-badge">
            <LayersIcon /> <span>Inventory Management</span>
          </div>
          <h1 className="mgmt-title">Job <span className="text-indigo-600">Postings</span></h1>
        </div>

        <div className="header-right">
          <div className="mgmt-search-wrapper">
            <MagnifyingGlassIcon className="s-icon" />
            <input 
              type="text" 
              placeholder="Filter by title..." 
              className="mgmt-search-input" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <button 
            className="mgmt-primary-btn" 
            onClick={() => { setEditData(null); setIsPostModalOpen(true); }}
          >
            <PlusIcon /> <span>Post New Job</span>
          </button>
        </div>
      </header>

      {/* Stats and Table remains same */}
      <div className="mgmt-stats-grid">
        <div className="mgmt-stat-card">
          <span className="v text-indigo-600">{counts.active}</span>
          <span className="l">Active Listings</span>
        </div>
        <div className="mgmt-stat-card">
          <span className="v">{counts.totalApps}</span>
          <span className="l">Total Applicants</span>
        </div>
      </div>

      <div className="mgmt-table-wrapper">
        <JobTable 
          hideHeader={true} 
          key={`${refreshTrigger}-${searchTerm}`}
          onEdit={(job) => { setEditData(job); setIsPostModalOpen(true); }}
          onDelete={(id, title) => setDeleteModal({ isOpen: true, jobId: id, jobTitle: title })}
          onView={(job) => setSelectedPreviewJob(job)} 
          searchFilter={searchTerm}
        />
      </div>

      {isPostModalOpen && (
        <PostJobModal 
          initialData={editData}
          onClose={() => { setIsPostModalOpen(false); setEditData(null); }} 
          onSuccess={handlePostSuccess} 
        />
      )}

      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        jobTitle={deleteModal.jobTitle}
        loading={loading}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
      />

      {selectedPreviewJob && (
        <JobPreviewModal job={selectedPreviewJob} onClose={() => setSelectedPreviewJob(null)} />
      )}
    </div>
  );
};

export default JobManagement;