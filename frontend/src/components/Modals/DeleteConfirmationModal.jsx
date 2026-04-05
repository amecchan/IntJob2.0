import React from 'react';
import { Cross2Icon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import '../../styles/DeleteConfirmationModal.css';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, jobTitle, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="delete-modal-container">
        <div className="delete-modal-content">
          <div className="warning-icon-wrapper">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
          </div>

          <h3 className="delete-title">Delete Job Posting?</h3>
          
          <p className="delete-description">
            You are about to delete <span className="target-job-name">"{jobTitle}"</span>. 
            This will permanently remove all applicant data. This action cannot be undone.
          </p>

          <div className="delete-actions">
            <button 
              onClick={onConfirm} 
              disabled={loading} 
              className="btn-confirm-delete"
            >
              {loading ? "Processing..." : "Yes, Delete Post"}
            </button>
            
            <button 
              onClick={onClose} 
              className="btn-cancel-delete"
            >
              No, Keep It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;