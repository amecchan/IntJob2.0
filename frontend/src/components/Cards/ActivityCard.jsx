import React from 'react';

const ActivityCard = ({ title, children, actionText, onActionClick, variant = "white" }) => {
  const isBlue = variant === "blue";

  return (
    <div className={`rounded-[2.5rem] overflow-hidden shadow-sm border ${
      isBlue ? "bg-blue-600 border-blue-500 text-white shadow-blue-100" : "bg-white border-slate-100 text-slate-900"
    }`}>
      {title && (
        <div className={`px-8 py-6 border-b flex justify-between items-center ${
          isBlue ? "border-white/10" : "border-slate-50"
        }`}>
          <h3 className={`text-sm font-black uppercase tracking-[0.15em] ${isBlue ? "text-white" : "text-slate-800"}`}>
            {title}
          </h3>
          {actionText && (
            <button 
              onClick={onActionClick}
              className={`text-[10px] font-black tracking-widest uppercase hover:underline ${
                isBlue ? "text-blue-100" : "text-blue-600"
              }`}
            >
              {actionText}
            </button>
          )}
        </div>
      )}
      <div className={variant === "white" ? "" : "p-8"}>
        {children}
      </div>
    </div>
  );
};

export default ActivityCard;