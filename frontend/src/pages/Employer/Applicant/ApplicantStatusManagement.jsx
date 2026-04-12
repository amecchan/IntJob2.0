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
  CheckIcon
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

  const hiringStages = ["Applied", "Initial Call", "HR Evaluation", "Technical Exam", "Final Interview", "Job Offer"];
  const STAGE_MAP = [
  "screening",   // Applied
  "screening",   // Initial Call
  "screening",   // HR Evaluation
  "shortlisted", // Technical Exam
  "interview",   // Final Interview
  "offered"      // Job Offer
];

  // Use onSnapshot for real-time updates so the UI reacts immediately to status changes
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

  // --- FUNCTION: UPDATE STATUS (Shortlist, Reject, Archive) ---
  const handleUpdateStatus = async (newStatus) => {
  setActionLoading(true);
  try {
    const docRef = doc(db, "applications", applicantId);
    const isShortlisted = newStatus.toUpperCase() === "SHORTLISTED";

    await updateDoc(docRef, { 
      status: newStatus.toUpperCase(),
      // Syncing the stage string so the Applicant Stepper lights up
      currentStage: isShortlisted ? "shortlisted" : "screening",
      // CRITICAL: This triggers the Applicant Dashboard listener
      updatedAt: new Date().toISOString() 
    });
    alert(`Applicant successfully ${newStatus.toLowerCase()}ed.`);
  } catch (err) {
    console.error("Status Update Error:", err);
    alert("Failed to update status.");
  } finally {
    setActionLoading(false);
  }
};

  const handleSaveNote = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, "applications", applicantId);
      await updateDoc(docRef, { remarks: remarks });
      alert("Note saved successfully!");
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Failed to save note.");
    } finally {
      setSaving(false);
    }
  };

  // --- FUNCTION: MOVE STAGE (Next/Back) ---
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
      // Map the array index to the string the Applicant Dashboard uses
      currentStage: STAGE_MAP[newIndex], 
      status: newIndex === hiringStages.length - 1 ? "OFFERED" : "IN PROGRESS",
      updatedAt: new Date().toISOString() 
    });
  } catch (err) {
    console.error("Stage Update Error:", err);
    alert("Failed to update hiring stage.");
  } finally {
    setActionLoading(false);
  }
};

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center opacity-50">
        <UpdateIcon className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Syncing Profile #{applicantId?.slice(0,6)}
        </p>
      </div>
    );
  }

  if (!applicantData) return <div className="p-20 text-center">Applicant data not found.</div>;

  const isShortlisted = applicantData.status?.toUpperCase() === "SHORTLISTED";

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div>
          <button onClick={() => navigate(-1)} className="back-link-styled group">
            <ArrowLeftIcon className="transition-transform group-hover:-translate-x-1" /> Back to Profile
          </button>
          <div className="mt-4">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Applicant Status</h1>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
              Hiring Pipeline for REF: {applicantId.slice(0, 8)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            className="status-action-secondary" 
            onClick={() => handleUpdateStatus("REJECTED")}
            disabled={actionLoading}
          >
            <ArchiveIcon /> Reject
          </button>
          <button 
            className="status-action-secondary"
            onClick={() => handleUpdateStatus("ARCHIVED")}
            disabled={actionLoading}
          >
            <TrashIcon /> Archive
          </button>
          <button 
            className={`status-action-primary ${isShortlisted ? '!bg-emerald-500 !shadow-emerald-100' : ''}`}
            onClick={() => handleUpdateStatus("SHORTLISTED")}
            disabled={actionLoading || isShortlisted}
          >
            {isShortlisted ? <CheckIcon /> : <BackpackIcon />} 
            {isShortlisted ? "Shortlisted" : "Shortlist"}
          </button>
        </div>
      </div>

      {/* 2. Key Info Card */}
      <div className="applicant-info-card mb-10">
        <div className="flex items-center gap-6">
          <div className="info-icon-square">
            {applicantData.name ? applicantData.name.split(' ').map(n => n[0]).join('') : '?'}
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div><span className="info-label">Applicant</span><span className="info-value text-indigo-700">{applicantData.name}</span></div>
            <div><span className="info-label">Position</span><span className="info-value">{applicantData.jobTitle}</span></div>
            <div><span className="info-label">Applied Date</span><span className="info-value text-slate-500">{applicantData.appliedDate}</span></div>
            <div><span className="info-label">Application Status</span><span className="info-value font-mono text-indigo-500">{applicantData.status}</span></div>
          </div>
        </div>
      </div>

      {/* 3. Progress Tracker */}
      <div className="mb-4">
        <ProgressTrackerCard 
          stages={hiringStages} 
          currentStageIndex={applicantData.currentStageIndex} 
        />
      </div>

      {/* 4. Notes and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="content-card !p-8 border border-slate-50 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-800">HR Remarks & Notes</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Internal documentation only</p>
            </div>
            <textarea 
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Write or update remarks here..."
              className="status-textarea"
              rows={8}
            />
            <button 
              onClick={handleSaveNote}
              disabled={saving}
              className="btn-save-note"
            >
              {saving ? <UpdateIcon className="animate-spin" /> : <UpdateIcon />}
              <span>{saving ? "Saving..." : "Save Note"}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="contact-container">
            <h3 className="section-title-small mb-2">Applicant Contact</h3>
            <div className="space-y-3">
              <div className="contact-item-row">{applicantData.contact.email}</div>
              <div className="contact-item-row">{applicantData.contact.phone}</div>
            </div>
            <button className="message-btn-styled" onClick={() => navigate('/employer/dashboard/messages')}>
              <ChatBubbleIcon /> Message Applicant
            </button>
            <button className="download-btn-styled" onClick={() => window.open(applicantData.resumeUrl, '_blank')}>
              <DownloadIcon /> Download Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantStatusManagement;