import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";

// Component Imports
import Navbar from "../components/Navigation/Navbar";
import Hero from "../components/Hero/Hero";
import InfoSection from "../components/sections/InfoSection";
import Footer from "../components/Footer/Footer";
import LoginModal from "../components/Modals/LoginModal";
import SignupModal from "../components/Modals/SignupModal";
import ForgotModal from "../components/Modals/ForgotModal";
import LegalViewModal from "../components/Modals/LegalViewModal";
import JobCarousel from "../components/Sections/JobCarousel";
import JobLists from "./JobLists"; 
import "../styles/register.css";

// Image Imports
import logoImg from "../assets/logo.jpg";
import slide1 from "../assets/slide1.png";
import slide2 from "../assets/slide2.png";
import slide3 from "../assets/slide3.png";

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. UI & View States
  const [view, setView] = useState("home"); 
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showLegalView, setShowLegalView] = useState(false);
  const [selectedLegalType, setSelectedLegalType] = useState(""); 

  // 2. Form & Security States
  const [role, setRole] = useState("applicant"); 
  const [showPassword, setShowPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [error, setError] = useState("");

  // 3. Data States
  const [legalDocs, setLegalDocs] = useState({ terms: "", privacy: "" });

  // Real-time listener for legal settings
  useEffect(() => {
    const unsubLegal = onSnapshot(doc(db, "settings", "legal"), (snap) => {
      if (snap.exists()) {
        setLegalDocs(snap.data());
      }
    });
    return () => unsubLegal();
  }, []);

  // Handle cross-page/modal triggers from navigation state
  useEffect(() => {
    if (location.state?.openLogin) {
      setShowLogin(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Prevent background scrolling when any modal is active
  useEffect(() => {
    const isModalOpen = showLogin || showSignup || showForgot || showLegalView;
    document.body.style.overflow = isModalOpen ? 'hidden' : 'unset';
  }, [showLogin, showSignup, showForgot, showLegalView]);

  const handleNavigate = (target) => {
    if (target === 'job-lists') {
      setView("job-lists");
    } else {
      setView("home");
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLegal = (type) => {
    setSelectedLegalType(type);
    setShowLegalView(true);
  };

  const closeAllModals = () => {
    setShowLogin(false);
    setShowSignup(false);
    setShowForgot(false);
    setShowLegalView(false);
    setResetStep(1);
    setError("");
    setShowPassword(false);
  };

  const handleSignupSuccess = (email) => {
    setTimeout(() => {
      navigate("/verify-email", { state: { email: email } });
    }, 1000); 
  };

  return (
    <div className="landing-page">
      <Navbar 
        logo={logoImg} 
        onLogin={() => { closeAllModals(); setShowLogin(true); }} 
        onSignup={() => { closeAllModals(); setShowSignup(true); }}
        onNavigate={handleNavigate}
      />

      <main className="main-content">
        {view === "home" ? (
          <>
            <Hero 
              slides={[slide1, slide2, slide3]} 
              onSignup={() => setShowSignup(true)} 
            />
            <JobCarousel onSignup={() => setShowSignup(true)} />
            <InfoSection legalDocs={legalDocs} />
          </>
        ) : (
          <JobLists onApply={() => setShowSignup(true)} />
        )}
      </main>
      
      <Footer onLegalClick={handleOpenLegal} />

      {/* --- Modals --- */}

      {showLegalView && (
        <LegalViewModal 
          isOpen={showLegalView}
          onClose={() => setShowLegalView(false)}
          title={selectedLegalType === 'terms' ? "Terms of Use" : "Privacy Policy"}
          content={selectedLegalType === 'terms' ? legalDocs.terms : legalDocs.privacy}
        />
      )}
      
      {showLogin && (
        <LoginModal 
          isOpen={showLogin} 
          onClose={closeAllModals} 
          showPassword={showPassword} 
          setShowPassword={setShowPassword}
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
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }}
          onSignupSuccess={handleSignupSuccess} 
          legalDocs={legalDocs}
        />
      )}

      {showForgot && (
        <ForgotModal 
          isOpen={showForgot}
          onClose={closeAllModals}
          step={resetStep}
          setStep={setResetStep}
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