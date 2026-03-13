import React, { useState } from 'react';

const CORRECT_CODE = '123456';

const ForgotPasswordModal = ({ onClose, onLoginClick }) => {
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (verificationCode === CORRECT_CODE) {
      setStep(4);
      setError('');
    } else {
      setError("Code doesn't match. Enter your email again for verification code.");
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
    } else {
      setError('');
      alert('Password updated successfully!');
      onClose();
      onLoginClick();
    }
  };

  const resetToStep1 = () => {
    setStep(1);
    setError('');
    setVerificationCode('');
  };

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>&times;</button>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <>
            <h3>Reset Password</h3>
            <p className="muted">Enter your email to receive a verification code.</p>
            <form className="auth-form" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <input type="email" placeholder="email@example.com" required />
              <button type="submit" className="btn btn-primary">Send Code</button>
              <p className="toggle-link">
                <button type="button" onClick={onLoginClick}>Back to Login</button>
              </p>
            </form>
          </>
        )}

        {/* Step 2: Success Message */}
        {step === 2 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
            <h3>Email Sent!</h3>
            <p className="muted">We've sent a 6-digit code to your email.</p>
            <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => setStep(3)}>
              Enter Code
            </button>
          </div>
        )}

        {/* Step 3: Code Verification */}
        {step === 3 && (
          <>
            <h3>Verify Code</h3>
            <p className="muted">Enter the 6-digit code sent to your email.</p>
            <form className="auth-form" onSubmit={handleCodeSubmit}>
              <input
                type="text"
                placeholder="000000"
                maxLength="6"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              {error && <p className="error-text">{error}</p>}
              <button type="submit" className="btn btn-primary">Verify Code</button>
              {error && (
                <p className="toggle-link">
                  <button type="button" onClick={resetToStep1}>Try Email Again</button>
                </p>
              )}
            </form>
          </>
        )}

        {/* Step 4: New Password */}
        {step === 4 && (
          <>
            <h3>New Password</h3>
            <p className="muted">Create a strong, new password.</p>
            <form className="auth-form" onSubmit={handlePasswordSubmit}>
              <div className="form-group" style={{ position: 'relative' }}>
                <label>New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '👁️' : '🙈'}
                </button>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="error-text">{error}</p>}
              <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
