import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase'; 
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import '../styles/JobLists.css';

const JobLists = ({ onApply }) => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Query uses 'isActive' to match your DB
    const q = query(
      collection(db, "jobs"),
      where("isActive", "==", true), 
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobs(jobsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Filter updated to use 'job.companyNameName' to match your DB
  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.companyNameName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-10">Searching for opportunities...</div>;

  return (
    <div className="job-lists-container">
      <div className="container mx-auto px-4">
        <div className="search-wrapper">
          <h1 className="text-3xl font-black text-[#02176d] mb-6 text-center">Find Your Dream Job</h1>
          <input 
            type="text" 
            placeholder="Search by job title, keyword, or companyNameName..." 
            className="search-input"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="jobs-list-stack">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="job-item-row" onClick={() => onApply(job)}>
                <img 
                  src={job.logo || `https://ui-avatars.com/api/?name=${job.companyName || 'Job'}&background=02176d&color=fff`} 
                  alt={job.companyName} 
                  className="companyName-logo-square" 
                />
                
                <div className="job-content-main">
                  <div className="job-header-flex">
                    <div>
                      <h3 className="job-row-title">{job.title}</h3>
                      <p className="job-row-companyName">{job.companyName}</p>
                    </div>
                    <span className="posted-date">
                      {job.createdAt?.toDate().toLocaleDateString() || "Recently"}
                    </span>
                  </div>

                  <div className="job-details-list">
                    <div className="detail-item">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth="2"/></svg>
                      {job.location}
                    </div>
                    <div className="detail-item">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>
                      {job.salaryRange || `Up to ₱${job.salary_max?.toLocaleString()}`}
                    </div>
                    <div className="detail-item">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"/></svg>
                      {job.type || "Full-time"}
                    </div>
                  </div>

                  <p className="job-description-snippet">{job.description?.substring(0, 150)}...</p>

                  <div className="job-row-footer">
                    <div className="flex gap-2">
                      {/* 3. Skills logic placed here, filtered for empty strings */}
                      {job.skills?.filter(s => s.trim() !== "").slice(0, 3).map(skill => (
                        <span key={skill} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button className="apply-btn-sm">View Details</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">No jobs found matching your criteria.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobLists;