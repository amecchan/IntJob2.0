// App.jsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout'; // Import layout
import Landing from './pages/Landing';
import Dashboard from './pages/Employer/Dashboard';
import JobApplicants from './pages/Employer/JobApplicants';
import ViewApplicants from './pages/Employer/ViewApplicants';
import ApplicantProfile from './pages/Employer/ApplicantProfile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* EVERYTHING INSIDE THIS GROUP USES THE SIDEBAR */}
      <Route element={<ProtectedRoute allowedRole="employer" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/employer/dashboard" element={<Dashboard />} />
          {/* You can add more employer pages here easily: */}
          {/* Dynamic Route */}
          {/* 1. Global View of all applicants */}
          <Route path="/employer/dashboard/view-applicants" element={<ViewApplicants />} />

          {/* 2. Specific Job's applicant list (Dynamic) */}
          <Route path="/employer/dashboard/jobs/:jobId/applicants" element={<JobApplicants />} />
          
          {/* 3. Single Applicant Profile (Dynamic) */}
          <Route path="/employer/dashboard/applicants/:applicantId" element={<ApplicantProfile />} />

          {/* <Route path="/employer/jobs" element={<JobManagement />} /> */}
          {/* <Route path="/employer/settings" element={<Settings />} /> */}
        </Route>
      </Route>

      {/* Separate layout for Applicants if needed */}
      <Route element={<ProtectedRoute allowedRole="applicant" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/applicant/dashboard" element={<div>Applicant View</div>} />
        </Route>
      </Route>

    </Routes>
  );
}

export default App;