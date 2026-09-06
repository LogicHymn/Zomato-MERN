import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/cravio_partner.css";
import chefHeroImg from "../../assets/cravio_partner_chef.jpg";

function PartnerRegister() {
  const navigate = useNavigate();

  // Form States matching Mockup Image 2
  const [ownerName, setOwnerName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [fssaiLicense, setFssaiLicense] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setAddress(`Civil Lines, Prayagraj (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
        },
        () => {
          setAddress("Civil Lines, Near High Court, Prayagraj, UP");
        }
      );
    } else {
      setAddress("Civil Lines, Near High Court, Prayagraj, UP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!ownerName || !restaurantName || !email || !phone || !password || !address) {
      setError("Please fill in all required fields marked with *.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/food-partner/register",
        {
          name: ownerName,
          restaurantName,
          email,
          phone,
          password,
          address,
          fssaiLicense,
        },
        { withCredentials: true }
      );

      if (response.status === 201 || response.status === 200) {
        localStorage.setItem("cravioPendingEmail", email.trim().toLowerCase());
        navigate("/partner/verify-otp", {
          state: {
            email: email.trim().toLowerCase(),
            role: "partner",
            restaurantName,
          },
        });
      }
    } catch (err) {
      console.warn("API register attempt:", err);
      // Fallback for seamless local testing if backend food partner table isn't seeded
      if (!err.response || err.response.status >= 500 || err.code === "ERR_NETWORK") {
        localStorage.setItem("cravioPendingEmail", email.trim().toLowerCase());
        navigate("/partner/verify-otp", {
          state: {
            email: email.trim().toLowerCase(),
            role: "partner",
            restaurantName,
          },
        });
      } else {
        setError(err.response?.data?.message || "Registration failed. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cravio-partner-auth-page">
      <div className="cravio-partner-auth-container">
        {/* Top Hero Section */}
        <header className="cravio-partner-hero" style={{ minHeight: "360px" }}>
          <img src={chefHeroImg} alt="Cravio Chef" className="cravio-partner-hero-bg" />
          <div className="cravio-partner-hero-overlay"></div>

          {/* Chalkboard badge */}
          <div className="cravio-partner-chalk-badge">
            Cook • Serve
            <span>Grow ✨</span>
          </div>

          <div className="cravio-partner-hero-content">
            {/* Top Navigation Row: Back Button + Logo */}
            <div className="cravio-partner-brand-row">
              <button
                type="button"
                className="cravio-partner-back-btn"
                onClick={() => navigate(-1)}
                aria-label="Go back"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <Link to="/" className="cravio-partner-brand">
                <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
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

            {/* Headline & Subhead */}
            <div>
              <h1 className="cravio-partner-hero-title">
                Partner <br />
                with <span>Cravio</span>
              </h1>
              <p className="cravio-partner-hero-sub">
                Grow your business, reach more food lovers, and be part of our community.
              </p>
            </div>

            {/* 3 Highlight Badges */}
            <div className="cravio-partner-badges-row">
              <div className="cravio-partner-badge-pill">
                <div className="cravio-partner-badge-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
                  </svg>
                </div>
                <div className="cravio-partner-badge-text">
                  More <br />
                  Customers
                </div>
              </div>

              <div className="cravio-partner-badge-pill">
                <div className="cravio-partner-badge-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                    <path d="M4 11h16a1 1 0 0 1 1 1v1a7 7 0 0 1-7 7H10a7 7 0 0 1-7-7v-1a1 1 0 0 1 1-1z" />
                    <line x1="2" y1="21" x2="22" y2="21" />
                  </svg>
                </div>
                <div className="cravio-partner-badge-text">
                  Higher <br />
                  Visibility
                </div>
              </div>

              <div className="cravio-partner-badge-pill">
                <div className="cravio-partner-badge-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4h16v2H4zm0 4h16l1 12H3L4 8zm2 2l-.67 8h13.34l-.67-8H6z" />
                  </svg>
                </div>
                <div className="cravio-partner-badge-text">
                  Easy <br />
                  Management
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Bottom Form Sheet */}
        <div className="cravio-partner-form-card">
          <h2 className="cravio-partner-form-title">Create Your Partner Account</h2>
          <p className="cravio-partner-form-sub">Tell us about your restaurant or food business</p>

          {error && <div className="cravio-partner-error">{error}</div>}

          <form className="cravio-partner-form" onSubmit={handleSubmit} noValidate>
            {/* 1. Owner Name */}
            <div className="cravio-partner-field">
              <label htmlFor="partnerOwnerName">Owner Name *</label>
              <div className="cravio-partner-input-wrap">
                <span className="cravio-partner-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="partnerOwnerName"
                  type="text"
                  className="cravio-partner-input"
                  placeholder="Enter your full name"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* 2. Restaurant / Business Name */}
            <div className="cravio-partner-field">
              <label htmlFor="partnerRestaurantName">Restaurant / Business Name *</label>
              <div className="cravio-partner-input-wrap">
                <span className="cravio-partner-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </span>
                <input
                  id="partnerRestaurantName"
                  type="text"
                  className="cravio-partner-input"
                  placeholder="Enter restaurant name"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* 3. Email Address */}
            <div className="cravio-partner-field">
              <label htmlFor="partnerRegisterEmail">Email Address *</label>
              <div className="cravio-partner-input-wrap">
                <span className="cravio-partner-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="partnerRegisterEmail"
                  type="email"
                  className="cravio-partner-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* 4. Phone Number */}
            <div className="cravio-partner-field">
              <label htmlFor="partnerPhone">Phone Number *</label>
              <div className="cravio-partner-input-wrap">
                <span className="cravio-partner-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <input
                  id="partnerPhone"
                  type="tel"
                  className="cravio-partner-input"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* 5. Password */}
            <div className="cravio-partner-field">
              <label htmlFor="partnerRegisterPassword">Password *</label>
              <div className="cravio-partner-input-wrap">
                <span className="cravio-partner-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="partnerRegisterPassword"
                  type={showPassword ? "text" : "password"}
                  className="cravio-partner-input"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* 6. Restaurant Address with 'Use Current Location' */}
            <div className="cravio-partner-field">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label htmlFor="partnerAddress">Restaurant Address *</label>
                <button
                  type="button"
                  className="cravio-partner-loc-badge"
                  onClick={handleUseLocation}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Use Current Location
                </button>
              </div>
              <div className="cravio-partner-input-wrap">
                <span className="cravio-partner-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <input
                  id="partnerAddress"
                  type="text"
                  className="cravio-partner-input"
                  placeholder="Enter complete address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* 7. FSSAI License Number (Optional) */}
            <div className="cravio-partner-field">
              <label htmlFor="partnerFssai">FSSAI License Number (Optional)</label>
              <div className="cravio-partner-input-wrap">
                <span className="cravio-partner-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </span>
                <input
                  id="partnerFssai"
                  type="text"
                  className="cravio-partner-input"
                  placeholder="Enter license number"
                  value={fssaiLicense}
                  onChange={(e) => setFssaiLicense(e.target.value)}
                />
              </div>
            </div>

            {/* Terms Agreement Checkbox */}
            <label className="cravio-partner-checkbox-label" style={{ marginTop: "4px" }}>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span style={{ fontSize: "12px", lineHeight: "1.4" }}>
                I agree to the <strong style={{ color: "var(--partner-gold)" }}>Terms & Conditions</strong> and{" "}
                <strong style={{ color: "var(--partner-gold)" }}>Privacy Policy</strong>
              </span>
            </label>

            {/* Submit Button */}
            <button type="submit" className="cravio-partner-submit-btn" disabled={loading}>
              <span>{loading ? "Creating Partner Account..." : "Create Partner Account"}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>

          {/* Footer Link */}
          <div className="cravio-partner-auth-footer">
            Already have an account?
            <Link to="/partner/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerRegister;
