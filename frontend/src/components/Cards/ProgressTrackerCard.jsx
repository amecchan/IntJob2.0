// src/components/Dashboard/ProgressTrackerCard.jsx
import React from 'react';
import '../../styles/ProgressTracker.css';

const ProgressTrackerCard = ({ stages, currentStageIndex }) => {
  if (!stages || stages.length === 0) return null;

  // activeIndex ensures we never go out of array bounds
  const activeIndex = Math.min(Math.max(currentStageIndex, 0), stages.length - 1);
  const totalStages = stages.length;
  
  // Calculate width for the connecting progress bar (e.g., 50% if on stage 3 of 6)
  const progressPercentage = (activeIndex / (totalStages - 1)) * 100;

  return (
    <div className="content-card !p-10 shadow-none border border-slate-100 bg-white rounded-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Application Progress</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Hiring Pipeline Visualization</p>
        </div>
        <div className="flex items-center gap-3 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold text-xs">
          Stage {activeIndex + 1} of {totalStages}
          <div className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-pulse"></div>
          {stages[activeIndex]}
        </div>
      </div>

      <div className="progress-timeline-wrapper relative pt-4 pb-8">
        {/* Background Line (Gray) */}
        <div className="absolute top-[34px] left-0 w-full h-[3px] bg-slate-100 hidden md:block"></div>
        
        {/* Active Progress Line (Blue/Indigo) */}
        <div 
          className="absolute top-[34px] left-0 h-[3px] bg-indigo-500 transition-all duration-700 ease-in-out hidden md:block"
          style={{ width: `${progressPercentage}%` }}
        ></div>

        <div className="timeline-items-stack flex justify-between items-start relative z-10">
          {stages.map((stage, index) => {
            const isCompleted = index < activeIndex;
            const isCurrent = index === activeIndex;

            return (
              <div key={index} className="flex flex-col items-center flex-1 group">
                {/* The Dot/Point */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-4
                  ${isCompleted ? 'bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100' : 
                    isCurrent ? 'bg-white border-indigo-500 ring-4 ring-indigo-50' : 
                    'bg-white border-slate-200'}
                `}>
                  {isCompleted ? (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className={`text-xs font-black ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {index + 1}
                    </span>
                  )}
                </div>
                
                {/* The Text Label */}
                <div className="mt-4 text-center px-2">
                   <p className={`text-[11px] font-black uppercase tracking-tighter transition-colors duration-300
                     ${isCurrent ? 'text-indigo-600 scale-110' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                     {stage}
                   </p>
                   {isCurrent && (
                     <span className="inline-block mt-1 px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded text-[9px] font-black uppercase">
                       Active
                     </span>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackerCard;