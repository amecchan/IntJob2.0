// src/components/Dashboard/ProgressTrackerCard.jsx
import React from 'react';
import '../../styles/ProgressTracker.css';

const ProgressTrackerCard = ({ stages, currentStageIndex }) => {
  // Simple check to prevent errors
  if (!stages || stages.length === 0) return null;

  // Ensure current index is within bounds
  const activeIndex = Math.min(Math.max(currentStageIndex, 0), stages.length - 1);
  const totalStages = stages.length;

  return (
    <div className="content-card !p-10 shadow-none border border-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Application Progress</h2>
        <div className="flex items-center gap-3 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold text-xs">
          Stage {activeIndex + 1} of {totalStages}
          <div className="w-1 h-1 bg-indigo-300 rounded-full"></div>
          {stages[activeIndex]}
        </div>
      </div>

      <div className="progress-timeline-wrapper">
        {/* The horizontal blue background line */}
        <div className="timeline-line-bg"></div>

        <div className="timeline-items-stack">
          {stages.map((stage, index) => {
            const isCompleted = index < activeIndex;
            const isCurrent = index === activeIndex;
            const isLast = index === totalStages - 1;

            return (
              <div key={index} className={`timeline-step ${isCompleted ? 'step-completed' : ''} ${isCurrent ? 'step-current' : ''}`}>
                <div className="step-point-outer">
                  {/* Shows checkmark if completed */}
                  {isCompleted ? (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <div className="step-point-inner"></div>
                  )}
                </div>
                
                <div className="step-label-wrapper">
                   <p className="step-title">{stage}</p>
                   {/* Optional: Add date if available in mock data */}
                   {isCompleted && <p className="step-date">Mar 22, 2026</p>}
                </div>

                {/* Vertical line for mobile view */}
                {!isLast && <div className="vertical-connector md:hidden"></div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackerCard;