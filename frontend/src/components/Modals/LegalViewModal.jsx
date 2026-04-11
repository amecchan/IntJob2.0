import React from 'react';
import { X } from 'lucide-react';

const LegalViewModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content legal-modal-container" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body legal-scroll-area">
          {content ? (
            <div className="legal-text-content">
              {content}
            </div>
          ) : (
            <div className="muted-text-center">
              <p>No content has been published yet. Please check back later.</p>
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ borderTop: '1px solid #eee', paddingTop: '15px', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalViewModal;