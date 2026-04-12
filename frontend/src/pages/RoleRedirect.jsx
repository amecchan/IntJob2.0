import React from 'react';
import { Navigate } from 'react-router-dom';
// --- ADD THIS IMPORT ---
import { useAuth } from '../contexts/AuthContext'; 

const RoleRedirect = () => {
  // This was failing because useAuth wasn't imported!
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Verifying your role...</p>
      </div>
    );
  }

if (!user) return <Navigate to="/" replace />;

  // --- UPDATED REDIRECT LOGIC ---
  if (userRole === 'employer') {
    return <Navigate to="/employer/dashboard" replace />;
  }

  if (userRole === 'applicant') {
    // Change this path to /applicant/survey to meet your requirement
    return <Navigate to="/applicant/survey" replace />;
  }

  if (userRole === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Navigate to="/" replace />;
};

export default RoleRedirect;