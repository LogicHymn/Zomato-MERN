import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/cravio_auth.css";
import chefHeroImg from "../../assets/cravio_partner_chef.jpg";

function PartnerRegister() {
  const navigate = useNavigate();

  // Form States
  const [ownerName, setOwnerName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [fssaiLicense, setFssaiLicense] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

    if (!ownerName.trim() || !restaurantName.trim() || !email.trim() || !phone.trim() || !password || !address.trim()) {
      setError("Please fill in all required fields marked with *.");
      return;
    }

    if (!isEmailValid) {
      setError("Please enter a valid business email address.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Cravio Partner Terms & Conditions.");
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
          name: ownerName.trim(),
          restaurantName: restaurantName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          address: address.trim(),
          fssaiLicense: fssaiLicense.trim(),
        },
        { withCredentials: true }
      );

      if (response.status === 201 || response.status === 200) {
        localStorage.setItem("cravioPendingEmail", email.trim().toLowerCase());
        navigate("/partner/verify-otp", {
          state: {
            email: email.trim().toLowerCase(),
            role: "partner",
            restaurantName: restaurantName.trim(),
          },
        });
      }
    } catch (err) {
      console.warn("API register attempt:", err);
      // Fallback for seamless local testing
      if (!err.response || err.response.status >= 500 || err.code === "ERR_NETWORK") {
        localStorage.setItem("cravioPendingEmail", email.trim().toLowerCase());
        navigate("/partner/verify-otp", {
          state: {
            email: email.trim().toLowerCase(),
            role: "partner",
            restaurantName: restaurantName.trim(),
          },
        });
      } else {
        setError(err.response?.data?.message || "Registration failed. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    const googlePartner = {
      name: ownerName || "Chef Owner",
      email: email || "newpartner@cravio.in",
      restaurantName: restaurantName || "Chef's Kitchen",
      role: "foodPartner",
    };
    localStorage.setItem("cravioPartner", JSON.stringify(googlePartner));
    navigate("/partner/dashboard");
  };

  return (
    <div className="cravio-auth-wrapper">
      <main className="cravio-auth-container-wide partner-wide">
        {/* Left Column: Visual Partner Showcase Panel (Desktop) */}
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
                src={chefHeroImg}
                alt="Cravio Partner Kitchen"
                className="cravio-auth-media-img"
              />
            </div>

            <div className="cravio-partner-perks-row">
              <div className="cravio-partner-perk-card">
                <div className="cravio-partner-perk-icon">🍽️</div>
                <div className="cravio-partner-perk-title">50K+ Foodies</div>
                <div className="cravio-partner-perk-sub">Citywide Reach</div>
              </div>
              <div className="cravio-partner-perk-card">
                <div className="cravio-partner-perk-icon">⚡</div>
                <div className="cravio-partner-perk-title">Live Dispatch</div>
                <div className="cravio-partner-perk-sub">Fleet Assigned</div>
              </div>
              <div className="cravio-partner-perk-card">
                <div className="cravio-partner-perk-icon">💼</div>
                <div className="cravio-partner-perk-title">Zero Setup Fee</div>
                <div className="cravio-partner-perk-sub">Start Selling</div>
              </div>
            </div>
          </div>

          <p className="cravio-auth-quote">
            “Good food builds great stories. Partner with <span>Cravio</span> and scale your kitchen business effortlessly.”
          </p>
        </section>

        {/* Right Column: Partner Registration Form */}
        <section className="cravio-auth-form-panel">
          <div className="cravio-auth-top-bar">
            <button
              type="button"
              className="cravio-back-btn"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <span className="cravio-portal-pill">
              Food Partner Onboarding
            </span>
          </div>

          <header>
            <h1 className="cravio-auth-heading">
              Register Your <span className="cravio-accent-word">Kitchen</span>
            </h1>
            <p className="cravio-auth-subtitle">
              Reach hungry food lovers across your city and manage orders easily.
            </p>
          </header>

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
            {/* Row 1: Owner Name & Restaurant Name */}
            <div className="cravio-grid-2col">
              <div className="cravio-input-group">
                <label className="cravio-input-label" htmlFor="partner-owner">
                  Owner Name *
                </label>
                <div className="cravio-input-box">
                  <span className="cravio-input-icon-lead">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </span>
                  <input
                    id="partner-owner"
                    type="text"
                    className="cravio-field-input"
                    placeholder="Full name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="cravio-input-group">
                <label className="cravio-input-label" htmlFor="partner-restaurant">
                  Restaurant / Kitchen Name *
                </label>
                <div className="cravio-input-box">
                  <span className="cravio-input-icon-lead">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.48L23 5.05h-5V3h-2v2.05H8V3H6v2.05H1L2.65 21.5c.1.84.79 1.49 1.63 1.49h1.66c.8 0 1.47-.58 1.6-1.37l.63-3.62h8.92l.63 3.62c.13.79.8 1.37 1.6 1.37z" />
                    </svg>
                  </span>
                  <input
                    id="partner-restaurant"
                    type="text"
                    className="cravio-field-input"
                    placeholder="e.g. Spice Route"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Business Email & Contact Phone */}
            <div className="cravio-grid-2col">
              <div className="cravio-input-group">
                <label className="cravio-input-label" htmlFor="partner-reg-email">
                  Business Email *
                </label>
                <div className="cravio-input-box">
                  <span className="cravio-input-icon-lead">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </span>
                  <input
                    id="partner-reg-email"
                    type="email"
                    className="cravio-field-input"
                    placeholder="partner@kitchen.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

              <div className="cravio-input-group">
                <label className="cravio-input-label" htmlFor="partner-reg-phone">
                  Phone Number *
                </label>
                <div className="cravio-input-box">
                  <div className="cravio-phone-prefix">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    id="partner-reg-phone"
                    type="tel"
                    className="cravio-field-input"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Kitchen Address with Detect Location button */}
            <div className="cravio-input-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="cravio-input-label" htmlFor="partner-address">
                  Kitchen / Restaurant Address *
                </label>
                <button
                  type="button"
                  className="cravio-location-detect-btn"
                  onClick={handleUseLocation}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>Detect Location</span>
                </button>
              </div>
              <div className="cravio-input-box">
                <span className="cravio-input-icon-lead">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </span>
                <input
                  id="partner-address"
                  type="text"
                  className="cravio-field-input"
                  placeholder="Street, area, landmark, city"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Row 4: Password & FSSAI License */}
            <div className="cravio-grid-2col">
              <div className="cravio-input-group">
                <label className="cravio-input-label" htmlFor="partner-reg-password">
                  Account Password *
                </label>
                <div className="cravio-input-box">
                  <span className="cravio-input-icon-lead">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                  </span>
                  <input
                    id="partner-reg-password"
                    type={showPassword ? "text" : "password"}
                    className="cravio-field-input"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="cravio-input-icon-trail"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="7" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="cravio-input-group">
                <label className="cravio-input-label" htmlFor="partner-fssai">
                  FSSAI License (Optional)
                </label>
                <div className="cravio-input-box">
                  <span className="cravio-input-icon-lead">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                    </svg>
                  </span>
                  <input
                    id="partner-fssai"
                    type="text"
                    className="cravio-field-input"
                    placeholder="14-digit FSSAI number"
                    value={fssaiLicense}
                    onChange={(e) => setFssaiLicense(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Terms and conditions */}
            <label className="cravio-terms-row" style={{ marginTop: "4px" }}>
              <div
                className={`cravio-checkbox-custom ${agreeTerms ? "checked" : ""}`}
                onClick={() => setAgreeTerms(!agreeTerms)}
              >
                {agreeTerms && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className="cravio-terms-text">
                I agree to the Cravio <span className="cravio-terms-link">Partner Merchant Agreement</span> and{" "}
                <span className="cravio-terms-link">Privacy Policy</span>.
              </span>
            </label>

            <button
              type="submit"
              className="cravio-submit-btn"
              disabled={loading}
              style={{ marginTop: "10px" }}
            >
              {loading ? (
                <span>Registering Kitchen...</span>
              ) : (
                <>
                  <span>Create Partner Account</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="cravio-social-divider">
            <span>OR QUICK SIGN UP WITH</span>
          </div>

          <div className="cravio-social-wide-row single">
            <button
              type="button"
              className="cravio-social-wide-btn"
              onClick={handleGoogleRegister}
            >
              <svg viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google Business</span>
            </button>
          </div>

          <footer className="cravio-auth-footer">
            <span>Already have a partner account?</span>
            <Link to="/partner/login" className="cravio-auth-footer-link">
              Log In here
            </Link>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default PartnerRegister;
