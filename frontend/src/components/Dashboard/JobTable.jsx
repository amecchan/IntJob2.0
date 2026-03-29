import React, { useEffect, useState } from 'react';
import { FileTextIcon, PlusIcon, UpdateIcon, TrashIcon, Pencil1Icon } from '@radix-ui/react-icons';
import { fetchEmployerJobs, deleteJob } from '../../api/jobs';
import { useAuth } from '../../contexts/AuthContext';
import PostJobModal from '../Modals/PostJobModal';
import DeleteConfirmationModal from '../Modals/DeleteConfirmationModal';
import '../../styles/JobTable.css';

const JobTable = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editJobData, setEditJobData] = useState(null); // Track job being edited
  const [deleteModal, setDeleteModal] = useState({ open: false, jobId: null, jobTitle: '' });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchEmployerJobs(token);
      setJobs(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadJobs();
  }, [token]);

  // --- DELETE LOGIC ---
  const triggerDelete = (id, title) => {
    setDeleteModal({ open: true, jobId: id, jobTitle: title });
  };

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteJob(deleteModal.jobId, token);
      setJobs(jobs.filter(j => j.id !== deleteModal.jobId));
      setDeleteModal({ open: false, jobId: null, jobTitle: '' });
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // --- EDIT LOGIC ---
  const triggerEdit = (job) => {
    setEditJobData(job); // Set the specific job object to pass to modal
  };

  return (
    <div className="content-card">
      <div className="card-header">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <FileTextIcon className="text-indigo-600 w-5 h-5" />
          </div>
          Job Postings
        </h2>
        <button 
          onClick={() => setIsPostModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white pl-3 pr-5 py-2 rounded-xl font-bold text-xs transition-all shadow-lg shadow-indigo-100 active:scale-95 whitespace-nowrap"
          >
          <PlusIcon className="w-8 h-6" />
          <span>Post New Job</span>
        </button>
      </div>

      <div className="card-body">
        <div className="overflow-x-auto">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th className="table-head-text w-[35%]">Job Title</th>
                <th className="table-head-text w-[15%] text-center">Applicants</th>
                <th className="table-head-text w-[15%]">Status</th>
                <th className="table-head-text w-[20%]">Date Posted</th>
                <th className="w-[15%] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <UpdateIcon className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-2" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing...</span>
                  </td>
                </tr>
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id} className="table-row group">
                    <td className="table-cell text-sm font-bold text-slate-700">{job.title}</td>
                    <td className="table-cell text-sm text-slate-500 font-medium text-center">{job.applicant_count || 0}</td>
                    <td className="table-cell">
                      <span className={`status-badge ${job.is_active ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                        {job.is_active ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td className="table-cell text-sm text-slate-400 font-medium">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                    <td className="table-cell text-right">
                      <div className="flex justify-end gap-1">
                        {/* Edit Button */}
                        <button 
                          onClick={() => triggerEdit(job)}
                          className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Edit Post"
                        >
                          <Pencil1Icon className="w-5 h-5" />
                        </button>
                        {/* Delete Button */}
                        <button 
                          onClick={() => triggerDelete(job.id, job.title)}
                          className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Post"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-slate-400 italic">No job posts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post/Edit Modal Integration */}
      {(isPostModalOpen || editJobData) && (
        <PostJobModal 
          initialData={editJobData} // If this is set, the modal behaves as "Edit"
          onClose={() => {
            setIsPostModalOpen(false);
            setEditJobData(null);
          }} 
          onSuccess={() => {
            setIsPostModalOpen(false);
            setEditJobData(null);
            loadJobs();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ ...deleteModal, open: false })}
        onConfirm={confirmDelete}
        jobTitle={deleteModal.jobTitle}
        loading={deleteLoading}
      />
    </div>
  );
};

export default JobTable;