import React from 'react';
import StatsSection from '../../components/Dashboard/StatsSection';
import JobTable from '../../components/Dashboard/JobTable';
import { PlusIcon, LightningBoltIcon } from '@radix-ui/react-icons';

const Dashboard = () => {
  return (
    <div className="dashboard-container dashboard-slide-up">
      {/* 1. Page Header (Inside the Dashboard) */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-white/70 text-[10px] font-black uppercase tracking-[0.3em] mb-1">Overview</h2>
          <h1 className="text-2xl font-black text-white tracking-tight">Recruitment Console</h1>
        </div>
        
        <div className="flex gap-3">
           <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all backdrop-blur-md">
            <LightningBoltIcon className="w-4 h-4" />
            Quick Report
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-xl shadow-indigo-900/20 active:scale-95">
            <PlusIcon className="w-5 h-5" />
            Post New Job
          </button>
        </div>
      </div>

      {/* 2. Floating Stats */}
      <StatsSection />

      {/* 3. Main Content Area */}
        <div className="w-full mt-8"> 
        {/* Removing grid-cols-1 and using w-full ensures it stretches */}
            <JobTable />
        </div>
    </div>
  );
};

export default Dashboard;