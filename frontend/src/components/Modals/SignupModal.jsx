import React, { useState } from 'react';

const SignupModal = ({ onClose, onLoginClick }) => {
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="modal" style={{ display: 'flex' }}>
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>&times;</button>
        <h2>Create Account</h2>
        <form className="auth-form">
          <div className="form-group">
            <label>Full name</label>
            <input type="text" placeholder="John Doe" required />
          </div>

          <div className="form-group">
            <label>Role:</label>
            <select
              className="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="" disabled hidden>Select your role</option>
              <option value="applicant">Applicant (Looking for a job)</option>
              <option value="employer">Employer (Looking to hire)</option>
            </select>
          </div>

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
          </div>

          <button type="submit" className="btn btn-primary">Create account</button>
          <p className="toggle-link">
            Already have an account?{' '}
            <button type="button" onClick={onLoginClick}>Login</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
