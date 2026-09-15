import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

/**
 * Profile Page
 * Route: /profile
 * User account information, saved addresses, order history, appearance toggle, and logout
 */
function Profile() {
  const navigate = useNavigate();
  const { appearance, setAppearance } = useCart();

  const handleLogout = () => {
    navigate("/user/login");
  };

  const pastOrders = [
    {
      id: "CRV1024",
      date: "Today, 1:15 PM",
      restaurant: "Spice Garden Kitchen",
      items: "Paneer Butter Masala x 1, Hyderabadi Dum Biryani x 2",
      total: "₹1,055",
      status: "Delivered",
    },
    {
      id: "CRV1018",
      date: "Sep 11, 2026, 8:40 PM",
      restaurant: "Burger Lab",
      items: "Artisan Truffle Burger x 1, French Fries x 1",
      total: "₹389",
      status: "Delivered",
    },
    {
      id: "CRV0992",
      date: "Sep 05, 2026, 9:10 AM",
      restaurant: "Madras Tiffin Room",
      items: "Butter Ghee Roast Dosa x 2, Filter Coffee x 2",
      total: "₹420",
      status: "Delivered",
    },
  ];

  return (
    <div className="profile-page-container" style={{ maxWidth: 880, margin: "32px auto 80px", padding: "0 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-light)" }}>
            My Account
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
            Manage profile information, preferences, and view past delivery orders
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="cravio-btn cravio-btn-danger cravio-btn-sm"
        >
          Log Out
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
        {/* User Info Card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "var(--brand-primary)",
                color: "#fff",
                fontSize: 20,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              P
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-light)" }}>
                Prateek Sharma
              </h2>
              <span className="hero-badge" style={{ margin: 0, padding: "2px 8px", fontSize: 11 }}>
                Verified Foodie
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
            <div>
              <div style={{ color: "var(--text-muted)", fontSize: 11 }}>Email Address</div>
              <div style={{ color: "var(--text-primary)", fontWeight: 500, marginTop: 2 }}>
                demo@example.com
              </div>
            </div>

            <div>
              <div style={{ color: "var(--text-muted)", fontSize: 11 }}>Phone Number</div>
              <div style={{ color: "var(--text-primary)", fontWeight: 500, marginTop: 2 }}>
                +91 98765 43210
              </div>
            </div>

            <div>
              <div style={{ color: "var(--text-muted)", fontSize: 11 }}>Primary Address</div>
              <div style={{ color: "var(--text-primary)", fontWeight: 500, marginTop: 2 }}>
                Flat 402, Sea Green Apartments, 14th Road, Bandra West, Mumbai - 400050
              </div>
            </div>
          </div>
        </div>

        {/* Appearance / Theme Card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-light)", marginBottom: 8 }}>
              Appearance
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 18 }}>
              Choose how CRAVIO looks to you. Dark mode is enabled by default.
            </p>

            <div style={{ display: "flex", gap: 14 }}>
              <label
                style={{
                  flex: 1,
                  background: appearance === "dark" ? "var(--bg-input)" : "transparent",
                  border: `1.5px solid ${appearance === "dark" ? "var(--brand-primary)" : "var(--border-subtle)"}`,
                  borderRadius: "var(--radius-md)",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={appearance === "dark"}
                  onChange={() => setAppearance("dark")}
                />
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-light)" }}>Dark Mode</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Default CRAVIO look</div>
                </div>
              </label>

              <label
                style={{
                  flex: 1,
                  background: appearance === "light" ? "var(--bg-input)" : "transparent",
                  border: `1.5px solid ${appearance === "light" ? "var(--brand-primary)" : "var(--border-subtle)"}`,
                  borderRadius: "var(--radius-md)",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={appearance === "light"}
                  onChange={() => setAppearance("light")}
                />
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text-light)" }}>Light Mode</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>High contrast</div>
                </div>
              </label>
            </div>
          </div>

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border-subtle)" }}>
            <Link to="/user/dashboard" className="cravio-btn cravio-btn-secondary" style={{ width: "100%" }}>
              Explore Food Feed →
            </Link>
          </div>
        </div>
      </div>

      {/* Your Orders Section */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-light)" }}>
            Your Orders ({pastOrders.length})
          </h2>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Order history</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {pastOrders.map((order) => (
            <div
              key={order.id}
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 14,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontWeight: 700, color: "var(--text-light)", fontSize: 14 }}>
                    Order #{order.id}
                  </span>
                  <span className="status-pill available">● {order.status}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-primary)", marginTop: 4, fontWeight: 500 }}>
                  🏪 {order.restaurant}
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                  {order.items}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                  {order.date}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-light)" }}>
                  {order.total}
                </div>
                <button
                  type="button"
                  className="cravio-btn cravio-btn-outline cravio-btn-sm"
                  style={{ marginTop: 8 }}
                  onClick={() => navigate("/user/dashboard")}
                >
                  Order Again
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
