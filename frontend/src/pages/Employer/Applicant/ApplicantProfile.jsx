import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileTextIcon, DownloadIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import '../../../styles/ApplicantProfile.css';

const ApplicantProfile = () => {
  const { applicantId } = useParams();
  const navigate = useNavigate();

  // Mock data for the UI
  const applicant = {
    name: "Juan Dela Cruz",
    role: "Frontend Developer",
    email: "juan.dc@example.com",
    phone: "+63 912 345 6789",
    bio: "Senior developer specializing in React and modern UI architectures. Focused on creating accessible and performant web applications.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Figma"],
    experience: "4 Years",
    education: "BS Computer Science"
  };

  return (
    /* This wrapper ensures the content starts below your TopNav */
    <div className="profile-dashboard-inset animate-in fade-in duration-500">
      
      {/* Navigation & Quick Actions Header */}
      <div className="profile-top-bar">
        <button onClick={() => navigate(-1)} className="profile-back-link group">
          <ArrowLeftIcon className="group-hover:-translate-x-1 transition-transform" />
          <span>Return to Tracker</span>
        </button>

        <div className="profile-quick-actions">
          <button className="profile-btn-secondary">
            <ChatBubbleIcon />
            <span>Message</span>
          </button>
          <button className="profile-btn-primary">
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
                {applicant.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="profile-name-group">
                <h1 className="profile-display-name">{applicant.name}</h1>
                <p className="profile-display-role">{applicant.role}</p>
                <span className="profile-id-tag">REF: {applicantId}</span>
              </div>
            </div>

            <div className="profile-section-divider"></div>

            <div className="profile-info-grid">
              <section>
                <h3 className="profile-label">Summary</h3>
                <p className="profile-text-content">{applicant.bio}</p>
              </section>

              <section>
                <h3 className="profile-label">Technical Competencies</h3>
                <div className="profile-skill-wrap">
                  {applicant.skills.map((skill, i) => (
                    <span key={i} className="profile-skill-chip">{skill}</span>
                  ))}
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
                <MobileIcon /> <span>{applicant.phone}</span>
              </div>
              <div className="contact-item">
                <LaptopIcon /> <span>Portfolio: juandc.io</span>
              </div>
            </div>
          </div>

          <div className="profile-stat-blocks">
            <div className="stat-mini-card">
              <span className="stat-mini-label">Experience</span>
              <span className="stat-mini-value">{applicant.experience}</span>
            </div>
            <div className="stat-mini-card">
              <span className="stat-mini-label">Education</span>
              <span className="stat-mini-value">{applicant.education}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;