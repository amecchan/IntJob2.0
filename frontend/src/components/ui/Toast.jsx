import React, { useEffect } from 'react';
import { CheckCircledIcon, Cross2Icon } from '@radix-ui/react-icons';

const Toast = ({ message, onClose, type = 'success' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Auto-close after 4 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 z-10000 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border ${
        type === 'success' 
          ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
          : 'bg-red-50 border-red-100 text-red-800'
      }`}>
        <CheckCircledIcon className="w-5 h-5 text-emerald-500" />
        <p className="text-sm font-bold">{message}</p>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          <Cross2Icon />
        </button>
      </div>
    </div>
  );
};

export default Toast;