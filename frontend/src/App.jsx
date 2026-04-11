import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout'; 

// --- PUBLIC PAGES ---
import Landing from './pages/Landing'; 
import VerifyEmail from './pages/VerifyEmail'; 
import ResetPassword from './pages/ResetPassword';

// --- EMPLOYER PAGES ---
import Dashboard from './pages/Employer/Dashboard';
import ViewApplicants from './pages/Employer/Applicant/ViewApplicants';
import ApplicantProfile from './pages/Employer/Applicant/ApplicantProfile';
import ApplicantStatusManagement from './pages/Employer/Applicant/ApplicantStatusManagement';
import JobManagement from './pages/Employer/JobManagement';
import JobApplicants from './pages/Employer/JobApplicants';
import Messages from './pages/Employer/Messages';
import CompanyProfile from './pages/Employer/CompanyProfile';

// Employer Settings
import SettingsLayout from './pages/Employer/Settings/SettingsLayout';
import ProfileInfo from './pages/Employer/Settings/ProfileInfo';
import PasswordSecurity from './pages/Employer/Settings/PasswordSecurity';
import Notifications from './pages/Employer/Settings/Notifications';
import Preferences from './pages/Employer/Settings/Preferences';

// --- APPLICANT PAGES ---
import ApplicationDashboard from './pages/Applicant/ApplicationDashboard';
import AppliResume from './pages/Applicant/AppliResume'; // Your Resume Builder
import Survey from './pages/Applicant/Survey'; 

// --- ADMIN PAGES ---
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdReport from './pages/Admin/AdReport';
import AdSecurity from './pages/Admin/AdSecurity';
import AppliManage from './pages/Admin/AppliManage';
import ContentManage from './pages/Admin/ContentManage';
import FeedbackComp from './pages/Admin/FeedbackComp';
import PaySubManage from './pages/Admin/PaySubManage';
import SystemSett from './pages/Admin/SystemSett';
import UserManagement from './pages/Admin/UserManage';

function App() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/" element={<Landing />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* --- PROTECTED EMPLOYER ROUTES --- */}
      <Route element={<ProtectedRoute allowedRole="employer" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/employer/dashboard" element={<Dashboard />} />
          
          {/* Applicant Tracking */}
          <Route path="/employer/dashboard/view-applicants" element={<ViewApplicants />} />
          <Route path="/employer/dashboard/applicants/:applicantId" element={<ApplicantProfile />} />
          <Route path="/employer/dashboard/applicants/:applicantId/status" element={<ApplicantStatusManagement />} />

          {/* Job Management */}
          <Route path="/employer/dashboard/jobs" element={<JobManagement />} />
          <Route path="/employer/dashboard/jobs/:jobId/applicants" element={<JobApplicants />} />
          
          <Route path="/employer/dashboard/messages" element={<Messages />} />
          <Route path="/employer/dashboard/profile" element={<CompanyProfile />} />
          
          {/* Nested Settings */}
          <Route path="/employer/dashboard/settings" element={<SettingsLayout />}>
            <Route index element={<ProfileInfo />} />
            <Route path="profile" element={<ProfileInfo />} />
            <Route path="security" element={<PasswordSecurity />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="preferences" element={<Preferences />} />
          </Route>
        </Route>
      </Route>

      {/* --- PROTECTED APPLICANT ROUTES --- */}
      <Route element={<ProtectedRoute allowedRole="applicant" />}>
        <Route path="/applicant/dashboard" element={<ApplicationDashboard />} />
        <Route path="/applicant/resume" element={<AppliResume />} /> {/* Added this for your builder */}
        <Route path="/applicant/survey" element={<Survey />} />
      </Route>

      {/* --- PROTECTED ADMIN ROUTES --- */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/settings" element={<SystemSett />} />
          <Route path='/admin/content' element={<ContentManage />} />
          <Route path='/admin/ads' element={<AdReport />} />
          <Route path='/admin/feedback' element={<FeedbackComp />} />
          <Route path='/admin/payments' element={<PaySubManage />} />
          <Route path='/admin/security' element={<AdSecurity />} />
          <Route path='/admin/applications' element={<AppliManage />} />
      </Route>

      {/* --- HELPER REDIRECTS --- */}
      <Route path="/employer" element={<Navigate to="/employer/dashboard" replace />} />
      <Route path="/applicant" element={<Navigate to="/applicant/dashboard" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* 404 Catch-all */}
      <Route path="*" element={<div className="p-20 text-center font-black text-2xl">404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;