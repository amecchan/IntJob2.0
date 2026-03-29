import React, { useState } from 'react';
import { EyeOpenIcon, EyeNoneIcon, Cross2Icon, CheckIcon, CheckCircledIcon } from '@radix-ui/react-icons';

const SignupModal = ({ isOpen, onClose, onSwitchToLogin, role, setRole, showPassword, setShowPassword, onSignupSuccess }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false); // New: Success feedback
  
  const [checks, setChecks] = useState({
    length: false,
    upper: false,
    number: false,
    special: false
  });

  const [strength, setStrength] = useState({ label: '', color: '#d1d5db', width: '0%' });

  // if (!isOpen) return null;

  const validatePassword = (pass) => {
    const newChecks = {
      length: pass.length >= 8,
      upper: /[A-Z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass)
    };
    setChecks(newChecks);

    let score = Object.values(newChecks).filter(Boolean).length;

    const levels = [
      { label: 'Weak', color: '#ef4444', width: '25%' },
      { label: 'Fair', color: '#f97316', width: '50%' },
      { label: 'Good', color: '#eab308', width: '75%' },
      { label: 'Strong', color: '#22c55e', width: '100%' }
    ];
    setStrength(pass ? (levels[score - 1] || levels[0]) : { label: '', color: '#d1d5db', width: '0%' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') validatePassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) return;

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: role,
        }),
      });

      if (response.ok) {
        setShowToast(true); // Trigger toast
        setTimeout(() => {
          setShowToast(false);
          onSignupSuccess(formData.email); // Move to OTP step after delay
        }, 2500);
      } else {
        alert("Signup failed. Check if email already exists.");
      }
    } catch (error) {
      alert("Technical Error: " + error.message);
    } finally { 
      setLoading(false); 
    }
  };

  const isMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  const styles = {
    // Note: No onClick here to prevent accidental closing
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', fontFamily: "'Poppins', sans-serif" },
    content: { backgroundColor: 'white', padding: '35px', borderRadius: '16px', width: '100%', maxWidth: '440px', position: 'relative' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' },
    requirement: (isValid) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '11px',
      color: isValid ? '#22c55e' : '#9ca3af',
      marginTop: '4px',
      transition: 'color 0.2s ease'
    }),
    btn: { 
      width: '100%', padding: '14px', 
      backgroundColor: (agreed && strength.width === '100%' && isMatch) ? '#0051d3' : '#a5c4f7', 
      color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', 
      cursor: (agreed && strength.width === '100%' && isMatch) ? 'pointer' : 'not-allowed', 
      marginTop: '10px', transition: 'background-color 0.3s' 
    },
    toast: {
      position: 'fixed', bottom: '30px', right: '30px', 
      backgroundColor: '#10b981', color: 'white', padding: '16px 24px', 
      borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 10000, 
      animation: 'slideIn 0.5s ease-out'
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.content} onClick={(e) => e.stopPropagation()}>
        <button 
          style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', cursor: 'pointer' }} 
          onClick={onClose}
        >
          <Cross2Icon width={20} height={20} />
        </button>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Create Account</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Join the IntJob community.</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input name="firstName" placeholder="First Name" style={styles.input} onChange={handleChange} required />
            <input name="lastName" placeholder="Last Name" style={styles.input} onChange={handleChange} required />
          </div>

          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ ...styles.input, marginBottom: '15px', backgroundColor: 'white' }}>
            <option value="applicant">Applicant</option>
            <option value="employer">Employer</option>
          </select>

          <input name="email" type="email" placeholder="Email" style={{ ...styles.input, marginBottom: '15px' }} onChange={handleChange} required />

          <div style={{ position: 'relative', marginBottom: '5px' }}>
            <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" style={styles.input} onChange={handleChange} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '12px', border: 'none', background: 'none', cursor: 'pointer' }}>
              {showPassword ? <EyeOpenIcon /> : <EyeNoneIcon />}
            </button>
          </div>

          {formData.password && (
            <div style={{ marginBottom: '15px' }}>
              <div style={{ height: '4px', width: '100%', backgroundColor: '#eee', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: strength.width, backgroundColor: strength.color, transition: '0.3s' }} />
              </div>
              <span style={{ fontSize: '11px', color: strength.color, fontWeight: 'bold' }}>{strength.label}</span>

              <div style={{ marginTop: '8px' }}>
                <div style={styles.requirement(checks.length)}>{checks.length ? <CheckIcon /> : <div style={{width:15}}/>} 8+ Characters</div>
                <div style={styles.requirement(checks.upper)}>{checks.upper ? <CheckIcon /> : <div style={{width:15}}/>} Uppercase</div>
                <div style={styles.requirement(checks.number)}>{checks.number ? <CheckIcon /> : <div style={{width:15}}/>} Number</div>
                <div style={styles.requirement(checks.special)}>{checks.special ? <CheckIcon /> : <div style={{width:15}}/>} Special Char</div>
              </div>
            </div>
          )}

          <div style={{ position: 'relative', marginTop: '15px' }}>
            <input name="confirmPassword" type="password" placeholder="Confirm Password" style={styles.input} onChange={handleChange} required />
            {isMatch && (
              <div style={{ position: 'absolute', right: '10px', top: '12px', color: '#22c55e' }}>
                <CheckCircledIcon />
              </div>
            )}
          </div>
          {formData.confirmPassword && (
            <p style={{ fontSize: '11px', color: isMatch ? '#22c55e' : '#ef4444', marginTop: '4px', fontWeight: 'bold' }}>
              {isMatch ? "Passwords match!" : "Passwords do not match"}
            </p>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '15px', marginBottom: '15px' }}>
            <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: '4px', cursor: 'pointer' }} />
            <label htmlFor="terms" style={{ fontSize: '11px', color: '#4b5563', cursor: 'pointer' }}>
              I agree to the <span style={{ color: '#0051d3', fontWeight: 'bold' }}>Terms</span> and <span style={{ color: '#0051d3', fontWeight: 'bold' }}>Privacy Policy</span>.
            </label>
          </div>

          <button type="submit" style={styles.btn} disabled={loading || !agreed || strength.width !== '100%' || !isMatch}>
            {loading ? "Registering..." : "Create account"}
          </button>
        </form>
      </div>

      {/* SUCCESS TOAST MESSAGE */}
      {showToast && (
        <div style={styles.toast}>
          <CheckCircledIcon width={24} height={24} />
          <div>
            <p style={{ margin: 0, fontWeight: 'bold' }}>Registration Successful!</p>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>Check your email for the verification code.</p>
          </div>
        </div>
      )}

      {/* Simple Slide-in Animation Style */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SignupModal;