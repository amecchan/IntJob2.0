import React, { useState } from 'react';

const LoginModal = ({ onClose, onForgotClick, onSignupClick }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>&times;</button>
        <h2>Login</h2>
        <form className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" required />
          </div>
          <div className="form-group" style={{ position: 'relative' }}>
            <label>Password</label>
            <input type={showPassword ? 'text' : 'password'} required />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
            <button type="button" className="forgot-link" onClick={onForgotClick}>
              Forgot password?
            </button>
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
