import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Updated path

const ProtectedRoute = ({ allowedRole, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Verifying Session...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Ensure case-insensitive comparison to avoid "Applicant" vs "applicant" bugs
  const userRole = user.role?.toLowerCase();
  const requiredRole = allowedRole?.toLowerCase();

    if (user.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    console.log(`Access denied. User role: ${user.role}, Required: ${requiredRole}`);
    return <Navigate to="/" />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;