import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FileTextIcon, PersonIcon, ClockIcon } from '@radix-ui/react-icons';
import { useAuth } from '../../contexts/AuthContext'; // Added this

const StatsSection = () => {
  const { user } = useAuth(); // Get the current user
  const [counts, setCounts] = useState({ jobs: 0, applicants: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      if (!user) return; // Don't fetch if no user is logged in

      try {
        // FIX: You must query using employerId to satisfy security rules
        const jobsQuery = query(collection(db, "jobs"), where("employerId", "==", user.uid));
        const appsQuery = query(collection(db, "applications"), where("employerId", "==", user.uid));
        
        const [jobsSnap, appsSnap] = await Promise.all([
          getDocs(jobsQuery),
          getDocs(appsQuery)
        ]);
        
        const pendingCount = appsSnap.docs.filter(doc => doc.data().status === 'NEW').length;

        setCounts({
          jobs: jobsSnap.size,
          applicants: appsSnap.size,
          pending: pendingCount
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, [user]); // Re-run if user changes

  const stats = [
    { label: 'Total Job Posts', value: counts.jobs, icon: <FileTextIcon />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Applicants', value: counts.applicants, icon: <PersonIcon />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending Reviews', value: counts.pending, icon: <ClockIcon />, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="stats-grid-wrapper">
      {stats.map((stat, i) => (
        <div key={i} className="stat-card-modern">
          <div className={`stat-icon-box ${stat.bg} ${stat.color}`}>
            {stat.icon}
          </div>
          <div className="stat-info">
            <span className="stat-number">{loading ? "..." : stat.value}</span>
            <span className="stat-name">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsSection;