import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/dashboard.css";

function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("cravioUser") || "{}");

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("cravioUser");
    navigate("/user/login");
  };

  return (
    <div className="dashboard-layout">
      <nav className="dashboard-nav">
        <span className="dashboard-nav-brand">Cravio</span>
        <div className="dashboard-nav-right">
          <div className="dashboard-user-info">
            <strong>{user.username || user.email || "User"}</strong>
            <span className="dashboard-role-badge user" style={{ marginLeft: "8px" }}>Customer</span>
          </div>
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <div className="dashboard-welcome">
          <h1>Welcome, {user.username || "Customer"} 👋</h1>
          <p>Your Cravio customer dashboard — browse restaurants, track orders, and manage your account.</p>
        </div>

        <div className="dashboard-stats">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-value">0</div>
            <div className="dashboard-stat-label">Total Orders</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-value">0</div>
            <div className="dashboard-stat-label">Favourites</div>
          </div>
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-value">0</div>
            <div className="dashboard-stat-label">Cart Items</div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Quick Start</h2>
          <p>
            Your account is all set up! From here you'll be able to browse nearby restaurants,
            add items to your cart, track live delivery status, and manage your profile.
            Features are coming soon — stay tuned!
          </p>
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
