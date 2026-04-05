import React, { useState } from 'react';
import '../styles/JobLists.css';

const MOCK_JOBS = [
  { 
    id: 1, 
    title: "Full Stack Developer", 
    company: "TechFlow Systems", 
    location: "Remote", 
    type: "Full-time", 
    salary: "₱80k - ₱120k", 
    logo: "https://ui-avatars.com/api/?name=TF&background=02176d&color=fff",
    postedDate: "2 days ago",
    description: "Looking for a React and Django expert to lead our core product development. Experience with Vite and Tailwind is a plus."
  },
  { 
    id: 2, 
    title: "Senior UI/UX Designer", 
    company: "Creative Pixel", 
    location: "Manila, PH", 
    type: "Contract", 
    salary: "₱60k - ₱90k", 
    logo: "https://ui-avatars.com/api/?name=CP&background=2563eb&color=fff",
    postedDate: "Just now",
    description: "Join our design team to create beautiful, user-centric interfaces for our cross-platform job system. Portfolio required."
  },
  { 
    id: 3, 
    title: "Backend Engineer", 
    company: "DataSync Corp", 
    location: "Cebu, PH", 
    type: "Full-time", 
    salary: "Negotiable", 
    logo: "https://ui-avatars.com/api/?name=DS&background=10b981&color=fff",
    postedDate: "1 week ago",
    description: "Scale our high-traffic APIs using Django Rest Framework. Proficiency in PostgreSQL and Redis is highly desired."
  },
  
  {
  id: 4,
  title: "Sound Engineer",
  company: "AudioWave Studios",
  location: "Makati City, PH",
  type: "Full-time",
  salary: "₱50k - ₱70k",
  logo: "https://ui-avatars.com/api/?name=AW&background=ef4444&color=fff",
  postedDate: "3 days ago",
  description: "Join our team to create immersive audio experiences for our gaming clients. Experience with Pro Tools and Ableton Live is a plus."
  },
];

const JobLists = ({ onApply }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = MOCK_JOBS.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="job-lists-container">
      <div className="container mx-auto px-4">
        
        <div className="search-wrapper">
          <h1 className="text-3xl font-black text-[#02176d] mb-6 text-center">Find Your Dream Job</h1>
          <input 
            type="text" 
            placeholder="Search by job title, keyword, or company..." 
            className="search-input"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="jobs-list-stack">
          {filteredJobs.map((job) => (
            <div key={job.id} className="job-item-row" onClick={() => onApply(job)}>
              <img src={job.logo} alt={job.company} className="company-logo-square" />
              
              <div className="job-content-main">
                <div className="job-header-flex">
                  <div>
                    <h3 className="job-row-title">{job.title}</h3>
                    <p className="job-row-company">{job.company}</p>
                  </div>
                  <span className="posted-date">{job.posted}</span>
                </div>

                {/* JobStreet-style metadata rows */}
                <div className="job-details-list">
                  <div className="detail-item">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2"/></svg>
                    {job.location}
                  </div>
                  <div className="detail-item">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>
                    {job.salary}
                  </div>
                  <div className="detail-item">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"/></svg>
                    {job.type}
                  </div>
                </div>

                <p className="job-description-snippet">{job.desc}</p>

                <div className="job-row-footer">
                  <div className="flex gap-2">
                    {/* Add small skill tags if you want */}
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">React</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">Tailwind</span>
                  </div>
                  <button className="apply-btn-sm">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobLists;