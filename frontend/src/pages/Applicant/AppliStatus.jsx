import React, { useState } from 'react';
import { 
  EnvelopeClosedIcon, 
  MobileIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  CheckCircledIcon,
  ClockIcon
} from '@radix-ui/react-icons';
import "../../styles/Applicant/AppliStatus.css";

const ApplicationStatus = () => {
  const userName = "Juan Dela Cruz"; 

  const [applications, setApplications] = useState([
    {
      id: "INTJOB-2025-0088",
      position: "Front-End Developer",
      dateApplied: "October 16, 2025",
      status: "Under Review", // Status is here
      progress: 40,
      isOpen: true, 
      remarks: "We have reviewed your application and found your skills promising. Please prepare for your technical interview.",
      interviewDate: "Oct 21, 2025 (10:00 AM)",
      recruiter: "Ryan Bang",
    },
    {
      id: "INTJOB-2025-0092",
      position: "UI/UX Designer",
      dateApplied: "October 18, 2025",
      status: "Pending", // Status is here
      progress: 15,
      isOpen: false,
      remarks: "Initial screening in progress.",
      interviewDate: "TBD",
      recruiter: "Vice Ganda",
    }
  ]);

  const toggleCard = (id) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, isOpen: !app.isOpen } : app
    ));
  };

  return (
    <div className="status-view-wrapper">
      <div className="status-container">
        <h2 className="status-main-title">My Applications</h2>
        
        {applications.map((app) => (
          <div key={app.id} className={`status-card ${app.isOpen ? 'expanded' : 'collapsed'}`}>
            
            <div className="status-header-summary" onClick={() => toggleCard(app.id)}>
              <div className="info-header-grid">
                <div className="header-box user-name-box">
                  <span>Name:</span>
                  <p>{userName}</p>
                </div>
                <div className="header-box">
                  <span>Position Applied:</span>
                  <p className="highlight-text">{app.position}</p>
                </div>
                
                {/* --- ETO YUNG DINAGDAG NATIN SA SUMMARY VIEW --- */}
                <div className="header-box status-summary-box">
                  <span>Status:</span>
                  <p>
                    <span className={`status-pill ${app.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {app.status}
                    </span>
                  </p>
                </div>
                {/* ---------------------------------------------- */}

                <div className="header-box hide-mobile">
                  <span>Application ID:</span>
                  <p>{app.id}</p>
                </div>
                <div className="header-box hide-mobile">
                  <span>Date Applied:</span>
                  <p>{app.dateApplied}</p>
                </div>
                <div className="header-icon">
                  {app.isOpen ? <ChevronUpIcon width="20" height="20" /> : <ChevronDownIcon width="20" height="20" />}
                </div>
              </div>

              <div className="mini-progress-bar">
                <div className="progress-fill" style={{ width: `${app.progress}%` }}></div>
              </div>
            </div>

            {app.isOpen && (
              <div className="status-details-content animated-fade-in">
                {/* Pwede mo nang alisin o panatilihin itong block sa baba depende sa trip mong design */}
                <div className="status-progress-block">
                  <p className="progress-subtext">Progress: {app.progress}% completed</p>
                </div>

                <div className="timeline-grid">
                  <div className="timeline-box">
                    <span><CheckCircledIcon /> Submitted:</span>
                    <p>{app.dateApplied}</p>
                  </div>
                  <div className="timeline-box">
                    <span><ClockIcon /> Interview Schedule:</span>
                    <p>{app.interviewDate}</p>
                  </div>
                </div>

                <div className="details-stack">
                  <div className="section-block">
                    <h4>HR Remarks</h4>
                    <p className="remarks-text">{app.remarks}</p>
                  </div>

                  <div className="section-block recruiter-info">
                    <h4>Recruiter Contact</h4>
                    <p><strong>{app.recruiter}</strong> – HR Specialist</p>
                    <div className="contact-info">
                      <span><EnvelopeClosedIcon /> hr@intjob.ph</span>
                      <span><MobileIcon /> 0917-555-9878</span>
                    </div>
                  </div>
                </div>

                <div className="action-footer">
                  <button className="btn-withdraw">Withdraw Application</button>
                  <button className="btn-update">Update Documents</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationStatus;