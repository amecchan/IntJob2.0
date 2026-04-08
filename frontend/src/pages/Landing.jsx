import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Component Imports
import Navbar from "../components/Navigation/Navbar";
import Hero from "../components/Hero/Hero";
import InfoSection from "../components/sections/InfoSection";
import Footer from "../components/Footer/Footer";
import LoginModal from "../components/Modals/LoginModal";
import SignupModal from "../components/Modals/SignupModal";
import ForgotModal from "../components/Modals/ForgotModal";
import JobCarousel from "../components/sections/JobCarousel";
import JobLists from "./JobLists"; 
import "../styles/register.css";

// Image Imports
import logoImg from "../assets/logo.jpg";
import slide1 from "../assets/slide1.png";
import slide2 from "../assets/slide2.png";
import slide3 from "../assets/slide3.png";

const Landing = () => {
  const navigate = useNavigate();

  // 1. UI Visibility States
  const [view, setView] = useState("home"); 
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  // 2. Data States
  const [role, setRole] = useState("applicant");
  const [resetStep, setResetStep] = useState(1);

  const closeAllModals = () => {
    setShowLogin(false);
    setShowSignup(false);
    setShowForgot(false);
    setResetStep(1);
  };

  const handleNavigate = (target) => {
    if (target === 'job-lists') {
      setView("job-lists");
      window.scrollTo(0, 0);
    } else {
      setView("home");
    }
  };

  useEffect(() => {
    // If the user was redirected here with the 'openLogin' flag, show the modal
    if (location.state?.openLogin) {
      setShowLogin(true);
      // Clean up the state so it doesn't pop up again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  /**
   * REPLACED MODAL LOGIC WITH PAGE NAVIGATION
   * Triggered after SignupModal creates the user and sends the email
   */
  const handleSignupSuccess = (email) => {
  console.log("Signup success caught for:", email);
  
  // Give Firebase/Firestore a moment to sync the profile 
  // before the ProtectedRoute tries to read the role
  setTimeout(() => {
    navigate("/verify-email", { state: { email: email } });
  }, 1000); 
};

  return (
    <div className="landing-page">
      <Navbar 
        logo={logoImg} 
        onLogin={() => setShowLogin(true)} 
        onSignup={() => setShowSignup(true)} 
        onNavigate={handleNavigate} 
      />

      {view === "home" ? (
        <>
          <Hero slides={[slide1, slide2, slide3]} onSignup={() => setShowSignup(true)} />
          <JobCarousel onSignup={() => setShowSignup(true)} />
          <InfoSection />
        </>
      ) : (
        <JobLists onApply={() => setShowSignup(true)} />
      )}
      
      <Footer />

      {/* --- Modals --- */}
      
      {showLogin && (
        <LoginModal 
          isOpen={showLogin} 
          onClose={closeAllModals} 
          onForgotClick={() => { setShowLogin(false); setShowForgot(true); }}
          onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }}
          onLoginSuccess={(userRole) => navigate(`/${userRole}/dashboard`)}
        />
      )}

      {showSignup && (
        <SignupModal 
          isOpen={showSignup}
          onClose={closeAllModals}
          role={role}
          setRole={setRole}
          onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }}
          onSignupSuccess={handleSignupSuccess} 
        />
      )}

      {showForgot && (
        <ForgotModal 
          isOpen={showForgot}
          onClose={closeAllModals}
          step={resetStep}
          setStep={setResetStep}
          onBackToLogin={() => { setShowForgot(false); setShowLogin(true); }}
        />
      )}
    </div>
  );
};

export default Landing;