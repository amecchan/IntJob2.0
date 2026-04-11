import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  DownloadIcon, 
  ChatBubbleIcon, 
  ArrowLeftIcon, 
  EnvelopeClosedIcon, 
  MobileIcon, 
  LaptopIcon,
  UpdateIcon 
} from '@radix-ui/react-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import '../../../styles/ApplicantProfile.css';

const ApplicantProfile = () => {
  const { applicantId } = useParams();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicantData = async () => {
      try {
        setLoading(true);
        // We fetch from the 'applications' collection as defined in your JobCategories logic
        const docRef = doc(db, "applications", applicantId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setApplicant(docSnap.data());
        } else {
          console.error("No such applicant found!");
        }
      } catch (error) {
        console.error("Error fetching applicant:", error);
      } finally {
        setLoading(false);
      }
    };

    if (applicantId) fetchApplicantData();
  }, [applicantId]);

  // --- FUNCTION: HANDLE RESUME DOWNLOAD/VIEW ---
  const handleDownloadResume = () => {
    if (applicant?.resumeUrl) {
      // Opens the resume link (PDF/Image) in a new browser tab
      window.open(applicant.resumeUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert("This applicant has not uploaded a resume.");
    }
  };

  if (loading) {
    return (
      <div className="profile-loading-state">
        <UpdateIcon className="animate-spin" />
        <p>Fetching Candidate Profile...</p>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="profile-error-state">
        <h2>Applicant Not Found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="profile-dashboard-inset animate-in fade-in duration-500">
      
      {/* Navigation & Quick Actions Header */}
      <div className="profile-top-bar">
        <button onClick={() => navigate('/employer/dashboard/view-applicants')} className="profile-back-link group">
          <ArrowLeftIcon className="group-hover:-translate-x-1 transition-transform" />
          <span>Return to Tracker</span>
        </button>

        <div className="profile-quick-actions">
          <button 
            className="profile-btn-status"
            onClick={() => navigate(`/employer/dashboard/applicants/${applicantId}/status`)}
          >
            <UpdateIcon />
            <span>Manage Status</span>
          </button>
          
          <button className="profile-btn-secondary">
            <ChatBubbleIcon />
            <span>Message</span>
          </button>
          
          {/* Resume Button with logic to handle missing URLs */}
          <button 
            className={`profile-btn-primary ${!applicant.resumeUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleDownloadResume}
            title={applicant.resumeUrl ? "View Resume" : "No resume available"}
          >
            <DownloadIcon />
            <span>Resume</span>
          </button>
        </div>
      </div>

      <div className="profile-main-layout">
        {/* Left Column: The Main Card */}
        <div className="profile-card-primary">
          <div className="profile-card-banner"></div>
          
          <div className="profile-card-body">
            <div className="profile-avatar-stack">
              <div className="profile-avatar-large">
                {applicant.name ? applicant.name.split(' ').map(n => n[0]).join('') : '?'}
              </div>
              <div className="profile-name-group">
                <h1 className="profile-display-name">{applicant.name}</h1>
                <p className="profile-display-role">{applicant.jobTitle || "Applicant"}</p>
                <span className="profile-id-tag">REF: {applicantId.slice(0, 8).toUpperCase()}</span>
              </div>
            </div>

            <div className="profile-section-divider"></div>

            <div className="profile-info-grid">
              <section>
                <h3 className="profile-label">Summary / Bio</h3>
                <p className="profile-text-content">
                  {applicant.bio || "No biography provided by the applicant."}
                </p>
              </section>

              <section>
                <h3 className="profile-label">Technical Competencies</h3>
                <div className="profile-skill-wrap">
                  {applicant.skills && applicant.skills.length > 0 ? (
                    applicant.skills.map((skill, i) => (
                      <span key={i} className="profile-skill-chip">{skill}</span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-xs">No skills listed</span>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Stats */}
        <div className="profile-card-sidebar">
          <div className="profile-contact-box">
            <h3 className="profile-label !text-slate-800">Contact Details</h3>
            <div className="profile-contact-links">
              <div className="contact-item">
                <EnvelopeClosedIcon /> <span>{applicant.email}</span>
              </div>
              <div className="contact-item">
                <MobileIcon /> <span>{applicant.phone || "No phone provided"}</span>
              </div>
              {applicant.portfolio && (
                <div className="contact-item">
                  <LaptopIcon /> <span>{applicant.portfolio}</span>
                </div>
              )}
            </div>
          </div>

          <div className="profile-stat-blocks">
            <div className="stat-mini-card">
              <span className="stat-mini-label">Experience</span>
              <span className="stat-mini-value">{applicant.experience || "N/A"}</span>
            </div>
            <div className="stat-mini-card">
              <span className="stat-mini-label">Education</span>
              <span className="stat-mini-value">{applicant.education || "N/A"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;