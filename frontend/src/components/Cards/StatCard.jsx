import React from 'react';

const StatCard = ({ label, value, trend, icon, color, bg }) => {
  return (
    <div className="stat-card-container group">
      {/* Header: Icon and Live View Badge */}
      <div className="flex justify-between items-start mb-5">
        <div className={`stat-icon-wrapper ${bg} ${color}`}>
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        <span className="live-view-badge">
          Live View
        </span>
      </div>

      {/* Content: Value and Label */}
      <div className="space-y-1">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-label">{label}</p>
      </div>
      
      {/* Footer: Trend + Sparkline Decoration */}
        <div className="stat-footer flex justify-between items-center">
            <p className={`stat-trend ${color}`}>{trend}</p>
            
            {/* Simple Sparkline SVG Decoration */}
            <svg className="w-12 h-6 opacity-40" viewBox="0 0 40 20">
                <path 
                d="M0 15 L10 5 L20 12 L30 2 L40 10" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                className={color}
                />
            </svg>
        </div>
    </div>
  );
};

export default StatCard;