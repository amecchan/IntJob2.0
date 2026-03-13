import React, { useState } from 'react';
import '../styles/register.css';

// Components
import Navigation from '../components/Navigation/Navigation';
import Hero from '../components/Hero/Hero';
import HowItWorks from '../components/sections/HowItWorks';
import Contact from '../components/sections/Contact';
import Footer from '../components/Footer/Footer';
import LoginModal from '../components/Modals/LoginModal';
import SignupModal from '../components/Modals/SignupModal';
import ForgotPasswordModal from '../components/Modals/ForgotPasswordModal';

const Landing = () => {
  const [activeModal, setActiveModal] = useState(null); // 'login' | 'signup' | 'forgot' | null

  const openLogin = () => setActiveModal('login');
  const openSignup = () => setActiveModal('signup');
  const openForgot = () => setActiveModal('forgot');
  const closeModal = () => setActiveModal(null);

  return (
    <div className="landing-page">
      <Navigation onLoginClick={openLogin} onSignupClick={openSignup} />
      <Hero onSignupClick={openSignup} />

      <main className="container">
        <HowItWorks />
        <Contact />
      </main>

      <Footer />

      {/* Modals */}
      {activeModal === 'login' && (
        <LoginModal
          onClose={closeModal}
          onForgotClick={openForgot}
          onSignupClick={openSignup}
        />
      )}
      {activeModal === 'signup' && (
        <SignupModal onClose={closeModal} onLoginClick={openLogin} />
      )}
      {activeModal === 'forgot' && (
        <ForgotPasswordModal onClose={closeModal} onLoginClick={openLogin} />
      )}
    </div>
  );
};

export default Landing;
