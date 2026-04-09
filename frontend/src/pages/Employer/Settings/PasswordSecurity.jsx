import React, { useState } from 'react';
import { LockClosedIcon, UpdateIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

const PasswordSecurity = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (passwords.new !== passwords.confirm) {
      return showToast("Error", "New passwords do not match.", "error");
    }
    if (passwords.new.length < 6) {
      return showToast("Security", "Password must be at least 6 characters.", "error");
    }

    setIsUpdating(true);
    try {
      // 1. Re-authenticate the user first (Required by Firebase for sensitive changes)
      const credential = EmailAuthProvider.credential(user.email, passwords.current);
      await reauthenticateWithCredential(user, credential);

      // 2. Update the password
      await updatePassword(user, passwords.new);

      showToast("Security Updated", "Your password has been changed successfully.", "success");
      setPasswords({ current: "", new: "", confirm: "" }); // Clear form
    } catch (error) {
      let message = "Failed to update password.";
      if (error.code === 'auth/wrong-password') message = "Current password is incorrect.";
      showToast("Update Failed", message, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="glass-card settings-content-card p-10">
      <div className="flex items-center gap-3 mb-10">
        <LockClosedIcon className="w-5 h-5 text-indigo-600" />
        <h3 className="settings-section-title">Update Password</h3>
      </div>
      
      <form onSubmit={handlePasswordUpdate}>
        <div className="settings-form-grid">
          <div className="input-group full-width">
            <label>Current Password</label>
            <input 
              type="password" 
              placeholder="••••••••••••••" 
              required
              value={passwords.current}
              onChange={(e) => setPasswords({...passwords, current: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>New Password</label>
            <input 
              type="password" 
              required
              value={passwords.new}
              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
            />
          </div>
          <div className="input-group">
            <label>Confirm New Password</label>
            <input 
              type="password" 
              required
              value={passwords.confirm}
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="save-btn-settings mt-8" 
          disabled={isUpdating}
        >
          {isUpdating ? <UpdateIcon className="animate-spin" /> : <CheckCircledIcon />}
          {isUpdating ? "Updating..." : "Update Password"}
        </button>
      </form>

      <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100">
        <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
          <strong>Security Tip:</strong> Use a combination of uppercase, lowercase, numbers, and symbols to ensure your employer account remains secure.
        </p>
      </div>
    </div>
  );
};

export default PasswordSecurity;