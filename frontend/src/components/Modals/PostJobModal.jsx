import React, { useState, useEffect } from 'react';
import { Cross2Icon, RocketIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { createJob, updateJob } from '../../api/jobs';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Modal.css'; 
import Toast from '../ui/Toast';

const PostJobModal = ({ onClose, onSuccess, initialData }) => {
  const { user } = useAuth(); // Change token to user
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    salary_max: '',
    qualifications: '',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        location: initialData.location || '',
        salary_max: initialData.salary_max || '',
        qualifications: initialData.qualifications || '',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submissionData = {
        ...formData,
        salary_max: parseFloat(formData.salary_max) || 0,
      };

      if (isEditMode) {
        await updateJob(initialData.id, submissionData);
      } else {
        // FIX: Pass user.uid here!
        await createJob(submissionData, user.uid);
      }

      setShowToast(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showToast && (
        <Toast 
          message={isEditMode ? "Changes saved! ✨" : "Job Posted Successfully! 🚀"} 
          onClose={() => setShowToast(false)} 
        />
      )}

      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl text-white shadow-lg ${isEditMode ? 'bg-amber-500 shadow-amber-100' : 'bg-indigo-600 shadow-indigo-100'}`}>
                {isEditMode ? <Pencil1Icon className="w-5 h-5" /> : <RocketIcon className="w-5 h-5" />}
              </div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                {isEditMode ? 'Edit Job Posting' : 'Post New Opening'}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-300 hover:text-slate-500">
              <Cross2Icon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-body max-h-[70vh] overflow-y-auto pr-2">
            <div className="modal-input-group">
              <label>Job Title</label>
              <input 
                required
                className="modal-input"
                placeholder='e.g. Frontend Developer'
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="modal-input-group">
                <label>Location</label>
                <input 
                  required
                  className="modal-input"
                  placeholder='e.g. Makati City, PH'
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              
              <div className="modal-input-group">
                <label>Salary (Max)</label>
                <input 
                  required
                  type="number"
                  className="modal-input"
                  placeholder='30000'
                  value={formData.salary_max}
                  onChange={(e) => setFormData({...formData, salary_max: e.target.value})}
                />
              </div>
            </div>

            <div className="modal-input-group">
              <label>Full Job Description</label>
              <textarea 
                required
                rows="4"
                className="modal-textarea"
                placeholder='Describe the role and day-to-day tasks...'
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <div className="modal-input-group">
              <label>Key Qualifications</label>
              <textarea 
                required
                rows="3"
                className="modal-textarea"
                placeholder='List required skills or education...'
                value={formData.qualifications}
                onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`modal-submit-btn ${isEditMode ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
            >
              {loading ? 'Processing...' : (isEditMode ? 'Update Changes' : 'Launch Job Post')}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostJobModal;