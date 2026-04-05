import React from 'react';
import StatsSection from '../../components/Dashboard/StatsSection';
import JobTable from '../../components/Dashboard/JobTable';
import { PlusIcon, ActivityLogIcon } from '@radix-ui/react-icons';

const Dashboard = () => {
  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ">
      {/* Stats Cards Section */}
      <div className="mb-10">
        <StatsSection />
      </div>

      {/* Main Table Section: Responsive Container */}
      <div className="w-full">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-[2px] w-12 bg-indigo-600/20"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Recent Job Listings
          </span>
        </div>
        
        {/* Overflow-x-auto allows the table to scroll horizontally on small phones */}
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <JobTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;