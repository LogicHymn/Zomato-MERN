import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/cravio_welcome.css";

// Assets
import burgerHeroImg from "../assets/cravio_burger.jpg";
import mintSprigImg from "../assets/cravio_mint_sprig.jpg";
import tomatoImg from "../assets/cravio_tomato.jpg";
import chiliBowlImg from "../assets/cravio_chili_bowl.jpg";

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
      {/* Background Ribbon Wave for Desktop/Tablet */}
      <div className="cravio-bg-ribbon" aria-hidden="true">
        <div className="cravio-ribbon-path"></div>
      </div>

      {/* Decorative Food Elements (Desktop ambient scene) */}
      <img
        src={mintSprigImg}
        alt=""
        className="cravio-decor-element cravio-decor-mint-top"
        aria-hidden="true"
      />
      <img
        src={tomatoImg}
        alt=""
        className="cravio-decor-element cravio-decor-tomato"
        aria-hidden="true"
      />
      <div className="cravio-decor-element cravio-decor-peppercorns" aria-hidden="true">
        <span className="peppercorn"></span>
        <span className="peppercorn"></span>
        <span className="peppercorn"></span>
      </div>

      <img
        src={chiliBowlImg}
        alt=""
        className="cravio-decor-element cravio-decor-chili"
        aria-hidden="true"
      />
      <img
        src={mintSprigImg}
        alt=""
        className="cravio-decor-element cravio-decor-mint-bottom"
        aria-hidden="true"
      />

      {/* Central Phone App Container */}
      <main className="cravio-phone-container">
        {/* Subtle speaker / camera notch bar */}
        <div className="cravio-device-speaker" aria-hidden="true"></div>

        {/* 1. Cravio Header & Logo */}
        <header className="cravio-brand-header">
          <div className="cravio-logo-icon">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="17" fill="#F7A827" />
              {/* Stylized Fork & Spoon forming restaurant insignia */}
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
          <span className="cravio-logo-text">
            Cravio
            <span className="cravio-heart-dot" title="Cravio">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#F7A827">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </span>
          </span>
        </header>

        {/* 2. Hero Burger Photo */}
        <section className="cravio-hero-card">
          <img
            src={burgerHeroImg}
            alt="Delicious Gourmet Burger with Melted Cheddar and Crispy Fries"
            className="cravio-hero-img"
          />
        </section>

        {/* 3. Catchy Headline & Subtitle */}
        <section className="cravio-text-section">
          <div className="cravio-title-container">
            <h1 className="cravio-main-title">
              Good <span className="cravio-accent-word">food.</span>
              <br />
              Good <span className="cravio-accent-word">vibes.</span>
            </h1>

            {/* Radiant Sparkle Rays Doodle */}
            <div className="cravio-sparkle-doodle" aria-hidden="true">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Ray 1 (up-left) */}
                <path
                  d="M10 24L5 20"
                  stroke="#F7A827"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                {/* Ray 2 (mid-right diagonal) */}
                <path
                  d="M17 18L18 8"
                  stroke="#F7A827"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
                {/* Ray 3 (right horizontal-up) */}
                <path
                  d="M23 23L31 21"
                  stroke="#F7A827"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <p className="cravio-subtitle">
            Discover delicious food, order your favourites, and share your creations.
          </p>
        </section>

        {/* 4. Onboarding Action Buttons */}
        <div className="cravio-actions">
          {/* User Button */}
          <button
            id="btn-continue-user"
            className="cravio-btn cravio-btn-primary"
            onClick={handleUserContinue}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span>Continue as User</span>
          </button>

          {/* Partner Button */}
          <button
            id="btn-continue-partner"
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

        {/* 5. Tagline Footer */}
        <footer className="cravio-footer">
          <span>Discover</span>
          <span className="cravio-dot" aria-hidden="true"></span>
          <span>Order</span>
          <span className="cravio-dot" aria-hidden="true"></span>
          <span>Create</span>
        </footer>

        {/* Subtle quick links for fast portal navigation during review */}
        <nav className="cravio-dev-nav" aria-label="Direct portal links">
          <Link to="/user/login">User Portal</Link>
          <span>•</span>
          <Link to="/partner/login">Partner Portal</Link>
          <span>•</span>
          <Link to="/user/register">Register</Link>
        </nav>
      </main>
    </div>
  );
}

export default HomePage;
