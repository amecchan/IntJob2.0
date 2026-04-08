import React from 'react';
import { Cross2Icon, CalendarIcon, SewingPinFilledIcon, ShadowIcon } from '@radix-ui/react-icons';
import '../../styles/JobPreviewModal.css'; 

const JobPreviewModal = ({ job, onClose }) => {
  if (!job) return null;

  return (
    <div className="preview-modal-overlay">
      <div className="preview-modal-container">
        {/* Fixed Header */}
        <div className="preview-modal-header">
          <div className="header-badge">
            <div className="icon-wrapper">
              <ShadowIcon className="w-5 h-5" />
            </div>
            <span className="badge-text">Job Preview</span>
          </div>
          <button onClick={onClose} className="close-circle-btn">
            <Cross2Icon className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="preview-modal-scroll-area">
          <h1 className="preview-job-title">{job.title}</h1>
          
          <div className="preview-tags-row">
            <div className="preview-tag">
              <SewingPinFilledIcon className="icon-indigo" /> 
              <span>{job.location}</span>
            </div>
            <div className="preview-tag">
              <CalendarIcon className="icon-indigo" /> 
              <span>{job.createdAt?.toDate().toLocaleDateString()}</span>
            </div>
            <div className="preview-salary-tag">
              ₱{parseFloat(job.salary_max).toLocaleString()} Max
            </div>
          </div>

          <div className="preview-sections-stack">
            <section className="preview-section">
              <div className="section-label">
                <div className="accent-bar"></div>
                <h3>Description</h3>
              </div>
              <p className="section-content">
                {job.description}
              </p>
            </section>

            <section className="preview-section">
              <div className="section-label">
                <div className="accent-bar"></div>
                <h3>Key Qualifications</h3>
              </div>
              <div className="qualifications-box">
                <p className="section-content italic-slate">
                  {job.qualifications}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPreviewModal;