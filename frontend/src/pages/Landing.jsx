import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Component Imports
import Navbar from "../components/Navigation/Navbar";
import Hero from "../components/Hero/Hero";
import InfoSection from "../components/sections/InfoSection";
import Footer from "../components/Footer/Footer";
import LoginModal from "../components/Modals/LoginModal";
import SignupModal from "../components/Modals/SignupModal";
import ForgotModal from "../components/Modals/ForgotModal";
import OTPModal from "../components/Modals/OTPModal";
import JobCarousel from "../components/sections/JobCarousel";
import JobLists from "./JobLists"; // Import the new file
import "../styles/register.css";

// Image Imports
import logoImg from "../assets/logo.jpg";
import slide1 from "../assets/slide1.png";
import slide2 from "../assets/slide2.png";
import slide3 from "../assets/slide3.png";

const Landing = () => {
  const navigate = useNavigate();

  // 1. Navigation & UI Visibility States
  const [view, setView] = useState("home"); // 'home' or 'job-lists'
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  // 2. Data & Form States
  const [role, setRole] = useState("applicant");
  const [showPassword, setShowPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");

  const closeAllModals = () => {
    setShowLogin(false);
    setShowSignup(false);
    setShowForgot(false);
    setShowOTP(false);
    setResetStep(1);
    setError("");
    setVerificationCode("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  };

  const handleNavigate = (target) => {
    if (target === 'job-lists') {
      setView("job-lists");
      window.scrollTo(0, 0);
    } else {
      setView("home");
    }
  };

  const handleSignupSuccess = (email) => {
    setPendingEmail(email);
    setShowSignup(false);
    setShowOTP(true);
  };

  const handleOTPVerifySuccess = () => {
    setShowOTP(false);
    setShowLogin(true);
  };

  return (
    <div className="landing-page">
      <Navbar 
        logo={logoImg} 
        onLogin={() => setShowLogin(true)} 
        onSignup={() => setShowSignup(true)} 
        onNavigate={handleNavigate} // Pass navigation handler
      />

      {/* Conditional Rendering based on 'view' state */}
      {view === "home" ? (
        <>
          <Hero 
            slides={[slide1, slide2, slide3]} 
            onSignup={() => setShowSignup(true)} 
          />
          <JobCarousel onSignup={() => setShowSignup(true)} />
          <InfoSection />
        </>
      ) : (
        <JobLists onApply={() => setShowSignup(true)} />
      )}
      
      <Footer />

      {/* --- Modals (Keep these exactly as they are) --- */}
      {showLogin && (
        <LoginModal 
          isOpen={showLogin} 
          onClose={() => setShowLogin(false)} 
          onForgotClick={() => { setShowLogin(false); setShowForgot(true); }}
          onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }}
          onLoginSuccess={(role) => navigate(`/${role}/dashboard`)}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
      )}

      {showSignup && (
        <SignupModal 
          isOpen={showSignup}
          onClose={closeAllModals}
          role={role}
          setRole={setRole}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }}
          onSignupSuccess={handleSignupSuccess}
        />
      )}

      {showOTP && (
        <OTPModal 
          isOpen={showOTP}
          onClose={closeAllModals}
          email={pendingEmail}
          onVerifySuccess={handleOTPVerifySuccess}
        />
      )}

      {showForgot && (
        <ForgotModal 
          isOpen={showForgot}
          onClose={closeAllModals}
          step={resetStep}
          setStep={setResetStep}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          error={error}
          setError={setError}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onBackToLogin={() => { setShowForgot(false); setShowLogin(true); }}
        />
      )}
    </div>
  );
};

export default Landing;