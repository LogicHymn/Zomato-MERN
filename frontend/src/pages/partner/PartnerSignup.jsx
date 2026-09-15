import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * PartnerSignup Page
 * Route: /partner/signup
 */
function PartnerSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    restaurantName: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // UI-only navigation to partner OTP verification
    navigate("/partner/verify-otp");
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <span className="auth-badge" style={{ color: "#f59e0b", background: "rgba(245, 158, 11, 0.1)" }}>
            Restaurant Partner Portal
          </span>
          <h1 className="auth-title">Register Your Kitchen</h1>
          <p className="auth-subtitle">Bring your menu to CRAVIO and start reaching hungry customers in your city</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Restaurant Name</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Spice Garden Kitchen"
                value={formData.restaurantName}
                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Owner / Chef Name</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Rajesh Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              className="form-input"
              placeholder="Create partner password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Restaurant / Kitchen Address</label>
            <textarea
              rows={2}
              required
              className="form-textarea"
              placeholder="Full street address, landmark, area, city"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="cravio-btn cravio-btn-primary"
            style={{ width: "100%", marginTop: 8, padding: 12, background: "#f59e0b", color: "#000" }}
          >
            Register Partner Account
          </button>
        </form>

        <div className="auth-footer-links">
          Already registered as a partner?
          <Link to="/partner/login" style={{ color: "#f59e0b" }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PartnerSignup;
