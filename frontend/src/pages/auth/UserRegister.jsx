import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/cravio_auth.css";

// Decorative Photography Assets
import saladDishImg from "../../assets/cravio_salad_dish.jpg";
import mintSprigImg from "../../assets/cravio_mint_sprig.jpg";
import tomatoHalfImg from "../../assets/cravio_tomato_half.jpg";
import chiliBowlImg from "../../assets/cravio_chili_bowl.jpg";

function UserRegister() {
  const navigate = useNavigate();

  // Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Status States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Email validation check
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isEmailValid) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    // Generate unique username from Full Name and random digits if needed
    const baseUsername = fullName.toLowerCase().trim().replace(/[^a-z0-9]/g, "_");
    const username = baseUsername.length >= 3 ? baseUsername : `${baseUsername}_${Date.now().toString().slice(-4)}`;

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          username,
          email: email.trim().toLowerCase(),
          password,
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        navigate("/user/verify-otp", { state: { email: email.trim().toLowerCase() } });
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cravio-auth-wrapper">
      {/* Background Ribbon Wave */}
      <div className="cravio-auth-ribbon" aria-hidden="true">
        <div className="cravio-auth-ribbon-path"></div>
      </div>

      {/* Decorative Food Elements (Desktop ambient scene) */}
      <img
        src={mintSprigImg}
        alt=""
        className="cravio-auth-decor cravio-auth-decor-mint-top"
        aria-hidden="true"
      />
      <img
        src={tomatoHalfImg}
        alt=""
        className="cravio-auth-decor cravio-auth-decor-tomato-top"
        aria-hidden="true"
      />
      <img
        src={chiliBowlImg}
        alt=""
        className="cravio-auth-decor cravio-auth-decor-bowl-bottom"
        aria-hidden="true"
      />
      <img
        src={mintSprigImg}
        alt=""
        className="cravio-auth-decor cravio-auth-decor-mint-bottom"
        aria-hidden="true"
      />

      {/* Peppercorn Accents */}
      <div className="cravio-auth-decor cravio-auth-peppercorns-right" aria-hidden="true">
        <span className="peppercorn" style={{ width: "10px", height: "10px" }}></span>
        <span className="peppercorn" style={{ width: "13px", height: "13px", marginLeft: "8px" }}></span>
        <span className="peppercorn" style={{ width: "9px", height: "9px" }}></span>
      </div>
      <div className="cravio-auth-decor cravio-auth-peppercorns-left" aria-hidden="true">
        <span className="peppercorn" style={{ width: "11px", height: "11px" }}></span>
        <span className="peppercorn" style={{ width: "8px", height: "8px", marginLeft: "10px" }}></span>
      </div>

      {/* Central Phone App Container */}
      <main className="cravio-auth-phone-container">
        {/* Top Bar: Back Button & Salad Dish Peek */}
        <div className="cravio-auth-top-bar">
          <button
            type="button"
            className="cravio-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>

          {/* Grilled Chicken Salad Dish Peek */}
          <div className="cravio-dish-peek-wrapper" aria-hidden="true">
            <img
              src={saladDishImg}
              alt="Fresh healthy salad dish"
              className="cravio-dish-peek-img"
            />
            {/* Sparkle doodle next to dish */}
            <div className="cravio-dish-sparkles">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 26L4 20" stroke="#F7A827" strokeWidth="3" strokeLinecap="round" />
                <path d="M18 16L18 4" stroke="#F7A827" strokeWidth="3" strokeLinecap="round" />
                <path d="M24 24L32 20" stroke="#F7A827" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Header Title Section */}
        <header className="cravio-auth-header">
          <h1 className="cravio-auth-title">
            Create your
            <br />
            account <span className="cravio-wave-emoji">👋</span>
          </h1>

          {/* Wavy Underline */}
          <svg className="cravio-title-underline" viewBox="0 0 120 12" fill="none">
            <path
              d="M2 9C20 4 40 10 60 6C80 2 100 8 118 4"
              stroke="#F7A827"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>

          <p className="cravio-auth-subtitle">Let's get you started with Cravio</p>
        </header>

        {/* Error Notification */}
        {error && (
          <div className="cravio-alert-error" role="alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form className="cravio-form" onSubmit={handleSubmit} noValidate>
          {/* 1. Full Name */}
          <div className="cravio-input-group">
            <label className="cravio-input-label" htmlFor="register-fullname">
              Full Name
            </label>
            <div className="cravio-input-box">
              <span className="cravio-input-icon-lead">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </span>
              <input
                id="register-fullname"
                type="text"
                className="cravio-field-input"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
              />
              <span className="cravio-input-icon-trail" style={{ opacity: 0.6 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
            </div>
          </div>

          {/* 2. Email Address */}
          <div className="cravio-input-group">
            <label className="cravio-input-label" htmlFor="register-email">
              Email Address
            </label>
            <div className="cravio-input-box">
              <span className="cravio-input-icon-lead">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </span>
              <input
                id="register-email"
                type="email"
                className="cravio-field-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              {isEmailValid && (
                <span className="cravio-input-icon-trail valid-check" title="Valid email address">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              )}
            </div>
          </div>

          {/* 3. Phone Number */}
          <div className="cravio-input-group">
            <label className="cravio-input-label" htmlFor="register-phone">
              Phone Number
            </label>
            <div className="cravio-input-box">
              {/* Country Code Selector */}
              <div className="cravio-phone-prefix">
                <span className="cravio-flag-icon" role="img" aria-label="India flag">
                  🇮🇳
                </span>
                <span>+91</span>
                <span className="cravio-prefix-caret">▼</span>
              </div>
              <input
                id="register-phone"
                type="tel"
                className="cravio-field-input"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
              <span className="cravio-input-icon-trail" style={{ opacity: 0.6 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
            </div>
          </div>

          {/* 4. Password */}
          <div className="cravio-input-group">
            <label className="cravio-input-label" htmlFor="register-password">
              Password
            </label>
            <div className="cravio-input-box">
              <span className="cravio-input-icon-lead">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </span>
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                className="cravio-field-input"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="cravio-input-icon-trail"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* 5. Confirm Password */}
          <div className="cravio-input-group">
            <label className="cravio-input-label" htmlFor="register-confirm-password">
              Confirm Password
            </label>
            <div className="cravio-input-box">
              <span className="cravio-input-icon-lead">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </span>
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                className="cravio-field-input"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="cravio-input-icon-trail"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Terms & Privacy Agreement */}
          <div
            className="cravio-terms-row"
            onClick={() => setAgreedToTerms(!agreedToTerms)}
            role="checkbox"
            aria-checked={agreedToTerms}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                setAgreedToTerms(!agreedToTerms);
              }
            }}
          >
            <div className={`cravio-checkbox-custom ${agreedToTerms ? "checked" : ""}`}>
              {agreedToTerms && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="cravio-terms-text">
              I agree to the{" "}
              <a
                href="#terms"
                className="cravio-terms-link"
                onClick={(e) => e.stopPropagation()}
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#privacy"
                className="cravio-terms-link"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
              </a>
            </span>
          </div>

          {/* Create Account Submit Button */}
          <button
            id="btn-create-account"
            type="submit"
            className="cravio-submit-btn"
            disabled={loading}
          >
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

        {/* Or Continue With Social Login */}
        <div className="cravio-social-divider">
          <span>or continue with</span>
        </div>

        <div className="cravio-social-row">
          {/* Google */}
          <button
            type="button"
            className="cravio-social-btn"
            title="Continue with Google"
            aria-label="Continue with Google"
          >
            <svg viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
              />
            </svg>
          </button>

          {/* Apple */}
          <button
            type="button"
            className="cravio-social-btn"
            title="Continue with Apple"
            aria-label="Continue with Apple"
          >
            <svg viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.71-.93 2.73 1.01.08 2.03-.49 2.63-1.23z" />
            </svg>
          </button>

          {/* Facebook */}
          <button
            type="button"
            className="cravio-social-btn"
            title="Continue with Facebook"
            aria-label="Continue with Facebook"
          >
            <svg viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </button>
        </div>

        {/* Footer Link */}
        <footer className="cravio-auth-footer">
          <span>Already have an account?</span>
          <Link to="/user/login" className="cravio-auth-footer-link">
            Login
          </Link>
        </footer>
      </main>
    </div>
  );
}

export default UserRegister;
