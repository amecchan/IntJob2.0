import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  ChatBubbleIcon, 
  DownloadIcon, 
  TrashIcon, 
  UpdateIcon, 
  ArchiveIcon, 
  BackpackIcon 
} from '@radix-ui/react-icons';
import ProgressTrackerCard from '../../components/Cards/ProgressTrackerCard';
import '../../styles/ApplicantStatus.css';

const ApplicantStatusManagement = () => {
  // applicantId comes directly from the URL path :applicantId
  const { applicantId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // In a real app, you would fetch data using the ID
  // For now, we simulate a fetch
  const [applicantData, setApplicantData] = useState(null);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const fetchApplicant = async () => {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockData = {
        name: "Juan Dela Cruz",
        position: "Frontend Developer",
        id: applicantId || "N/A",
        appliedDate: "Mar 25, 2026",
        contact: {
          email: "juan.dc@example.com",
          phone: "+63 912 345 6789"
        },
        stages: ["Applied", "Initial Call", "HR Evaluation", "Technical Exam", "Final Interview", "Job Offer"],
        currentStageIndex: 2,
        remarks: "Passed Initial Call. Recommended for technical exam after evaluation."
      };

      setApplicantData(mockData);
      setRemarks(mockData.remarks);
      setLoading(false);
    };

    if (applicantId) fetchApplicant();
  }, [applicantId]);

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center opacity-50">
        <UpdateIcon className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Profile #{applicantId}</p>
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Header with Dynamic ID */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
        <div>
          <button onClick={() => navigate(-1)} className="back-link-styled group">
            <ArrowLeftIcon /> Back to Applicant Tracker
          </button>
          <div className="mt-4">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Applicant Status</h1>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
              Detailed review for REF: {applicantId}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="status-action-secondary"><ArchiveIcon /> Reject</button>
          <button className="status-action-secondary"><TrashIcon /> Archive</button>
          <button className="status-action-primary"><BackpackIcon /> Shortlist</button>
        </div>
      </div>

      {/* 2. Key Info Card */}
      <div className="applicant-info-card mb-8">
        <div className="flex items-center gap-6">
          <div className="info-icon-square">
            {applicantData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div><span className="info-label">Applicant</span><span className="info-value text-indigo-700">{applicantData.name}</span></div>
            <div><span className="info-label">Position</span><span className="info-value">{applicantData.position}</span></div>
            <div><span className="info-label">Applied Date</span><span className="info-value text-slate-500">{applicantData.appliedDate}</span></div>
            <div><span className="info-label">Application ID</span><span className="info-value font-mono">#{applicantId}</span></div>
          </div>
        </div>
      </div>

      {/* 3. Progress Tracker */}
      <div className="mb-8">
        <ProgressTrackerCard stages={applicantData.stages} currentStageIndex={applicantData.currentStageIndex} />
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
            <button className="flex items-center gap-2 mt-6 px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              <UpdateIcon /> Save Note
            </button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <h3 className="section-title-small mb-6 !text-slate-800">Applicant Contact</h3>
            <div className="space-y-4">
              <div className="contact-item-row">{applicantData.contact.email}</div>
              <div className="contact-item-row">{applicantData.contact.phone}</div>
            </div>
            <button className="flex items-center justify-center gap-2 mt-6 w-full px-6 py-4 bg-white border border-slate-100 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all">
              <ChatBubbleIcon /> Message Applicant
            </button>
          </div>

          <button className="flex items-center justify-center gap-2 w-full px-8 py-5 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:scale-[1.02] transition-all">
            <DownloadIcon /> Download Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantStatusManagement;