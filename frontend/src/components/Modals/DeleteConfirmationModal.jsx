import React from 'react';
import { TrashIcon, Cross2Icon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import '../../styles/Modal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, jobTitle, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-red-50 p-3 rounded-full">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <Cross2Icon className="w-5 h-5" />
            </button>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Job Posting?</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">
            Are you sure you want to delete <span className="font-bold text-slate-800">"{jobTitle}"</span>? 
            This action will remove all applicant data associated with this post and cannot be undone.
          </p>

          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-100 disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;