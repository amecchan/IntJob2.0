import React, { useEffect, useState } from 'react';
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { db } from '../../services/firebase';
import { collection, query, where, orderBy, onSnapshot, limit as fireLimit } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

const JobTable = ({ limit = null, onEdit, onDelete, onView }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const jobsRef = collection(db, "jobs");
    const q = query(
      jobsRef, 
      where("employerId", "==", user.uid),
      orderBy("createdAt", "desc"),
      ...(limit ? [fireLimit(limit)] : [])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setJobs(jobsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Jobs Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, limit]);

  return (
    <table className="modern-table">
      <thead>
        <tr>
          <th>Job Title</th>
          <th className="text-center">Applicants</th>
          <th>Status</th>
          <th>Date Posted</th>
          <th className="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="5" className="text-center py-20 opacity-50 font-bold uppercase tracking-widest text-[10px]">
              Syncing with Database...
            </td>
          </tr>
        ) : jobs.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center py-20 text-slate-400">
              No job postings found.
            </td>
          </tr>
        ) : (
          jobs.map((job) => (
            <tr key={job.id} className="modern-row">
              <td>
                <div 
                  className="flex flex-col cursor-pointer group"
                  onClick={() => onView && onView(job)}
                >
                  <span className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors underline decoration-transparent group-hover:decoration-indigo-300 underline-offset-4">
                    {job.title}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ID: #{job.id.slice(0, 5).toUpperCase()}
                  </span>
                </div>
              </td>
              
              <td className="text-center">
                {/* Using a dedicated component to fetch the count 
                   ensures it's ALWAYS accurate and live.
                */}
                <ApplicantCounter jobId={job.id} />
              </td>
              
              <td>
                <span className={`status-pill ${job.isActive ? 'active' : 'closed'}`}>
                  {job.isActive ? 'Live' : 'Closed'}
                </span>
              </td>
              
              <td className="text-xs text-slate-400 font-bold uppercase">
                {job.createdAt?.toDate 
                  ? job.createdAt.toDate().toLocaleDateString() 
                  : 'Just now'}
              </td>
              
              <td className="text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    className="icon-btn hover:text-indigo-600"
                    title="Edit Post"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(job);
                    }}
                  >
                    <Pencil1Icon />
                  </button>
                  <button 
                    className="icon-btn hover:text-red-500"
                    title="Delete Post"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(job.id, job.title);
                    }}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

/**
 * A small helper component that listens to the applications collection
 * for a specific Job ID and displays the count in real-time.
 */
const ApplicantCounter = ({ jobId }) => {
  const [count, setCount] = useState(0);
  const { user } = useAuth(); // Need the logged-in user!

  useEffect(() => {
    if (!user) return;

    // IMPORTANT: You must filter by employerId AND jobId 
    // to satisfy the Security Rules.
    const q = query(
      collection(db, "applications"),
      where("employerId", "==", user.uid), // This "proves" to the rule you own these
      where("jobId", "==", jobId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCount(snapshot.size);
    }, (err) => {
      console.error("Counter error:", err);
    });

    return () => unsubscribe();
  }, [jobId, user]);

  return (
    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-black border border-indigo-100 min-w-[30px] inline-block">
      {count}
    </span>
  );
};

export default JobTable;