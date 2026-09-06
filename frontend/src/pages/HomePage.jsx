import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/cravio_welcome.css";

// Assets
import burgerHeroImg from "../assets/cravio_burger.jpg";

function HomePage() {
  const navigate = useNavigate();

  const handleUserContinue = () => {
    const savedUser = localStorage.getItem("cravioUser");
    if (savedUser) {
      navigate("/user/dashboard");
    } else {
      navigate("/user/login");
    }
  };

  const handlePartnerContinue = () => {
    const savedPartner = localStorage.getItem("cravioPartner");
    if (savedPartner) {
      navigate("/partner/dashboard");
    } else {
      navigate("/partner/login");
    }
  };

  return (
    <div className="cravio-welcome-wrapper">
      {/* 1. Desktop Website Navigation Bar */}
      <nav className="cravio-landing-nav" aria-label="Main Navigation">
        <Link to="/" className="cravio-nav-brand">
          <div className="cravio-nav-logo-icon">
            <svg viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="17" fill="#F7A827" />
              <path
                d="M13.5 9V17C13.5 19.5 15.5 21 17 21.5V27.5C17 28.05 17.45 28.5 18 28.5C18.55 28.5 19 28.05 19 27.5V21.5C20.5 21 22.5 19.5 22.5 17V9"
                stroke="#15161A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.5 9V15M19.5 9V15"
                stroke="#15161A"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <span className="cravio-nav-brand-text">
              Cravio
              <span style={{ color: "#F7A827", transform: "translateY(-2px)", display: "inline-block" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#F7A827">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </span>
            </span>
            <div className="cravio-nav-tagline">
              Good <span style={{ color: "#F7A827" }}>food.</span> Good{" "}
              <span style={{ color: "#F7A827" }}>vibes.</span>
            </div>
          </div>
        </Link>

        <div className="cravio-nav-actions">
          <Link to="/user/login" className="cravio-nav-link">
            Customer Login
          </Link>
          <Link to="/partner/login" className="cravio-nav-link">
            Partner Portal
          </Link>
          <Link to="/user/register" className="cravio-nav-link cravio-nav-btn-highlight">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* 2. Main Hero Section (2-Columns on Desktop, Stacked on Mobile) */}
      <main className="cravio-landing-hero">
        {/* Left Column: Headings & Call to Actions */}
        <section className="cravio-hero-left">
          <div className="cravio-badge-pill">
            <span>✨ Premium Food Experience</span>
          </div>

          <h1 className="cravio-main-title">
            Good <span className="cravio-accent-word">food.</span>
            <br />
            Good <span className="cravio-accent-word">vibes.</span>
            <span className="cravio-sparkle-inline" aria-hidden="true">
              <svg viewBox="0 0 36 36" fill="none">
                <path d="M10 24L4 19" stroke="#F7A827" strokeWidth="3.2" strokeLinecap="round" />
                <path d="M18 16L18 6" stroke="#F7A827" strokeWidth="3.2" strokeLinecap="round" />
                <path d="M24 23L32 20" stroke="#F7A827" strokeWidth="3.2" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="cravio-subtitle">
            Discover delicious food from top-rated restaurants, order your favourites in seconds,
            and share your culinary creations with a vibrant food community.
          </p>

          <div className="cravio-actions-row">
            <button
              id="btn-landing-user"
              className="cravio-btn cravio-btn-primary"
              onClick={handleUserContinue}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span>Continue as User</span>
            </button>

            <button
              id="btn-landing-partner"
              className="cravio-btn cravio-btn-secondary"
              onClick={handlePartnerContinue}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 19h12a1 1 0 0 0 1-1v-2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1zM7 14c-1.657 0-3-1.343-3-3 0-1.42 1-2.6 2.34-2.92A4.992 4.992 0 0 1 12 4a4.992 4.992 0 0 1 5.66 4.08A3.003 3.003 0 0 1 20 11c0 1.657-1.343 3-3 3"
                />
              </svg>
              <span>Continue as Food Partner</span>
            </button>
          </div>

          {/* Trust Metric Badges */}
          <div className="cravio-trust-badges">
            <div className="cravio-trust-item">
              <span>⚡</span>
              <span>25 Min Fast Delivery</span>
            </div>
            <div className="cravio-trust-item">
              <span>⭐</span>
              <span>4.9 / 5.0 Rating</span>
            </div>
            <div className="cravio-trust-item">
              <span>🍽️</span>
              <span>500+ Curated Places</span>
            </div>
          </div>
        </section>

        {/* Right Column: Hero Visual Showcase Card */}
        <section className="cravio-hero-right">
          <div className="cravio-glow-orb" aria-hidden="true"></div>

          {/* Floating badge 1: Top Right */}
          <div className="cravio-floating-badge cravio-floating-top">
            <span>🔥</span>
            <span>Trending: Truffle Cheeseburger</span>
          </div>

          {/* Hero Card */}
          <div className="cravio-showcase-card">
            <img
              src={burgerHeroImg}
              alt="Cravio Gourmet Cheeseburger"
              className="cravio-showcase-img"
            />
          </div>

          {/* Floating badge 2: Bottom Left */}
          <div className="cravio-floating-badge cravio-floating-bottom">
            <span>⭐</span>
            <span>4.9 (2.4k+ food lovers)</span>
          </div>
        </section>
      </main>

      {/* 3. Website Footer */}
      <footer className="cravio-landing-footer">
        <div>© 2026 Cravio Inc. All rights reserved.</div>
        <div className="cravio-footer-pills">
          <span>Discover</span>
          <span className="cravio-footer-dot"></span>
          <span>Order</span>
          <span className="cravio-footer-dot"></span>
          <span>Create</span>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
