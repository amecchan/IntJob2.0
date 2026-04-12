import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  ChatBubbleIcon, 
  DownloadIcon, 
  TrashIcon, 
  UpdateIcon, 
  ArchiveIcon, 
  BackpackIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@radix-ui/react-icons';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import ProgressTrackerCard from '../../../components/Cards/ProgressTrackerCard';
import '../../../styles/ApplicantStatus.css';

const ApplicantStatusManagement = () => {
  const { applicantId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applicantData, setApplicantData] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // These stages map to the visual labels in the ProgressTrackerCard
  const hiringStages = ["Applied", "Initial Call", "HR Evaluation", "Technical Exam", "Final Interview", "Job Offer"];
  
  // CRITICAL: This maps the hiringStages array index to the 'currentStage' string 
  // that the ApplicantDashboard uses to light up its 4-step stepper.
  const STAGE_MAP = [
    "screening",   // Applied
    "screening",   // Initial Call
    "screening",   // HR Evaluation
    "shortlisted", // Technical Exam
    "interview",   // Final Interview
    "offered"      // Job Offer
  ];

  useEffect(() => {
    if (!applicantId) return;

    const docRef = doc(db, "applications", applicantId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setApplicantData({
          ...data,
          id: applicantId,
          appliedDate: data.date ? new Date(data.date).toLocaleDateString() : "N/A",
          contact: {
            email: data.email,
            phone: data.phone || "No phone provided"
          },
          stages: hiringStages,
          currentStageIndex: data.currentStageIndex || 0,
          status: data.status || "NEW"
        });
        setRemarks(data.remarks || "");
      }
      setLoading(false);
    }, (err) => {
      console.error("Listener Error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [applicantId]);

  const handleUpdateStatus = async (newStatus) => {
    setActionLoading(true);
    try {
      const docRef = doc(db, "applications", applicantId);
      const isShortlisted = newStatus.toUpperCase() === "SHORTLISTED";
      const isRejected = newStatus.toUpperCase() === "REJECTED";

      // Prepare the update object
      const updates = {
        status: newStatus.toUpperCase(),
        updatedAt: new Date().toISOString()
      };

      if (isShortlisted) {
        // Force the progress bar to move to the 'Shortlisted' stage (Index 3: Technical Exam)
        updates.currentStageIndex = 3; 
        updates.currentStage = "shortlisted";
      } else if (isRejected) {
        // Optionally keep the index where it is but mark as screening or update status
        updates.currentStage = "screening"; 
      }

      await updateDoc(docRef, updates);
      
      alert(`Applicant successfully ${newStatus.toLowerCase()}ed.`);
    } catch (err) {
      console.error("Status Update Error:", err);
      alert("Failed to update status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMoveStage = async (direction) => {
    const currentIndex = applicantData.currentStageIndex || 0;
    let newIndex = currentIndex;

    if (direction === 'next' && currentIndex < hiringStages.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'back' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    }

    if (newIndex === currentIndex) return;

    setActionLoading(true);
    try {
      const docRef = doc(db, "applications", applicantId);
      await updateDoc(docRef, { 
        currentStageIndex: newIndex,
        // Sync the string key for the Applicant Dashboard
        currentStage: STAGE_MAP[newIndex], 
        status: newIndex === hiringStages.length - 1 ? "OFFERED" : "IN PROGRESS",
        updatedAt: new Date().toISOString() 
      });
    } catch (err) {
      console.error("Stage Update Error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveNote = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, "applications", applicantId);
      await updateDoc(docRef, { remarks: remarks });
      alert("Note saved!");
    } catch (err) {
      console.error("Error saving note:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-state">Syncing...</div>;
  if (!applicantData) return <div className="p-20 text-center">Applicant not found.</div>;

  const isShortlisted = applicantData.status?.toUpperCase() === "SHORTLISTED";

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div>
          <button onClick={() => navigate(-1)} className="back-link-styled group">
            <ArrowLeftIcon /> Back to Profile
          </button>
          <div className="mt-4">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Management Portal</h1>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
              REF: {applicantId.slice(0, 8)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="status-action-secondary" onClick={() => handleUpdateStatus("REJECTED")}>
            <ArchiveIcon /> Reject
          </button>
          <button 
            className={`status-action-primary ${isShortlisted ? '!bg-emerald-500' : ''}`}
            onClick={() => handleUpdateStatus("SHORTLISTED")}
            disabled={isShortlisted}
          >
            {isShortlisted ? <CheckIcon /> : <BackpackIcon />} 
            {isShortlisted ? "Shortlisted" : "Shortlist"}
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="applicant-info-card mb-6">
        <div className="flex items-center gap-6">
          <div className="info-icon-square">
            {applicantData.name ? applicantData.name[0] : '?'}
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div><span className="info-label">Applicant</span><span className="info-value">{applicantData.name}</span></div>
            <div><span className="info-label">Position</span><span className="info-value">{applicantData.jobTitle}</span></div>
            <div><span className="info-label">Current Stage</span><span className="info-value text-indigo-600">{hiringStages[applicantData.currentStageIndex]}</span></div>
            <div><span className="info-label">Overall Status</span><span className="info-value font-mono">{applicantData.status}</span></div>
          </div>
        </div>
      </div>

      {/* Progress Tracker with Controls */}
      <div className="mb-10">
        <div className="flex justify-end gap-2 mb-2">
            <button 
                onClick={() => handleMoveStage('back')} 
                disabled={actionLoading || applicantData.currentStageIndex === 0}
                className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
            >
                <ChevronLeftIcon />
            </button>
            <button 
                onClick={() => handleMoveStage('next')} 
                disabled={actionLoading || applicantData.currentStageIndex === hiringStages.length - 1}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
                <ChevronRightIcon />
            </button>
        </div>
        <ProgressTrackerCard 
          stages={hiringStages} 
          currentStageIndex={applicantData.currentStageIndex} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="content-card !p-8 border border-slate-50 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-4">Internal Remarks</h3>
            <textarea 
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="status-textarea w-full p-4 border rounded-xl"
              rows={6}
            />
            <button onClick={handleSaveNote} disabled={saving} className="btn-save-note mt-4">
              <UpdateIcon className={saving ? "animate-spin" : ""} />
              <span>{saving ? "Saving..." : "Update Remarks"}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="contact-container p-6 bg-slate-50 rounded-2xl">
            <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
            <button className="message-btn-styled w-full mb-3" onClick={() => navigate('/employer/dashboard/messages')}>
              <ChatBubbleIcon /> Send Message
            </button>
            <button className="download-btn-styled w-full" onClick={() => window.open(applicantData.resumeUrl, '_blank')}>
              <DownloadIcon /> View Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantStatusManagement;