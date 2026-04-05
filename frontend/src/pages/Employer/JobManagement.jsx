{/* Job Posts */}
import React from 'react';
import JobTable from '../../components/Dashboard/JobTable';
import { MagnifyingGlassIcon, MixerHorizontalIcon, ArchiveIcon } from '@radix-ui/react-icons';
import '../../styles/JobManagement.css';

const JobManagement = () => {
  return (
    <div className="job-management-wrapper animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Job <span className="text-indigo-600">Postings</span></h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
            Review and Manage your active inventory
          </p>
        </div>

        {/* 2. Page Actions: Search & Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search listings..." 
              className="job-search-input"
            />
          </div>
          <button className="filter-btn">
            <MixerHorizontalIcon />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* 3. Stats Overview (Optional, for this page only) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="mini-stat-card">
          <span className="mini-label">Active Roles</span>
          <span className="mini-value text-indigo-600">12</span>
        </div>
        <div className="mini-stat-card">
          <span className="mini-label">Total Applicants</span>
          <span className="mini-value text-slate-800">482</span>
        </div>
        <div className="mini-stat-card">
          <span className="mini-label">Closing Soon</span>
          <span className="mini-value text-amber-500">3</span>
        </div>
      </div>

      {/* 4. The Main Table */}
      <div className="w-full transition-all">
        <JobTable />
      </div>
    </div>
  );
};

export default JobManagement;