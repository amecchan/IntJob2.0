import React, { useState, useRef } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';

const OTPModal = ({ isOpen, onClose, email, onVerifySuccess }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  if (!isOpen) return null;

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    // Handle paste or multi-character input
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next box
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move focus back on backspace if current box is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/resend-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      alert(data.message || data.error);
    } catch (err) {
      alert("Failed to resend. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    
    if (finalOtp.length < 6) {
      alert("Please enter all 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/verify-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email, 
          otp: finalOtp 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account Verified Successfully!");
        onVerifySuccess(); // Triggers handleOTPVerifySuccess in Landing.jsx
      } else {
        alert(data.error || "Invalid Verification Code");
      }
    } catch (err) {
      console.error("OTP Error:", err);
      alert("Server connection failed. Is Django running?");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '20px' },
    content: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', textAlign: 'center', position: 'relative', fontFamily: "'Poppins', sans-serif" },
    input: { width: '45px', height: '55px', fontSize: '24px', textAlign: 'center', borderRadius: '8px', border: '1px solid #d1d5db', margin: '0 5px', outline: 'none', fontWeight: 'bold', color: '#111' },
    button: { width: '100%', padding: '14px', backgroundColor: '#0051d3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', opacity: loading ? 0.7 : 1 },
    resendBtn: { background: 'none', border: 'none', color: '#0051d3', fontWeight: '600', cursor: 'pointer', fontSize: '14px', marginTop: '15px', textDecoration: 'underline' }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.content} onClick={(e) => e.stopPropagation()}>
        <button 
          style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', cursor: 'pointer' }} 
          onClick={onClose}
        >
          <Cross2Icon width={20} height={20} />
        </button>
        
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '10px' }}>Verify Your Email</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '25px' }}>
          Enter the 6-digit code sent to <br/><b>{email}</b>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                style={styles.input}
                required
              />
            ))}
          </div>
          
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <button 
          onClick={handleResend} 
          style={styles.resendBtn} 
          disabled={resending}
        >
          {resending ? "Resending..." : "Resend Code"}
        </button>
      </div>
    </div>
  );
};

export default OTPModal;