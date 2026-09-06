import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/dashboard.css";

function PartnerDashboard() {
  const navigate = useNavigate();
  const partner = JSON.parse(localStorage.getItem("cravioPartner") || "{}");

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/food-partner/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("cravioPartner");
    navigate("/partner/login");
  };

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-nav">
        <span className="dashboard-nav-brand">Cravio</span>
        <div className="dashboard-nav-right">
          <div className="dashboard-user-info">
            <strong>{partner.restaurantName || partner.name || "Partner"}</strong>
            <span className="dashboard-role-badge partner" style={{ marginLeft: "8px" }}>Food Partner</span>
          </div>
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="dashboard-welcome">
          <h1>Welcome, {partner.name || "Partner"} 👋</h1>
          <p>
            Manage <strong>{partner.restaurantName || "your restaurant"}</strong> — add menu items, 
            view incoming orders, and grow your business on Cravio.
          </p>
        </div>

        <div className="dashboard-stats">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-value">0</div>
            <div className="dashboard-stat-label">Menu Items</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-value">0</div>
            <div className="dashboard-stat-label">Active Orders</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-value">₹0</div>
            <div className="dashboard-stat-label">Revenue</div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Restaurant Details</h2>
          <p>
            <strong>Owner:</strong> {partner.name || "—"}<br />
            <strong>Email:</strong> {partner.email || "—"}<br />
            <strong>Phone:</strong> {partner.phone || "—"}<br />
            <strong>Address:</strong> {partner.address || "—"}
          </p>
        </div>
      </main>
    </div>
  );
}

export default PartnerDashboard;
