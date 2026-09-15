import React from "react";
import { Link } from "react-router-dom";

/**
 * HomePage Component
 * Minimal landing page with exactly two clear path buttons:
 * 1. Get Started as User
 * 2. Register Your Kitchen (Partner)
 */
function HomePage() {
  return (
    <div className="home-page-container">
      <section className="hero-section" style={{ padding: "80px 24px 96px" }}>
        <div className="hero-content">
          <div className="hero-badge">
            <span>CRAVIO PLATFORM</span>
          </div>

          <h1 className="hero-title">
            Discover great food. <span>Explore dishes.</span> Order what you love.
          </h1>

          <p className="hero-subtitle">
            CRAVIO connects passionate food lovers with local independent kitchens and top restaurants.
            Browse culinary specialties dish-by-dish, watch preparation reels, and order your cravings with ease.
          </p>

          {/* Two Distinct Paths — Exactly 2 buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
              maxWidth: 780,
              margin: "44px auto 0",
              textAlign: "left",
            }}
          >
            {/* User Path */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 20,
              }}
            >
              <div>
                <span style={{ fontSize: 32 }}>🍔</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-light)", marginTop: 12 }}>
                  For Food Lovers
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8, lineHeight: 1.6 }}>
                  Discover dishes from restaurants around you. Explore food, discover something new,
                  and build your order from the dishes you actually want.
                </p>
              </div>

              {/* Button 1: User */}
              <Link
                to="/user/login"
                className="cravio-btn cravio-btn-primary"
                style={{ width: "100%", padding: "12px 18px", fontSize: 14 }}
              >
                Get Started as User →
              </Link>
            </div>

            {/* Partner Path */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 20,
              }}
            >
              <div>
                <span style={{ fontSize: 32 }}>👨‍🍳</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-light)", marginTop: 12 }}>
                  For Restaurant Owners & Chefs
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 8, lineHeight: 1.6 }}>
                  Bring your menu to CRAVIO. Manage your dishes, availability and restaurant presence
                  directly from your dedicated partner dashboard.
                </p>
              </div>

              {/* Button 2: Partner */}
              <Link
                to="/partner/signup"
                className="cravio-btn cravio-btn-secondary"
                style={{
                  width: "100%",
                  padding: "12px 18px",
                  fontSize: 14,
                  borderColor: "#f59e0b",
                  color: "#f59e0b",
                }}
              >
                Register Your Kitchen →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
