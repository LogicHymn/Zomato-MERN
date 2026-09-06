import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import InputField from "../../components/auth/InputField";
import AuthButton from "../../components/auth/AuthButton";
import axios from "axios";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill email if passed from Registration page via navigate state
  const initialEmail = location.state?.email || "";

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const email = e.target.email.value.trim();
    const otp = e.target.otp.value.trim();

    if (!email || !otp) {
      setError("Please enter both email and OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/auth/verify-otp",
        { email, otp },
        { withCredentials: true }
      );

      console.log("OTP Verification response:", response.data);

      if (response.status === 200) {
        setSuccess("Email verified successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/user/login");
        }, 1500);
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(err.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          badge="Email Verification"
          badgeType="user"
          title="Verify OTP"
          subtitle="Enter the 6-digit OTP sent to your registered email address"
        />

        {error && (
          <div style={{ color: "#e23744", fontSize: "13px", marginBottom: "12px", textAlign: "center" }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ color: "#10b981", fontSize: "13px", marginBottom: "12px", textAlign: "center", fontWeight: "600" }}>
            {success}
          </div>
        )}

        <form className="auth-form" onSubmit={submitHandler} noValidate>
          <InputField
            id="email"
            label="Registered Email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            defaultValue={initialEmail}
            required
          />

          <InputField
            id="otp"
            label="Verification Code (OTP)"
            type="text"
            placeholder="e.g. 123456"
            autoComplete="one-time-code"
            helperText="Check your email inbox or spam folder"
            required
          />

          <AuthButton type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </AuthButton>
        </form>

        <footer className="auth-footer">
          <div className="auth-footer-row">
            <span>Didn't receive code or need to sign in?</span>
            <Link to="/user/login" className="auth-link-text">
              Go to Login
            </Link>
          </div>

          <div className="auth-switch-badge">
            Need to register again?
            <Link to="/user/register">Sign Up</Link>
          </div>
        </footer>
      </AuthCard>
    </AuthLayout>
  );
}

export default VerifyOtp;
