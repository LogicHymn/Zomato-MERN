import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/cravio_auth.css";

// Decorative Photography Asset
import saladDishImg from "../../assets/cravio_salad_dish.jpg";

function UserLogin() {
  const navigate = useNavigate();

  // Form States
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status States
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Please enter your email/phone and password.");
      return;
    }

    try {
      setLoading(true);
      const isEmail = identifier.includes("@");
      const payload = isEmail
        ? { email: identifier.trim().toLowerCase(), password }
        : { username: identifier.trim(), password };

      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        payload,
        { withCredentials: true }
      );

      if (response.status === 200) {
        localStorage.setItem("cravioUser", JSON.stringify(response.data.user));
        navigate("/user/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cravio-auth-wrapper">
      <main className="cravio-auth-container-wide">
        {/* Left Column: Visual Brand Showcase Panel (Desktop) */}
        <section className="cravio-auth-showcase-panel">
          <div className="cravio-auth-showcase-top">
            <Link to="/" className="cravio-auth-brand-badge">
              <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="17" fill="#F7A827" />
                <path
                  d="M13.5 9V17C13.5 19.5 15.5 21 17 21.5V27.5C17 28.05 17.45 28.5 18 28.5C18.55 28.5 19 28.05 19 27.5V21.5C20.5 21 22.5 19.5 22.5 17V9"
                  stroke="#15161A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M16.5 9V15M19.5 9V15" stroke="#15161A" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="cravio-auth-brand-title">
                Cravio
                <span style={{ color: "#F7A827", transform: "translateY(-2px)", display: "inline-block" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#F7A827">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </span>
              </span>
            </Link>

            <div className="cravio-auth-media-box">
              <img
                src={saladDishImg}
                alt="Delicious grilled chicken salad"
                className="cravio-auth-media-img"
              />
            </div>
          </div>

          <p className="cravio-auth-quote">
            “Good food is the foundation of genuine happiness. Welcome back to <span>Cravio</span>.”
          </p>
        </section>

        {/* Right Column: Authentication Form */}
        <section className="cravio-auth-form-panel">
          {/* Top Bar with Back Button */}
          <div className="cravio-auth-top-bar">
            <button
              type="button"
              className="cravio-back-btn"
              onClick={() => navigate("/")}
              aria-label="Back to home"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <span style={{ fontSize: "12px", color: "#9da4b0", fontWeight: "600" }}>
              Customer Portal
            </span>
          </div>

          <header>
            <h1 className="cravio-auth-heading">
              Welcome <span className="cravio-accent-word">Back!</span>
            </h1>
            <p className="cravio-auth-subtitle">
              Log in to continue your food journey with Cravio
            </p>
          </header>

          {/* Error notification */}
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

          <form className="cravio-form" onSubmit={handleSubmit} noValidate>
            {/* Identifier: Email or Phone */}
            <div className="cravio-input-group">
              <label className="cravio-input-label" htmlFor="login-identifier">
                Email or Phone Number
              </label>
              <div className="cravio-input-box">
                <span className="cravio-input-icon-lead">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <path d="M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  id="login-identifier"
                  type="text"
                  className="cravio-field-input"
                  placeholder="name@example.com or phone"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="cravio-input-group">
              <label className="cravio-input-label" htmlFor="login-password">
                Password
              </label>
              <div className="cravio-input-box">
                <span className="cravio-input-icon-lead">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="3" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    <circle cx="12" cy="16" r="1.5" />
                  </svg>
                </span>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="cravio-field-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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

            {/* Forgot Password Link */}
            <div className="cravio-forgot-row">
              <button
                type="button"
                className="cravio-forgot-link"
                onClick={() => alert("Password reset link has been dispatched to your email.")}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              id="btn-login-submit"
              type="submit"
              className="cravio-submit-btn"
              disabled={loading}
            >
              <span>{loading ? "Logging in..." : "Login"}</span>
            </button>
          </form>

          {/* Social Divider */}
          <div className="cravio-social-divider">
            <span>or continue with</span>
          </div>

          {/* Social Sign-In */}
          {/* Social Sign-In (Google only) */}
          <div className="cravio-social-wide-row single">
            <button type="button" className="cravio-social-wide-btn" title="Continue with Google">
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
              <span>Continue with Google</span>
            </button>
          </div>

          <footer className="cravio-auth-footer">
            <span>Don’t have an account?</span>
            <Link to="/user/register" className="cravio-auth-footer-link">
              Register
            </Link>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default UserLogin;
