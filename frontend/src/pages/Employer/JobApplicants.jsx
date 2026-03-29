import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, PersonIcon, EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { useAuth } from '../../contexts/AuthContext';
// import { fetchApplicantsByJob } from '../../api/jobs'; // You'll create this API helper

const JobApplicants = () => {
  const { jobId } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplicants = async () => {
      try {
        // const data = await fetchApplicantsByJob(jobId, token);
        // setApplicants(data);
        
        // Mock data for now so you can see the UI
        setApplicants([
          { id: 101, name: "Juan Dela Cruz", email: "juan@example.com", status: "Pending" },
          { id: 102, name: "Maria Clara", email: "clara@example.com", status: "Reviewed" }
        ]);
      } catch (err) {
        console.error("Error loading applicants:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) loadApplicants();
  }, [jobId, token]);

  return (
    <div className="p-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium text-sm"
      >
        <ChevronLeftIcon /> Back to Job Posts
      </button>

      <div className="content-card">
        <div className="card-header">
          <h2 className="text-xl font-black text-slate-800">Applicants for Job #{jobId}</h2>
        </div>

        <div className="card-body">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th className="table-head-text">Applicant Name</th>
                <th className="table-head-text">Contact</th>
                <th className="table-head-text">Status</th>
                <th className="table-head-text text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app) => (
                <tr key={app.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-full"><PersonIcon /></div>
                      <span className="font-bold text-slate-700">{app.name}</span>
                    </div>
                  </td>
                  <td className="table-cell text-slate-500">
                    <div className="flex items-center gap-2"><EnvelopeClosedIcon /> {app.email}</div>
                  </td>
                  <td className="table-cell">
                    <span className="status-badge bg-blue-50 text-blue-600">{app.status}</span>
                  </td>
                  <td className="table-cell text-right">
                    <button 
                      onClick={() => navigate(`/dashboard/applicants/${app.id}`)}
                      className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobApplicants;