import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import { auth } from '../services/firebase';

const ProtectedRoute = ({ allowedRole, children }) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyStatus = async () => {
      if (user) {
        // Force Firebase to refresh the user token to get the latest emailVerified status
        await auth.currentUser?.reload();
      }
      setIsVerifying(false);
    };
    
    if (!loading) {
      verifyStatus();
    }
  }, [user, loading]);

  // 1. Handle Loading State
  if (loading || isVerifying) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner">Verifying Permissions...</div>
      </div>
    );
  }

  // 2. Not Logged In?
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 3. Email Not Verified?
  // We check the fresh status directly from auth.currentUser
  if (!auth.currentUser?.emailVerified && location.pathname !== '/verify-email') {
    return <Navigate to="/verify-email" state={{ email: user.email }} replace />;
  }

  // 4. Role Authorization
  const currentUserRole = userRole?.toLowerCase();
  const targetRole = allowedRole?.toLowerCase();

  if (targetRole && currentUserRole !== targetRole) {
  if (currentUserRole === 'employer') return <Navigate to="/employer/dashboard" replace />;
  if (currentUserRole === 'applicant') return <Navigate to="/applicant/survey" replace />;
  if (currentUserRole === 'admin') return <Navigate to="/admin/dashboard" replace />; // ADD THIS
  
  return <Navigate to="/" replace />;
}

  // 5. Success - Render the protected content
  return children ? children : <Outlet />;
};

export default ProtectedRoute;