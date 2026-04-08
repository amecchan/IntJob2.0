import React, { useState } from 'react';
import { EyeOpenIcon, EyeNoneIcon, Cross2Icon, CheckIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { auth, db } from '../../services/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const SignupModal = ({ isOpen, onClose, onSwitchToLogin, role, setRole, onSignupSuccess }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");

  const [checks, setChecks] = useState({ length: false, upper: false, number: false, special: false });
  const [strength, setStrength] = useState({ label: '', color: '#d1d5db', width: '0%' });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'password') validatePassword(value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed || strength.width !== '100%' || formData.password !== formData.confirmPassword) return;

    setLoading(true);
    setError("");

    const fullName = `${formData.firstName} ${formData.lastName}`;

    try {
      // 1. Create Auth Account
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. IMPORTANT: Update the Firebase Auth Profile with the Name
      // This is exactly what the Sidebar looks for via user.displayName
      await updateProfile(user, {
        displayName: fullName
      });

      // 3. Send Verification Email
      await sendEmailVerification(user);

      // 4. Save to Firestore
      try {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          firstName: formData.firstName,
          lastName: formData.lastName,
          fullName: fullName,
          email: formData.email,
          role: role.toLowerCase(),
          createdAt: new Date().toISOString(),
        });
      } catch (dbError) {
        console.error("Firestore Write Error:", dbError);
      }

      // 5. Success UI
      setShowToast(true);
      
      setTimeout(() => {
        setShowToast(false);
        onSignupSuccess(formData.email); 
      }, 2000);

    } catch (err) {
      console.error("Signup Error:", err.code);
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already in use.");
      } else {
        setError("Signup failed. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const isMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  const styles = {
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px', fontFamily: "'Poppins', sans-serif" },
    content: { backgroundColor: 'white', padding: '35px', borderRadius: '16px', width: '100%', maxWidth: '440px', position: 'relative' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none' },
    requirement: (isValid) => ({ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: isValid ? '#22c55e' : '#9ca3af', marginTop: '4px' }),
    btn: { width: '100%', padding: '14px', backgroundColor: (agreed && strength.width === '100%' && isMatch) ? '#0051d3' : '#a5c4f7', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: (agreed && strength.width === '100%' && isMatch && !loading) ? 'pointer' : 'not-allowed', marginTop: '10px' },
    errorMsg: { backgroundColor: '#fef2f2', color: '#dc2626', padding: '10px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px', textAlign: 'center' },
    toast: { position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#10b981', color: 'white', padding: '16px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 10000, animation: 'slideIn 0.5s ease-out' }
  };

  return (
    <div style={styles.overlay}>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
      <div style={styles.content} onClick={(e) => e.stopPropagation()}>
        <button style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', cursor: 'pointer' }} onClick={onClose}><Cross2Icon width={20} height={20} /></button>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Create Account</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Join the IntJob community.</p>
        
        {error && <div style={styles.errorMsg}>{error}</div>}

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
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '12px', border: 'none', background: 'none', cursor: 'pointer', color: '#6b7280' }}>
              {showPassword ? <EyeOpenIcon /> : <EyeNoneIcon />}
            </button>
          </div>

          {formData.password && (
            <div style={{ marginBottom: '15px' }}>
              <div style={{ height: '4px', width: '100%', backgroundColor: '#eee', borderRadius: '2px', overflow: 'hidden' }}><div style={{ height: '100%', width: strength.width, backgroundColor: strength.color, transition: '0.3s' }} /></div>
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
            {isMatch && <div style={{ position: 'absolute', right: '10px', top: '12px', color: '#22c55e' }}><CheckCircledIcon /></div>}
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '15px', marginBottom: '15px' }}>
            <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: '4px', cursor: 'pointer' }} />
            <label htmlFor="terms" style={{ fontSize: '11px', color: '#4b5563', cursor: 'pointer' }}>I agree to the <span style={{ color: '#0051d3', fontWeight: 'bold' }}>Terms</span> and <span style={{ color: '#0051d3', fontWeight: 'bold' }}>Privacy Policy</span>.</label>
          </div>

          <button type="submit" style={styles.btn} disabled={loading || !agreed || strength.width !== '100%' || !isMatch}>
            {loading ? "Registering..." : "Create account"}
          </button>
        </form>
      </div>

      {showToast && (
        <div style={styles.toast}>
          <CheckCircledIcon width={24} height={24} />
          <div>
            <p style={{ margin: 0, fontWeight: 'bold' }}>Confirmation Sent!</p>
            <p style={{ margin: 0, fontSize: '12px' }}>Check your email to verify.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupModal;