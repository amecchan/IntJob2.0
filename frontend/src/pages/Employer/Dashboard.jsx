import React, { useState } from 'react';
import StatsSection from '../../components/Dashboard/StatsSection';
import JobTable from '../../components/Dashboard/JobTable';
import PostJobModal from '../../components/Modals/PostJobModal';
import JobPreviewModal from '../../components/Modals/JobPreviewModal'; // Import the new modal
import { PlusIcon, RocketIcon } from '@radix-ui/react-icons';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/EmployerDashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Modal States
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPreviewJob, setSelectedPreviewJob] = useState(null);
  const [editData, setEditData] = useState(null);

  // Handlers
  const handleEdit = (job) => {
    setEditData(job);
    setIsPostModalOpen(true);
  };

  const handleDelete = (id, title) => {
    // Usually, we redirect to Job Management for deletions, 
    // or you can implement the DeleteModal here too.
    console.log("Delete request for:", title);
  };

  const firstName = user?.displayName ? user.displayName.split(' ')[0] : "Employer";

  return (
    <div className="dashboard-container">
      {/* 1. Welcome Header */}
      <header className="db-welcome-section">
        <div className="brand-pill-wrapper">
          <div className="brand-pill">
            <RocketIcon className="brand-icon" />
            <span>Platform Overview</span>
          </div>
        </div>
        
        <h1 className="welcome-title">
          Good day, <span className="text-indigo-600">{firstName}.</span>
        </h1>
        <p className="welcome-subtitle">Here's what is happening with your recruitment today.</p>
      </header>

      {/* 2. Stats Section */}
      <div className="db-stats-section">
        <StatsSection userId={user?.uid} />
      </div>

      {/* 3. Table Section */}
      <div className="db-table-section">
        <div className="table-header-row">
           <div className="header-label">
              <div className="accent-line"></div>
              <span>Recent Job Listings</span>
           </div>
           <button 
             className="new-job-btn-top"
             onClick={() => {
               setEditData(null);
               setIsPostModalOpen(true);
             }}
           >
              <PlusIcon /> Post New Job
           </button>
        </div>
        
        <div className="main-table-card">
          <JobTable 
            limit={5} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onView={(job) => setSelectedPreviewJob(job)} // Preview Trigger
          />
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Post/Edit Modal */}
      {isPostModalOpen && (
        <PostJobModal 
          initialData={editData}
          onClose={() => {
            setIsPostModalOpen(false);
            setEditData(null);
          }} 
          onSuccess={() => {
            setIsPostModalOpen(false);
            setEditData(null);
          }} 
        />
      )}

      {/* Preview Modal */}
      {selectedPreviewJob && (
        <JobPreviewModal 
          job={selectedPreviewJob} 
          onClose={() => setSelectedPreviewJob(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;