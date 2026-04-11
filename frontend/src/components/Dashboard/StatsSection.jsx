import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebase'; // Check this path!
import { collection, getDocs, query, where } from 'firebase/firestore';
import { FileTextIcon, PersonIcon, ClockIcon } from '@radix-ui/react-icons';
import { useAuth } from '../../contexts/AuthContext'; // Check this path!
import '../../styles/StatsSection.css'; // If the CSS is in the SAME folder, use this

const StatsSection = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ jobs: 0, applicants: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if db and user exist before running to prevent crashes
    if (!user || !db) return;

    const getStats = async () => {
      try {
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
        console.error("Firestore Stats Error:", err);
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, [user]);

  const stats = [
    { label: 'Total Job Posts', value: counts.jobs, icon: <FileTextIcon />, color: '#4f46e5', bg: '#eef2ff' },
    { label: 'Active Applicants', value: counts.applicants, icon: <PersonIcon />, color: '#9333ea', bg: '#f5f3ff' },
    { label: 'Pending Reviews', value: counts.pending, icon: <ClockIcon />, color: '#d97706', bg: '#fffbeb' },
  ];

  return (
    <div className="stats-grid-wrapper">
      {stats.map((stat, i) => (
        <div key={i} className="stat-card-modern">
          <div className="stat-icon-box" style={{ backgroundColor: stat.bg, color: stat.color }}>
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