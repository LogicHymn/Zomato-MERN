import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * PartnerVerifyOtp Page
 * Route: /partner/verify-otp
 */
function PartnerVerifyOtp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendNotif, setResendNotif] = useState(false);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 5) {
      const nextInput = document.getElementById(`partner-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`partner-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI-only navigation to partner dashboard
    navigate("/partner/dashboard");
  };

  const handleResend = () => {
    setResendNotif(true);
    setTimeout(() => setResendNotif(false), 2500);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-badge" style={{ color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)" }}>
            Partner Verification
          </span>
          <h1 className="auth-title">Verify Partner Email</h1>
          <p className="auth-subtitle">Enter the 6-digit verification code sent to your partner business email.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="otp-input-row">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`partner-otp-${idx}`}
                type="text"
                maxLength={1}
                className="otp-box"
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
              />
            ))}
          </div>

          {resendNotif && (
            <div
              style={{
                fontSize: 12,
                color: "var(--status-available)",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              ✓ New verification code sent to your partner email!
            </div>
          )}

          <button
            type="submit"
            className="cravio-btn cravio-btn-primary"
            style={{ width: "100%", padding: 12, marginTop: 8, background: "#f59e0b", color: "#000" }}
          >
            Verify & Open Kitchen Dashboard
          </button>
        </form>

        <div className="auth-footer-links">
          Didn't receive code?
          <button
            type="button"
            onClick={handleResend}
            style={{
              background: "none",
              border: "none",
              color: "#f59e0b",
              fontWeight: 600,
              cursor: "pointer",
              marginLeft: 4,
            }}
          >
            Resend OTP
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12 }}>
          <Link to="/partner/login" style={{ color: "var(--text-muted)" }}>
            ← Back to Partner Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PartnerVerifyOtp;
