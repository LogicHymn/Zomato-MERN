import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

/**
 * Navbar component
 * Adapts between Public navigation and Authenticated User navigation
 */
function Navbar() {
  const location = useLocation();
  const { totalCount } = useCart();

  const isUserSection =
    location.pathname.startsWith("/user/dashboard") ||
    location.pathname.startsWith("/dish") ||
    location.pathname === "/checkout" ||
    location.pathname === "/profile";

  const isPartnerDashboard = location.pathname.startsWith("/partner/dashboard");

  // Don't render general navbar if partner dashboard has its own top header
  if (isPartnerDashboard) {
    return (
      <header className="cravio-navbar">
        <div className="cravio-nav-container">
          <Link to="/" className="cravio-logo">
            cravio<span>.</span>
            <span style={{ fontSize: 11, background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", padding: "2px 8px", borderRadius: 4, marginLeft: 8, fontWeight: 600 }}>
              Partner Console
            </span>
          </Link>

          <div className="cravio-nav-actions">
            <Link to="/user/dashboard" className="nav-link">
              View Storefront
            </Link>
            <Link to="/partner/login" className="cravio-btn cravio-btn-danger cravio-btn-sm">
              Partner Sign Out
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="cravio-navbar">
      <div className="cravio-nav-container">
        {/* Brand Logo */}
        <Link to={isUserSection ? "/user/dashboard" : "/"} className="cravio-logo">
          cravio<span>.</span>
        </Link>

        {/* Search Bar (Hidden on Homepage & Public Pages) */}
        {isUserSection && (
          <div className="nav-search-bar">
            <span className="nav-search-icon">🔍</span>
            <input
              type="text"
              className="nav-search-input"
              placeholder="Search dishes, cuisines, kitchens..."
            />
          </div>
        )}

        {/* Navigation Actions */}
        <div className="cravio-nav-actions">
          {isUserSection ? (
            <>
              <Link
                to="/user/dashboard"
                className={`nav-link ${location.pathname === "/user/dashboard" ? "active" : ""}`}
              >
                Explore
              </Link>

              <Link
                to="/checkout"
                className={`nav-link ${location.pathname === "/checkout" ? "active" : ""}`}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <span>🛒 Cart</span>
                {totalCount > 0 && (
                  <span
                    style={{
                      background: "var(--brand-primary)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "1px 6px",
                      borderRadius: 10,
                    }}
                  >
                    {totalCount}
                  </span>
                )}
              </Link>

              <Link
                to="/profile"
                className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}
              >
                👤 Profile
              </Link>

              <Link to="/user/login" className="cravio-btn cravio-btn-outline cravio-btn-sm">
                Log Out
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/user/login"
                className={`nav-link ${location.pathname.startsWith("/user") ? "active" : ""}`}
              >
                User Portal
              </Link>

              <Link
                to="/partner/signup"
                className={`nav-partner-btn ${location.pathname.startsWith("/partner") ? "active" : ""}`}
              >
                Partner Portal
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
