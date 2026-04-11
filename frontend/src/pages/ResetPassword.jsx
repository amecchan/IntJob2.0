import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { confirmPasswordReset } from 'firebase/auth';
import { CheckIcon, EyeOpenIcon, EyeNoneIcon, CheckCircledIcon, LockClosedIcon } from '@radix-ui/react-icons';
import '../styles/ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get('oobCode');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const checks = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^A-Za-z0-9]/.test(newPassword)
  };

  const strengthScore = Object.values(checks).filter(Boolean).length;
  const isMatch = newPassword && newPassword === confirmPassword;
  const isReady = strengthScore === 4 && isMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isReady) return;
    setLoading(true);
    setError('');

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(true);
      
      // REDIRECT LOGIC: 
      // We navigate to the root and pass a state object "openLogin: true"
      setTimeout(() => {
        navigate('/', { state: { openLogin: true } });
      }, 3000);

    } catch (err) {
      console.error(err.code);
      setError("This link has expired or the request is no longer valid.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="reset-page-container">
        <div className="reset-card success-state">
          <div className="success-icon-wrapper">
            <CheckCircledIcon width={50} height={50} />
          </div>
          <h2>Password Updated!</h2>
          <p>Your security is our priority. You are being redirected to the login page.</p>
          <div className="loading-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-page-container">
      <div className="reset-card">
        <div className="reset-header">
          <div className="icon-badge">
            <LockClosedIcon width={24} height={24} />
          </div>
          <h1>New Password</h1>
          <p>Set a strong password to protect your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="reset-form">
          <div className="input-group">
            <label>NEW PASSWORD</label>
            <div className="password-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOpenIcon /> : <EyeNoneIcon />}
              </button>
            </div>
          </div>

          {newPassword && (
            <div className="strength-meter">
              <div 
                className={`strength-bar score-${strengthScore}`} 
                style={{ width: `${(strengthScore / 4) * 100}%` }}
              ></div>
            </div>
          )}

          <div className="checks-grid">
            <div className={`check-item ${checks.length ? 'valid' : ''}`}>
              <CheckIcon /> 8+ Characters
            </div>
            <div className={`check-item ${checks.upper ? 'valid' : ''}`}>
              <CheckIcon /> 1 Uppercase
            </div>
            <div className={`check-item ${checks.number ? 'valid' : ''}`}>
              <CheckIcon /> 1 Number
            </div>
            <div className={`check-item ${checks.special ? 'valid' : ''}`}>
              <CheckIcon /> 1 Symbol
            </div>
          </div>

          <div className="input-group">
            <label>CONFIRM PASSWORD</label>
            <input 
              type="password"
              placeholder="••••••••"
              className={confirmPassword && !isMatch ? 'input-error' : ''}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword && (
               <p className={`match-text ${isMatch ? 'text-green' : 'text-red'}`}>
                 {isMatch ? "✓ Passwords match" : "✕ Passwords do not match"}
               </p>
            )}
          </div>

          {error && <div className="error-banner">{error}</div>}

          <button 
            type="submit" 
            disabled={!isReady || loading}
            className="submit-btn"
          >
            {loading ? "Updating Account..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;