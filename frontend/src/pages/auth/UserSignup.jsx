import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * UserSignup Page
 * Route: /user/signup
 */
function UserSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI-only navigation to OTP verification
    navigate("/user/verify-otp");
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-badge">Food Lovers</span>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Sign up to start discovering culinary specialties around you</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Prateek Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              className="form-input"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              required
              className="form-input"
              placeholder="10-digit mobile number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="Create password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="cravio-btn cravio-btn-primary"
            style={{ width: "100%", marginTop: 10, padding: 12 }}
          >
            Sign Up
          </button>
        </form>

        <div className="auth-footer-links">
          Already have an account?
          <Link to="/user/login">Log in here</Link>
        </div>
      </div>
    </div>
  );
}

export default UserSignup;
