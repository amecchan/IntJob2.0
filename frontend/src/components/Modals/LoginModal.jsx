import React, { useState } from 'react';
import { EyeOpenIcon, EyeNoneIcon, Cross2Icon, LockClosedIcon } from '@radix-ui/react-icons';
import { auth, db } from '../../services/firebase'; // Path to your firebase config
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const LoginModal = ({ isOpen, onClose, onForgotClick, onSwitchToSignup, onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;

      // 2. Fetch User Role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role?.toLowerCase() || 'applicant';
        
        // 3. Success!
        onLoginSuccess(role); 
      } else {
        setError("User profile not found in database.");
      }
    } catch (err) {
      console.error(err);
      // Friendly error messages for common Firebase codes
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else {
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', fontFamily: "'Poppins', sans-serif" },
    content: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
    header: { fontSize: '26px', fontWeight: 'bold', marginBottom: '8px', color: '#111', textAlign: 'center' },
    subHeader: { fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '25px' },
    formGroup: { marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px' },
    button: { width: '100%', padding: '14px', backgroundColor: '#0051d3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' },
    errorMsg: { backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', border: '1px solid #fee2e2', textAlign: 'center' }
  };

  return (
    <div style={styles.overlay}>
      {/* CSS to hide browser-default password eye */}
      <style>
        {`
          input::-ms-reveal,
          input::-ms-clear {
            display: none;
          }
          input::-webkit-contacts-auto-fill-button, 
          input::-webkit-credentials-auto-fill-button {
            visibility: hidden;
            display: none !important;
            pointer-events: none;
          }
        `}
      </style>

      <div style={styles.content} onClick={(e) => e.stopPropagation()}>
        <button 
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }} 
          onClick={onClose}
        >
          <Cross2Icon width={22} height={22} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '50%' }}>
                <LockClosedIcon width={24} height={24} style={{ color: '#0051d3' }} />
            </div>
        </div>

        <h2 style={styles.header}>Welcome Back</h2>
        <p style={styles.subHeader}>Sign in to your IntJob account.</p>
        
        {error && <div style={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Email Address</label>
            <input 
              name="email" 
              type="email" 
              style={styles.input} 
              placeholder="name@example.com" 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div style={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Password</label>
              <button 
                type="button" 
                onClick={onForgotClick} 
                style={{ background: 'none', border: 'none', color: '#0051d3', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                name="password"
                type={showPassword ? "text" : "password"} 
                style={styles.input} 
                placeholder="••••••••"
                onChange={handleChange}
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                {showPassword ? <EyeOpenIcon /> : <EyeNoneIcon />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            style={{ ...styles.button, backgroundColor: loading ? '#a5c4f7' : '#0051d3' }} 
            disabled={loading}
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>

          <div style={{ textAlign: 'center', fontSize: '14px', marginTop: '25px', color: '#4b5563' }}>
            Don't have an account? {' '}
            <button 
              type="button" 
              onClick={onSwitchToSignup} 
              style={{ background: 'none', border: 'none', color: '#0051d3', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;