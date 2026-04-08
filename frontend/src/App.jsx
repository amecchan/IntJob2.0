import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout'; 

// Employer Pages
import Landing from './pages/Landing'; // Ensure this path is correct
import Dashboard from './pages/Employer/Dashboard';
import ViewApplicants from './pages/Employer/Applicant/ViewApplicants';
import ApplicantStatusManagement from './pages/Employer/ApplicantStatusManagement';
import JobManagement from './pages/Employer/JobManagement';
import JobApplicants from './pages/Employer/JobApplicants';
import Messages from './pages/Employer/Messages';
import CompanyProfile from './pages/Employer/CompanyProfile';
import SettingsLayout from './pages/Employer/Settings/SettingsLayout';
import ProfileInfo from './pages/Employer/Settings/ProfileInfo';
import PasswordSecurity from './pages/Employer/Settings/PasswordSecurity';
import Notifications from './pages/Employer/Settings/Notifications';
import Preferences from './pages/Employer/Settings/Preferences';
import VerifyEmail from './pages/VerifyEmail'; // Ensure this path is correct

// Applicant Pages
import ApplicationDashboard from './pages/Applicant/ApplicationDashboard';

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Landing />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected Employer Routes */}
      <Route element={<ProtectedRoute allowedRole="employer" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/employer/dashboard" element={<Dashboard />} />
          <Route path="/employer/dashboard/view-applicants" element={<ViewApplicants />} />
          <Route path="/employer/dashboard/applicants/:applicantId" element={<ApplicantStatusManagement />} />
          <Route path="/employer/dashboard/jobs" element={<JobManagement />} />
          <Route path="/employer/dashboard/jobs/:jobId/applicants" element={<JobApplicants />} />
          <Route path="/employer/dashboard/messages" element={<Messages />} />
          <Route path="/employer/dashboard/profile" element={<CompanyProfile />} />
          
          <Route path="/employer/dashboard/settings" element={<SettingsLayout />}>
            <Route index element={<ProfileInfo />} />
            <Route path="profile" element={<ProfileInfo />} />
            <Route path="security" element={<PasswordSecurity />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="preferences" element={<Preferences />} />
          </Route>
        </Route>
      </Route>

      {/* Protected Applicant Routes */}
      {/* NOTE: Since your ApplicationDashboard handles its own internal navigation 
          (Home, Inbox, Profile) via State, we don't need nested routes here yet.
      */}
      <Route element={<ProtectedRoute allowedRole="applicant" />}>
        <Route path="/applicant/dashboard" element={<ApplicationDashboard />} />
      </Route>

      {/* Helper Redirects */}
      <Route path="/employer" element={<Navigate to="/employer/dashboard" replace />} />
      <Route path="/applicant" element={<Navigate to="/applicant/dashboard" replace />} />

      {/* 404 Catch-all */}
      <Route path="*" element={<div className="p-20 text-center font-black">404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;