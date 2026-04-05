import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileTextIcon, PlusIcon, TrashIcon, Pencil1Icon, ArrowRightIcon } from '@radix-ui/react-icons';
import { fetchEmployerJobs, deleteJob } from '../../api/jobs';
import { useAuth } from '../../contexts/AuthContext';
import PostJobModal from '../Modals/PostJobModal';
import DeleteConfirmationModal from '../Modals/DeleteConfirmationModal';
import '../../styles/JobTable.css';

const JobTable = ({ limit = null, hideHeader = false }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editJobData, setEditJobData] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, jobId: null, jobTitle: '' });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchEmployerJobs(token);
      // If a limit is provided (e.g., 5 for dashboard), slice the array
      setJobs(limit ? data.slice(0, limit) : data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  useEffect(() => {
    if (token) loadJobs();
  }, [token, limit]);

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

  const triggerEdit = (job) => {
    setEditJobData(job);
  };

  const SkeletonRow = () => (
    <tr className="skeleton-row">
      <td className="py-6"><div className="skeleton-line w-3/4"></div></td>
      <td className="py-6"><div className="skeleton-line w-12 mx-auto"></div></td>
      <td className="py-6"><div className="skeleton-line w-20 rounded-full"></div></td>
      <td className="py-6"><div className="skeleton-line w-24"></div></td>
      <td className="py-6"><div className="skeleton-line w-16 ml-auto"></div></td>
    </tr>
  );

  return (
    <div className={`content-card ${!hideHeader ? 'shadow-2xl shadow-indigo-900/5' : 'border-none shadow-none bg-transparent'}`}>
      {!hideHeader && (
        <div className="card-header">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                <FileTextIcon className="text-white w-5 h-5" />
              </div>
              Job Postings
            </h2>
            <p className="text-[11px] font-bold text-slate-400 mt-1 ml-[52px] uppercase tracking-wider">Manage your active listings</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Show "View All" button only if we are limiting results (Dashboard mode) */}
            {limit && (
              <button 
                onClick={() => navigate('/employer/dashboard/jobs')}
                className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all"
              >
                View All <ArrowRightIcon />
              </button>
            )}
            <button onClick={() => setIsPostModalOpen(true)} className="post-job-btn">
              <PlusIcon />
              <span>Post New Job</span>
            </button>
          </div>
        </div>
      )}

      <div className="card-body">
        <div className="overflow-x-auto">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th className="table-head-text w-[35%]">Job Title</th>
                <th className="table-head-text w-[15%] text-center">Applicants</th>
                <th className="table-head-text w-[15%]">Status</th>
                <th className="table-head-text w-[20%]">Date Posted</th>
                <th className="w-[15%] text-right table-head-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  <SkeletonRow /><SkeletonRow /><SkeletonRow />
                </>
              ) : jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id} className="table-row group">
                    <td className="table-cell">
                      <div className="flex flex-col cursor-pointer" onClick={() => navigate(`/employer/dashboard/jobs/${job.id}/applicants`)}>
                        <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{job.title}</span>
                        <span className="text-[10px] text-slate-400 font-medium">ID: #{job.id.toString().slice(-5)}</span>
                      </div>
                    </td>
                    <td className="table-cell text-center">
                      <button 
                        onClick={() => navigate(`/employer/dashboard/jobs/${job.id}/applicants`)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-600 text-xs font-bold border border-slate-100 hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        {job.applicant_count || 0}
                      </button>
                    </td>
                    <td className="table-cell">
                      <span className={`status-badge ${job.is_active ? 'active-badge' : 'closed-badge'}`}>
                        <div className={`w-1 h-1 rounded-full mr-2 ${job.is_active ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                        {job.is_active ? 'Active' : 'Closed'}
                      </span>
                    </td>
                    <td className="table-cell text-xs text-slate-400 font-bold uppercase tracking-tight">
                      {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="table-cell text-right">
                      <div className="action-btn-container">
                        <button onClick={() => triggerEdit(job)} className="action-icon-btn btn-edit"><Pencil1Icon /></button>
                        <button onClick={() => triggerDelete(job.id, job.title)} className="action-icon-btn btn-delete"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <FileTextIcon className="w-12 h-12 mb-4 text-slate-300" />
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No listings found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(isPostModalOpen || editJobData) && (
        <PostJobModal 
          initialData={editJobData} 
          onClose={() => { setIsPostModalOpen(false); setEditJobData(null); }} 
          onSuccess={() => { setIsPostModalOpen(false); setEditJobData(null); loadJobs(); }}
        />
      )}

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