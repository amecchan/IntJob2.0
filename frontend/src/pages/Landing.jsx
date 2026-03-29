import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this for the final redirect

// Component Imports
import Navbar from "../components/Navigation/Navbar";
import Hero from "../components/Hero/Hero";
import InfoSection from "../components/Sections/InfoSection";
import Footer from "../components/Footer/Footer";
import LoginModal from "../components/Modals/LoginModal";
import SignupModal from "../components/Modals/SignupModal";
import ForgotModal from "../components/Modals/ForgotModal";
import OTPModal from "../components/Modals/OTPModal";
import "../styles/register.css";

// Image Imports
import logoImg from "../assets/logo.jpg";
import slide1 from "../assets/slide1.png";
import slide2 from "../assets/slide2.png";
import slide3 from "../assets/slide3.png";

const Landing = () => {
  const navigate = useNavigate();

  // 1. UI Visibility States
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

  // Helper to close everything at once
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

  // Step 1: Signup Success -> Open OTP
  const handleSignupSuccess = (email) => {
    setPendingEmail(email);
    setShowSignup(false);
    setShowOTP(true);
  };

  // Step 2: OTP Success -> Open Login (NO redirect to /login)
  const handleOTPVerifySuccess = () => {
    setShowOTP(false);
    setShowLogin(true); // This keeps them on the landing page but opens Login
  };

  // Step 3: Login Success -> Redirect to Dashboard
  const handleLoginSuccess = (role) => {
    closeAllModals();
    // Redirect based on the role selected during signup
    console.log("User Role received:", role);
    if (role === "employer") {
      navigate("/employer/dashboard");
    } else {
      navigate("/applicant/dashboard");
    }
  };

  return (
    <div className="landing-page">
      <Navbar 
        logo={logoImg} 
        onLogin={() => setShowLogin(true)} 
        onSignup={() => setShowSignup(true)} 
      />

      <Hero 
        slides={[slide1, slide2, slide3]} 
        onSignup={() => setShowSignup(true)} 
      />

      <InfoSection />
      <Footer />

      {/* --- Modals --- */}
      
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
          onVerifySuccess={handleOTPVerifySuccess} // Use the new success handler
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