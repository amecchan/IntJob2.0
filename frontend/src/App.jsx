import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout'; 

// Pages
import Landing from './pages/Landing';
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

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Landing />} />

      {/* Protected Employer Routes (Wrapped in Sidebar Layout) */}
      <Route element={<ProtectedRoute allowedRole="employer" />}>
        <Route element={<DashboardLayout />}>
          
          {/* Main Stats Page */}
          <Route path="/employer/dashboard" element={<Dashboard />} />
          
          {/* 1. The Table List of all Applicants */}
          <Route path="/employer/dashboard/view-applicants" element={<ViewApplicants />} />
          
          {/* 2. The Dynamic Profile/Status Page */}
          {/* ":applicantId" is the key that useParams() hooks into */}
          <Route path="/employer/dashboard/applicants/:applicantId" element={<ApplicantStatusManagement />} />
          
          {/* 3. Job Management Sections */}
          <Route path="/employer/dashboard/jobs" element={<JobManagement />} />
          <Route path="/employer/dashboard/jobs/:jobId/applicants" element={<JobApplicants />} />

          {/* 4. Communication & Settings */}
          <Route path="/employer/dashboard/messages" element={<Messages />} />
          <Route path="/employer/dashboard/profile" element={<CompanyProfile />} />
          {/* NESTED SETTINGS ROUTES */}
            <Route path="/employer/dashboard/settings" element={<SettingsLayout />}>
              {/* Index: Default to Profile Info if just /settings is visited */}
              <Route index element={<ProfileInfo />} />

              {/* Sub-tabs mapped from your image */}
              <Route path="profile" element={<ProfileInfo />} />
              <Route path="security" element={<PasswordSecurity />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="preferences" element={<Preferences />} />
            </Route>

          {/* Default redirect if they hit /employer/dashboard/ directly and you want a specific tab */}
          <Route path="/employer" element={<Navigate to="/employer/dashboard" replace />} />
        </Route>
      </Route>

      {/* Protected Applicant Routes */}
      <Route element={<ProtectedRoute allowedRole="applicant" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/applicant/dashboard" element={<div>Applicant View</div>} />
        </Route>
      </Route>

      {/* 404 Catch-all */}
      <Route path="*" element={<div className="p-20 text-center font-black">404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;