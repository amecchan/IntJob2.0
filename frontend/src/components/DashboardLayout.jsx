import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav/TopNav';
import { useAuth } from '../contexts/AuthContext';
import '../styles/DashboardLayout.css';

const DashboardLayout = () => {
  const { user, loading } = useAuth();

  // Prevent "destructure property 'user' of undefined" error
  if (loading) return null; 
  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="layout-wrapper">
      <Sidebar />

      <div className="main-content-wrapper">
        <div className="header-bg-area">
          <TopNav />
        </div>

        <main className="scrollable-area">
          <div className="content-float-up">
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;