import React, { useState } from 'react';
import { auth } from '../../services/firebase'; 
import { sendPasswordResetEmail } from 'firebase/auth';
import { Cross2Icon, CheckCircledIcon, EnvelopeClosedIcon } from '@radix-ui/react-icons';

const ForgotModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // 1: Input, 2: Success State

  if (!isOpen) return null;

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // This sends the email to the user with the link to your new ResetPassword page
      await sendPasswordResetEmail(auth, email);
      setStep(2);
    } catch (err) {
      console.error("Firebase Error:", err.code);
      if (err.code === 'auth/user-not-found') {
        setError("We couldn't find an account with that email address.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Please enter a valid email format.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many requests. Please try again later.");
      } else {
        setError("An error occurred. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    overlay: { 
      position: 'fixed', 
      inset: 0, 
      backdropFilter: 'blur(4px)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 9999, 
      fontFamily: "'Poppins', sans-serif" 
    },
    content: { 
      backgroundColor: 'white', 
      padding: '40px', 
      borderRadius: '24px', 
      width: '90%', 
      maxWidth: '420px', 
      position: 'relative',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    input: { 
      width: '100%', 
      padding: '14px', 
      borderRadius: '12px', 
      border: '2px solid #e5e7eb', 
      marginTop: '8px', 
      outline: 'none',
      fontSize: '15px',
      transition: 'border-color 0.2s'
    },
    btn: { 
      width: '100%', 
      padding: '16px', 
      backgroundColor: '#02176d', 
      color: 'white', 
      border: 'none', 
      borderRadius: '12px', 
      fontWeight: '700', 
      marginTop: '24px', 
      cursor: 'pointer', 
      fontSize: '16px',
      transition: 'all 0.2s' 
    },
    secondaryBtn: { 
      width: '100%', 
      padding: '14px', 
      backgroundColor: 'transparent', 
      color: '#02176d', 
      border: 'none', 
      borderRadius: '12px', 
      fontWeight: '600', 
      marginTop: '10px', 
      cursor: 'pointer',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.content} onClick={(e) => e.stopPropagation()}>
        <button 
          style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: '#f3f4f6', padding: '8px', borderRadius: '50%', cursor: 'pointer' }} 
          onClick={onClose}
        >
          <Cross2Icon width={20} height={20} />
        </button>
        
        {step === 1 ? (
          <form onSubmit={handleSendResetEmail}>
            <div style={{ marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#eef2ff', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <EnvelopeClosedIcon width={24} height={24} color="#02176d" />
                </div>
                <h2 style={{ fontWeight: '900', fontSize: '26px', color: '#02176d', lineHeight: '1.2' }}>Reset Password</h2>
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
                    Enter the email associated with your account and we'll send a secure link to reset your password.
                </p>
            </div>
            
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#02176d', letterSpacing: '0.05em' }}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              style={styles.input} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              onFocus={(e) => e.target.style.borderColor = '#02176d'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              required 
            />
            
            {error && (
                <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500' }}>
                    <span>⚠️</span> {error}
                </div>
            )}
            
            <button 
              type="submit" 
              style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} 
              disabled={loading}
            >
              {loading ? "Processing..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ backgroundColor: '#ecfdf5', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircledIcon width={40} height={40} style={{ color: '#10b981' }} />
            </div>
            <h2 style={{ fontWeight: '900', fontSize: '26px', color: '#02176d' }}>Check your inbox</h2>
            <p style={{ color: '#6b7280', fontSize: '15px', marginTop: '12px', lineHeight: '1.6' }}>
              We've sent a password reset link to <br/><b style={{ color: '#02176d' }}>{email}</b>. Please check your email to continue.
            </p>
            
            <button style={styles.btn} onClick={onClose}>Back to Login</button>
            
            <button style={styles.secondaryBtn} onClick={() => setStep(1)}>
              Didn't get the email? Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotModal;