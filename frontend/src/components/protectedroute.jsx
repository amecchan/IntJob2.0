import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Updated path

const ProtectedRoute = ({ allowedRole, children }) => {
  const { user, loading } = useAuth(); // Add loading here

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Verifying Session...</div>;
  }

  // 1. If no user is logged in (user is null), redirect to landing/login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 2. If a specific role is required and doesn't match the logged-in user
  if (allowedRole && user.role !== allowedRole) {
    // You could redirect them to a "Not Authorized" page or back to landing
    return <Navigate to="/" replace />;
  }

  // 3. If everything is fine, render the protected content
  // We use Outlet if we're nesting routes (Option B Layout style)
  // or children if we're wrapping a specific component
  return children ? children : <Outlet />;
};

export default ProtectedRoute;