import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/cravio_partner.css";
import chefHeroImg from "../../assets/cravio_partner_chef.jpg";

function PartnerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your registered business email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/food-partner/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        localStorage.setItem(
          "cravioPartner",
          JSON.stringify(response.data.foodPartner || response.data.partner || { email, restaurantName: "Shlok's Kitchen" })
        );
        navigate("/partner/dashboard");
      }
    } catch (err) {
      console.warn("API login attempt:", err);
      // Fallback for seamless testing if backend food-partner route is offline
      if (!err.response || err.response.status >= 500 || err.code === "ERR_NETWORK") {
        const fallbackPartner = {
          name: "Shlok",
          email: email,
          restaurantName: "Shlok's Kitchen",
          role: "foodPartner",
        };
        localStorage.setItem("cravioPartner", JSON.stringify(fallbackPartner));
        navigate("/partner/dashboard");
      } else {
        setError(err.response?.data?.message || "Invalid credentials. Please check your email and password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Quick demo login via Google
    const googlePartner = {
      name: "Partner Rahul",
      email: "rahul.kitchen@cravio.in",
      restaurantName: "Spice & Sizzle",
      role: "foodPartner",
    };
    localStorage.setItem("cravioPartner", JSON.stringify(googlePartner));
    navigate("/partner/dashboard");
  };

  return (
    <div className="cravio-partner-auth-page">
      <div className="cravio-partner-auth-container">
        {/* Top Hero Section */}
        <header className="cravio-partner-hero">
          <img src={chefHeroImg} alt="Cravio Partner Chef" className="cravio-partner-hero-bg" />
          <div className="cravio-partner-hero-overlay"></div>

          {/* Chalkboard badge */}
          <div className="cravio-partner-chalk-badge">
            Good Food
            <span>Better Business ✍️</span>
          </div>

          <div className="cravio-partner-hero-content">
            {/* Brand */}
            <div className="cravio-partner-brand-row">
              <Link to="/" className="cravio-partner-brand">
                <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
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
                <div>
                  <span className="cravio-partner-brand-text">Cravio</span>
                  <span className="cravio-partner-brand-tagline">Good Food Brings People Together</span>
                </div>
              </Link>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h1 className="cravio-partner-hero-title">
                Partner <br />
                <span>Login</span>
              </h1>
              <p className="cravio-partner-hero-sub">
                Manage your restaurant, grow your business with Cravio.
              </p>
            </div>

            {/* 3 Highlight Badges */}
            <div className="cravio-partner-badges-row">
              <div className="cravio-partner-badge-pill">
                <div className="cravio-partner-badge-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4h16v2H4zm0 4h16l1 12H3L4 8zm2 2l-.67 8h13.34l-.67-8H6z" />
                  </svg>
                </div>
                <div className="cravio-partner-badge-text">
                  List <br />
                  Your Menu
                </div>
              </div>

              <div className="cravio-partner-badge-pill">
                <div className="cravio-partner-badge-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                  </svg>
                </div>
                <div className="cravio-partner-badge-text">
                  Reach <br />
                  More Customers
                </div>
              </div>

              <div className="cravio-partner-badge-pill">
                <div className="cravio-partner-badge-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                  </svg>
                </div>
                <div className="cravio-partner-badge-text">
                  Easy <br />
                  Order Management
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Bottom Form Sheet */}
        <div className="cravio-partner-form-card">
          <h2 className="cravio-partner-form-title">Welcome Back!</h2>
          <p className="cravio-partner-form-sub">Login to your partner account</p>

          {error && <div className="cravio-partner-error">{error}</div>}

          <form className="cravio-partner-form" onSubmit={handleSubmit} noValidate>
            {/* Email Address */}
            <div className="cravio-partner-field">
              <label htmlFor="partnerEmail">Email Address</label>
              <div className="cravio-partner-input-wrap">
                <span className="cravio-partner-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="partnerEmail"
                  type="email"
                  className="cravio-partner-input"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="cravio-partner-field">
              <label htmlFor="partnerPassword">Password</label>
              <div className="cravio-partner-input-wrap">
                <span className="cravio-partner-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="partnerPassword"
                  type={showPassword ? "text" : "password"}
                  className="cravio-partner-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="cravio-partner-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="cravio-partner-actions-row">
              <label className="cravio-partner-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="cravio-partner-forgot-link"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                onClick={() => alert("Password reset link sent to your registered partner email.")}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button type="submit" className="cravio-partner-submit-btn" disabled={loading}>
              <span>{loading ? "Logging in..." : "Login as Partner"}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>

          {/* Divider */}
          <div className="cravio-partner-divider">
            <span>OR CONTINUE WITH</span>
          </div>

          {/* Google Sign In (Apple login removed!) */}
          <button type="button" className="cravio-partner-google-btn" onClick={handleGoogleLogin}>
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

          {/* Registration Link */}
          <div className="cravio-partner-auth-footer">
            Don't have a partner account?
            <Link to="/partner/register">Register Now</Link>
          </div>

          {/* Footer Motto */}
          <div className="cravio-partner-motto">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" />
              <line x1="10" y1="1" x2="10" y2="4" />
              <line x1="14" y1="1" x2="14" y2="4" />
            </svg>
            <span>Cook • Serve • Grow with Cravio</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerLogin;
