import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { sendEmailVerification, reload } from 'firebase/auth';
import { EnvelopeClosedIcon, CheckCircledIcon, ReloadIcon, ArrowLeftIcon } from '@radix-ui/react-icons';

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0); // For the resend timer
  
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "your email";

  // 1. Auto-check verification status every 3 seconds
  useEffect(() => {
    let interval;
    
    if (!isVerified) {
      interval = setInterval(async () => {
        if (auth.currentUser) {
          await reload(auth.currentUser);
          if (auth.currentUser.emailVerified) {
            setIsVerified(true);
            clearInterval(interval);
            // Auto-redirect after success
            setTimeout(() => {
                // Redirect to Home, but tell Home to open the Login modal
                navigate('/', { state: { openLogin: true } }); 
                }, 2500);
          }
        }
      }, 3000); 
    }

    return () => clearInterval(interval);
  }, [isVerified, navigate]);

  // 2. Countdown timer for Resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    setResending(true);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setCountdown(60); // Disable resend for 60 seconds
        alert("Verification link resent!");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ backgroundColor: 'white', padding: '50px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', maxWidth: '450px', width: '90%', textAlign: 'center' }}>
        
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: isVerified ? '#ecfdf5' : '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 25px', color: isVerified ? '#10b981' : '#0051d3' }}>
          {isVerified ? <CheckCircledIcon width={45} height={45} /> : <EnvelopeClosedIcon width={45} height={45} />}
        </div>

        <h2 style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '15px' }}>
          {isVerified ? "All Set!" : "Confirm Your Email"}
        </h2>
        
        <p style={{ color: '#666', fontSize: '15px', lineHeight: '1.6', marginBottom: '30px' }}>
          {isVerified 
            ? "Your account is active. Redirecting you to login..." 
            : <>Waiting for you to verify <b>{email}</b>. This page will update automatically once you click the link.</>}
        </p>
        
        {!isVerified && (
          <>
            {/* This button is now purely decorative/informative since we auto-check */}
            <div style={{ 
              width: '100%', 
              padding: '15px', 
              backgroundColor: '#f3f4f6', 
              color: '#9ca3af', 
              borderRadius: '8px', 
              fontWeight: '600', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px',
              cursor: 'not-allowed',
              border: '1px dashed #d1d5db'
            }}>
              <ReloadIcon className="animate-spin" />
              Checking verification status...
            </div>

            <button 
              onClick={handleResend} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: (resending || countdown > 0) ? '#ccc' : '#0051d3', 
                fontWeight: '600', 
                cursor: (resending || countdown > 0) ? 'not-allowed' : 'pointer', 
                fontSize: '14px', 
                marginTop: '25px', 
                textDecoration: 'underline' 
              }} 
              disabled={resending || countdown > 0}
            >
              {countdown > 0 ? `Resend email in ${countdown}s` : "Didn't get the email? Resend link"}
            </button>
          </>
        )}

        <button onClick={() => navigate('/')} style={{ marginTop: '30px', display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af', border: 'none', background: 'none', cursor: 'pointer', margin: '30px auto 0' }}>
          <ArrowLeftIcon /> Back to Home
        </button>
      </div>
      <style>{`.animate-spin { animation: spin 2s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default VerifyEmail;