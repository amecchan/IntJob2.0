import React, { useState, useEffect } from 'react';
import StatsSection from '../../components/Dashboard/StatsSection';
import JobTable from '../../components/Dashboard/JobTable';
import PostJobModal from '../../components/Modals/PostJobModal';
import JobPreviewModal from '../../components/Modals/JobPreviewModal';
import DeleteConfirmationModal from '../../components/Modals/DeleteConfirmationModal';
import { 
  PlusIcon, RocketIcon, CalendarIcon, ChevronRightIcon, ClockIcon 
} from '@radix-ui/react-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { db } from '../../services/firebase';
import { doc, deleteDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import '../../styles/EmployerDashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // Data States
  const [interviews, setInterviews] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPreviewJob, setSelectedPreviewJob] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, jobId: null, jobTitle: '' });
  const [editData, setEditData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // REAL-TIME INTERVIEW LISTENER
  useEffect(() => {
    if (!user?.uid) return;

    // Query interviews for this employer, ordered by date
    const q = query(
      collection(db, "interviews"),
      where("employerId", "==", user.uid),
      orderBy("scheduledTime", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const interviewList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInterviews(interviewList);
    }, (error) => {
      console.error("Interview Fetch Error:", error);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Helper to format Firebase Timestamp to "10:30 AM"
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "jobs", deleteModal.jobId));
      showToast("Listing Removed", `${deleteModal.jobTitle} deleted.`, "info");
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      showToast("Delete Failed", error.message, "error");
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, jobId: null, jobTitle: '' });
    }
  };

  const firstName = user?.displayName ? user.displayName.split(' ')[0] : "Employer";

  return (
    <div className="dashboard-container">
      <header className="db-welcome-wrapper">
        <div className="db-welcome-section">
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
        </div>

        <button 
          className="calendar-quick-access"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        >
          <div className="cal-icon-box">
            <CalendarIcon />
          </div>
          <div className="cal-text">
            <span className="cal-label">Upcoming Agenda</span>
            <span className="cal-sub">{interviews.length} events scheduled</span>
          </div>
          <ChevronRightIcon className={`arrow-transition ${isCalendarOpen ? 'rotate-90' : ''}`} />
        </button>
      </header>

      {/* DYNAMIC AGENDA DRAWER */}
      {isCalendarOpen && (
        <div className="agenda-drawer animate-in slide-in-from-top duration-300">
          {interviews.length > 0 ? (
            interviews.map((item) => (
              <div key={item.id} className="agenda-item">
                <ClockIcon />
                <p>
                  <strong>{formatTime(item.scheduledTime)}</strong> - {item.title} ({item.candidateName})
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs opacity-70 px-4">No interviews scheduled for today.</p>
          )}
        </div>
      )}

      <div className="db-stats-section">
        <StatsSection userId={user?.uid} key={`stats-${refreshTrigger}`} />
      </div>

      <div className="db-table-section">
        <div className="table-header-row">
           <div className="header-label">
              <div className="accent-line"></div>
              <span>Recent Job Listings</span>
           </div>
           <button className="new-job-btn-top" onClick={() => { setEditData(null); setIsPostModalOpen(true); }}>
              <PlusIcon /> Post New Job
           </button>
        </div>
        <div className="main-table-card">
          <JobTable 
            key={`table-${refreshTrigger}`}
            limit={5} 
            onEdit={(job) => { setEditData(job); setIsPostModalOpen(true); }} 
            onDelete={(id, title) => setDeleteModal({ isOpen: true, jobId: id, jobTitle: title })} 
            onView={(job) => setSelectedPreviewJob(job)} 
          />
        </div>
      </div>

      {/* MODALS */}
      {isPostModalOpen && (
        <PostJobModal 
          initialData={editData}
          onClose={() => { setIsPostModalOpen(false); setEditData(null); }} 
          onSuccess={() => {
            setIsPostModalOpen(false);
            setEditData(null);
            setRefreshTrigger(prev => prev + 1);
            showToast("Success", "Listing updated.", "success");
          }} 
        />
      )}

      {selectedPreviewJob && (
        <JobPreviewModal job={selectedPreviewJob} onClose={() => setSelectedPreviewJob(null)} />
      )}

      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        jobTitle={deleteModal.jobTitle}
        loading={isDeleting}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default Dashboard;