import React, { useState } from 'react';
import { ChevronDownIcon } from '@radix-ui/react-icons';

const StatusBadge = ({ currentStatus, onUpdate, loading }) => {
  const [isOpen, setIsOpen] = useState(false);

  const statuses = [
    { label: 'New', color: 'bg-blue-100 text-blue-600' },
    { label: 'Shortlisted', color: 'bg-green-100 text-green-600' },
    { label: 'Rejected', color: 'bg-red-100 text-red-600' },
    { label: 'Interviewing', color: 'bg-amber-100 text-amber-600' }
  ];

  const handleSelect = (status) => {
    onUpdate(status);
    setIsOpen(false);
  };

  const activeStyle = statuses.find(s => s.label === currentStatus)?.color || 'bg-slate-100';

  return (
    <div className="relative inline-block text-left">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all hover:brightness-95 ${activeStyle}`}
      >
        {loading ? '...' : currentStatus}
        <ChevronDownIcon className="w-3 h-3" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-32 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in duration-150">
          {statuses.map((s) => (
            <button
              key={s.label}
              onClick={() => handleSelect(s.label)}
              className="w-full text-left px-4 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors border-b last:border-0 border-slate-50"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusBadge;