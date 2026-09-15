import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * PartnerLogin Page
 * Route: /partner/login
 */
function PartnerLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI-only navigation to partner dashboard
    navigate("/partner/dashboard");
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-badge" style={{ color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)" }}>
            Restaurant Partner
          </span>
          <h1 className="auth-title">Partner Login</h1>
          <p className="auth-subtitle">Access your kitchen dashboard, menu catalog, and dish settings</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Business Email</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="partner@kitchen.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="••••••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="cravio-btn cravio-btn-primary"
            style={{ width: "100%", marginTop: 10, padding: 12, background: "#f59e0b", color: "#000" }}
          >
            Partner Log In
          </button>
        </form>

        <div className="auth-footer-links">
          Need to register your kitchen?
          <Link to="/partner/signup" style={{ color: "#f59e0b" }}>
            Sign up here
          </Link>
        </div>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12 }}>
          <Link to="/user/login" style={{ color: "var(--text-muted)" }}>
            ← Switch to Food Lover Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PartnerLogin;
