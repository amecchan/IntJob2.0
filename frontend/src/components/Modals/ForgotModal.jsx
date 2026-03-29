import React, { useState, useEffect } from 'react';
import { Cross2Icon, CheckCircledIcon, EyeOpenIcon, EyeNoneIcon, CheckIcon, CheckboxIcon } from '@radix-ui/react-icons';

const ForgotModal = ({ 
  isOpen, onClose, step, setStep, verificationCode, setVerificationCode, 
  newPassword, setNewPassword, confirmPassword, setConfirmPassword, 
  error, setError, showPassword, setShowPassword, onBackToLogin 
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  // State for the requirements checklist
  const [checks, setChecks] = useState({
    length: false,
    upper: false,
    number: false,
    special: false
  });

  const [strength, setStrength] = useState({ label: '', color: '#d1d5db', width: '0%' });

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  if (!isOpen) return null;

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

  const handleSendCode = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://127.0.0.1:8000/api/password-reset-request/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setStep(2);
        setResendTimer(60);
      } else {
        setError("Email not found.");
      }
    } catch (err) { setError("Server error."); }
    finally { setLoading(false); }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/password-reset-confirm/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: verificationCode, new_password: newPassword }),
      });
      if (res.ok) {
        alert("Success!");
        onBackToLogin();
      } else { setError("Invalid or expired code."); }
    } catch (err) { setError("Connection error."); }
    finally { setLoading(false); }
  };

  // Helper to check if passwords match
  const isMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const styles = {
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, fontFamily: "'Poppins', sans-serif" },
    content: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', position: 'relative' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', marginTop: '8px', outline: 'none' },
    btn: { width: '100%', padding: '14px', backgroundColor: '#0051d3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' },
    requirement: (isValid) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '12px',
      color: isValid ? '#22c55e' : '#9ca3af',
      marginTop: '4px',
      transition: 'color 0.2s ease'
    })
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.content} onClick={(e) => e.stopPropagation()}>
        <button style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none' }} onClick={onClose}><Cross2Icon /></button>
        
        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <h2 style={{ fontWeight: 'bold', fontSize: '22px' }}>Forgot Password?</h2>
            <input type="email" placeholder="Email Address" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required />
            {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '10px' }}>{error}</p>}
            <button type="submit" style={styles.btn} disabled={loading}>Send Code</button>
          </form>
        )}

        {step === 2 && (
             <div style={{ textAlign: 'center' }}>
             <CheckCircledIcon width={50} height={50} style={{ color: '#10b981', marginBottom: '15px' }} />
             <h2 style={{ fontWeight: 'bold' }}>Email Sent!</h2>
             <p style={{ color: '#666', fontSize: '14px' }}>Check <b>{email}</b> for your code.</p>
             <button style={styles.btn} onClick={() => setStep(3)}>Enter Code</button>
           </div>
        )}

        {step === 3 && (
            <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontWeight: 'bold' }}>Verify Identity</h2>
            <input 
              type="text" 
              style={{ ...styles.input, textAlign: 'center', fontSize: '24px', letterSpacing: '8px' }} 
              maxLength="6" 
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{error}</p>}
            <button style={styles.btn} onClick={() => setStep(4)}>Verify Code</button>
            <br />
            <button 
              type="button" 
              style={{ background: 'none', border: 'none', color: resendTimer > 0 ? '#9ca3af' : '#0051d3', fontSize: '13px', marginTop: '10px', cursor: 'pointer' }} 
              disabled={resendTimer > 0} 
              onClick={handleSendCode}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
            </button>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleUpdatePassword}>
            <h2 style={{ fontWeight: 'bold' }}>Reset Password</h2>
            
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="New Password" 
                style={styles.input} 
                onChange={(e) => {setNewPassword(e.target.value); validatePassword(e.target.value);}} 
                required 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '20px', border: 'none', background: 'none' }}>
                {showPassword ? <EyeOpenIcon /> : <EyeNoneIcon />}
              </button>
            </div>

            {/* Strength Meter & Checklist */}
            {newPassword && (
              <div style={{ marginTop: '10px' }}>
                <div style={{ height: '4px', width: '100%', backgroundColor: '#eee', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: strength.width, backgroundColor: strength.color, transition: '0.3s' }} />
                </div>
                <span style={{ fontSize: '11px', color: strength.color, fontWeight: 'bold' }}>{strength.label}</span>

                <div style={{ marginTop: '10px' }}>
                    <div style={styles.requirement(checks.length)}>{checks.length ? <CheckIcon /> : <div style={{width:15}}/>} At least 8 characters</div>
                    <div style={styles.requirement(checks.upper)}>{checks.upper ? <CheckIcon /> : <div style={{width:15}}/>} At least one uppercase letter</div>
                    <div style={styles.requirement(checks.number)}>{checks.number ? <CheckIcon /> : <div style={{width:15}}/>} At least one number</div>
                    <div style={styles.requirement(checks.special)}>{checks.special ? <CheckIcon /> : <div style={{width:15}}/>} At least one special character</div>
                </div>
              </div>
            )}

            <div style={{ position: 'relative', marginTop: '15px' }}>
                <input 
                    type="password" 
                    placeholder="Confirm Password" 
                    style={styles.input} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                />
                {/* Match Indicator Checkmark */}
                {isMatch && (
                    <div style={{ position: 'absolute', right: '10px', top: '20px', color: '#22c55e' }}>
                        <CheckCircledIcon />
                    </div>
                )}
            </div>
            
            {/* Match Status Message */}
            {confirmPassword && (
              <p style={{ 
                fontSize: '11px', 
                color: isMatch ? '#22c55e' : '#ef4444', 
                marginTop: '5px', 
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {isMatch ? "Passwords match!" : "Passwords do not match yet"}
              </p>
            )}
            
            {error && <p style={{ color: 'red', fontSize: '12px', marginTop: '10px' }}>{error}</p>}
            
            <button 
                type="submit" 
                style={styles.btn} 
                disabled={loading || strength.width !== '100%' || !isMatch}
            >
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotModal;