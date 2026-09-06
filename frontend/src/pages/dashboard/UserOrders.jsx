import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/cravio_orders.css";

// Assets
import burgerImg from "../../assets/cravio_burger.jpg";

function UserOrders({ onTabChange }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);

  const ongoingOrders = [
    {
      id: "CRV10245",
      name: "Ramen Bowl",
      status: "Out for delivery",
      statusCode: "out",
      estimate: "20–25 min",
      itemsCount: 3,
      price: "₹528",
      step: 3, // 1: Confirmed, 2: Preparing, 3: Out for delivery, 4: Delivered
      img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=500&q=80",
      driver: "Ramesh Kumar (Hero Splendor)",
      phone: "+91 98765 43210",
    },
    {
      id: "CRV10221",
      name: "Burger Singh",
      status: "Preparing",
      statusCode: "prep",
      estimate: "35–40 min",
      itemsCount: 2,
      price: "₹349",
      step: 2,
      img: burgerImg,
      driver: "Assigning delivery executive...",
      phone: "Will update soon",
    },
  ];

  const completedOrders = [
    {
      id: "CRV10190",
      name: "La Pino'z Pizza",
      date: "12 May 2024 • 08:15 PM",
      status: "Delivered",
      price: "₹648",
      rating: 5,
      img: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=500&q=80",
    },
    {
      id: "CRV10178",
      name: "Biryani By Kilo",
      date: "09 May 2024 • 01:20 PM",
      status: "Delivered",
      price: "₹428",
      rating: 5,
      img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=500&q=80",
    },
  ];

  const handleNavClick = (tab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      if (tab === "Home") navigate("/user/dashboard");
      if (tab === "Reels") navigate("/user/reels");
      if (tab === "Orders") navigate("/user/orders");
    }
  };

  const filteredOngoing = activeFilter === "All" || activeFilter === "Ongoing" ? ongoingOrders : [];
  const filteredCompleted = activeFilter === "All" || activeFilter === "Completed" ? completedOrders : [];

  return (
    <div className="cravio-orders-page">
      {/* Top Navbar */}
      <nav className="cravio-web-nav">
        <div className="cravio-web-nav-inner">
          <Link to="/" className="cravio-web-brand">
            <div className="cravio-web-brand-logo">
              <svg viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="17" fill="#F7A827" />
                <path
                  d="M13.5 9V17C13.5 19.5 15.5 21 17 21.5V27.5C17 28.05 17.45 28.5 18 28.5C18.55 28.5 19 28.05 19 27.5V21.5C20.5 21 22.5 19.5 22.5 17V9"
                  stroke="#15161A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M16.5 9V15M19.5 9V15" stroke="#15161A" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="cravio-web-brand-name">
              Cravio
              <span style={{ color: "#F7A827", transform: "translateY(-2px)", display: "inline-block" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#F7A827">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </span>
            </span>
          </Link>

          <div className="cravio-nav-links">
            <button type="button" className="cravio-nav-tab-btn" onClick={() => handleNavClick("Home")}>
              Home
            </button>
            <button type="button" className="cravio-nav-tab-btn" onClick={() => handleNavClick("Reels")}>
              Reels
            </button>
            <button type="button" className="cravio-nav-tab-btn active" onClick={() => handleNavClick("Orders")}>
              Orders
            </button>
            <button type="button" className="cravio-nav-tab-btn" onClick={() => handleNavClick("Favorites")}>
              Favorites
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="cravio-orders-main">
        {/* Title Header */}
        <header className="cravio-orders-header">
          <div>
            <h1 className="cravio-orders-title">My Orders</h1>
            <p className="cravio-orders-subtitle">
              Track, manage and reorder your favourite food
            </p>
          </div>

          <div className="cravio-orders-header-actions">
            <button
              type="button"
              className="cravio-icon-circle-btn"
              onClick={() => alert("Search order history")}
              aria-label="Search orders"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <button
              type="button"
              className="cravio-icon-circle-btn"
              onClick={() => alert("You have 2 active orders en route!")}
              aria-label="Order notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="cravio-icon-badge-dot" aria-hidden="true"></span>
            </button>
          </div>
        </header>

        {/* Order Filter Tabs */}
        <div className="cravio-orders-tabs-row" role="tablist">
          {/* All Orders */}
          <button
            type="button"
            className={`cravio-order-tab-btn ${activeFilter === "All" ? "active" : ""}`}
            onClick={() => setActiveFilter("All")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z" />
            </svg>
            <span>All Orders</span>
          </button>

          {/* Ongoing */}
          <button
            type="button"
            className={`cravio-order-tab-btn ${activeFilter === "Ongoing" ? "active" : ""}`}
            onClick={() => setActiveFilter("Ongoing")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="5.5" cy="17.5" r="3.5" />
              <circle cx="18.5" cy="17.5" r="3.5" />
              <path d="M15 6h-3l-2.5 6H19" />
              <path d="M12 17.5V14H6.5" />
            </svg>
            <span>Ongoing</span>
            <span className="cravio-tab-count-badge">2</span>
          </button>

          {/* Completed */}
          <button
            type="button"
            className={`cravio-order-tab-btn ${activeFilter === "Completed" ? "active" : ""}`}
            onClick={() => setActiveFilter("Completed")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <span>Completed</span>
          </button>

          {/* Cancelled */}
          <button
            type="button"
            className={`cravio-order-tab-btn ${activeFilter === "Cancelled" ? "active" : ""}`}
            onClick={() => setActiveFilter("Cancelled")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span>Cancelled</span>
          </button>
        </div>

        {/* SECTION 1: Ongoing Orders */}
        {filteredOngoing.length > 0 && (
          <section style={{ marginBottom: "36px" }}>
            <div className="cravio-orders-section-head">
              <h2 className="cravio-orders-section-title">Ongoing Orders</h2>
              <button
                type="button"
                className="cravio-orders-viewall"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                onClick={() => setActiveFilter("Ongoing")}
              >
                <span>View all</span>
                <span>→</span>
              </button>
            </div>

            <div className="cravio-ongoing-grid">
              {filteredOngoing.map((order) => (
                <div key={order.id} className="cravio-ongoing-card">
                  {/* Card Top Information */}
                  <div className="cravio-ongoing-top">
                    <img src={order.img} alt={order.name} className="cravio-ongoing-thumb" />

                    <div className="cravio-ongoing-meta">
                      <div className="cravio-ongoing-name-row">
                        <h3 className="cravio-ongoing-name">{order.name}</h3>
                        <span className={`cravio-status-capsule ${order.statusCode}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="cravio-ongoing-order-id">
                        Order ID: #{order.id}
                      </div>

                      <div className="cravio-ongoing-estimate-label">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                        </svg>
                        <span>Estimated delivery</span>
                      </div>

                      <div className="cravio-ongoing-estimate-time">
                        {order.estimate}
                      </div>
                    </div>
                  </div>

                  {/* 4-Step Connected Progress Tracker */}
                  <div className="cravio-tracker-bar" aria-label="Delivery progress">
                    <div className="cravio-tracker-line-bg"></div>
                    <div
                      className="cravio-tracker-line-active"
                      style={{
                        width: order.step === 3 ? "66%" : order.step === 2 ? "33%" : "0%",
                      }}
                    ></div>

                    {/* Step 1: Confirmed */}
                    <div className="cravio-tracker-step">
                      <div className="cravio-tracker-dot done">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="cravio-tracker-label active">Confirmed</span>
                    </div>

                    {/* Step 2: Preparing */}
                    <div className="cravio-tracker-step">
                      <div className={`cravio-tracker-dot ${order.step >= 3 ? "done" : order.step === 2 ? "current-prep" : ""}`}>
                        {order.step >= 3 ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 19H5V8h14m-3-5a2 2 0 0 1 2 2v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1V5a2 2 0 0 1 2-2h8z" />
                          </svg>
                        )}
                      </div>
                      <span className={`cravio-tracker-label ${order.step === 2 ? "active-gold" : order.step >= 3 ? "active" : ""}`}>
                        Preparing
                      </span>
                    </div>

                    {/* Step 3: Out for delivery */}
                    <div className="cravio-tracker-step">
                      <div className={`cravio-tracker-dot ${order.step === 3 ? "current-out" : ""}`}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 7c0-1.1-.9-2-2-2h-3v2h3v2.65L13.52 14H10V9H6c-2.21 0-4 1.79-4 4v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-4-4zM7 17c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm11 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                        </svg>
                      </div>
                      <span className={`cravio-tracker-label ${order.step === 3 ? "active" : ""}`}>
                        Out for delivery
                      </span>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className="cravio-tracker-step">
                      <div className="cravio-tracker-dot">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                        </svg>
                      </div>
                      <span className="cravio-tracker-label">Delivered</span>
                    </div>
                  </div>

                  {/* Card Bottom: Items count, Price & Track Order Button */}
                  <div className="cravio-ongoing-footer">
                    <div>
                      <span>🛍️ {order.itemsCount} items</span>
                      <span style={{ margin: "0 6px" }}>•</span>
                      <strong>{order.price}</strong>
                    </div>

                    <button
                      type="button"
                      className="cravio-track-btn"
                      onClick={() => setActiveTrackingOrder(order)}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      <span>Track Order</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: Completed Orders */}
        {filteredCompleted.length > 0 && (
          <section>
            <div className="cravio-orders-section-head">
              <h2 className="cravio-orders-section-title">Completed Orders</h2>
              <button
                type="button"
                className="cravio-orders-viewall"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                onClick={() => setActiveFilter("Completed")}
              >
                <span>View all</span>
                <span>→</span>
              </button>
            </div>

            <div className="cravio-completed-grid">
              {filteredCompleted.map((comp) => (
                <div key={comp.id} className="cravio-completed-card">
                  <div className="cravio-completed-left">
                    <img src={comp.img} alt={comp.name} className="cravio-completed-thumb" />

                    <div className="cravio-completed-info">
                      <h4>{comp.name}</h4>
                      <div className="cravio-completed-id">Order ID: #{comp.id}</div>
                      <div className="cravio-completed-date">📅 {comp.date}</div>
                      <div className="cravio-completed-status">● {comp.status}</div>
                    </div>
                  </div>

                  <div className="cravio-completed-right">
                    <div className="cravio-completed-price">{comp.price}</div>
                    <div className="cravio-completed-stars">★★★★★</div>
                    <button
                      type="button"
                      className="cravio-reorder-btn"
                      onClick={() => alert(`Reordering delicious food from ${comp.name}!`)}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                      </svg>
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Live Track Order Modal Dialog */}
        {activeTrackingOrder && (
          <div className="cravio-modal-backdrop" onClick={() => setActiveTrackingOrder(null)}>
            <div className="cravio-tracking-modal" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="cravio-modal-close-btn"
                onClick={() => setActiveTrackingOrder(null)}
                aria-label="Close tracking"
              >
                ✕
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                <span className="cravio-status-capsule out">Live GPS En Route</span>
                <span style={{ fontSize: "12px", color: "#9da4b0" }}>
                  #{activeTrackingOrder.id}
                </span>
              </div>

              <h3 style={{ margin: "0 0 6px 0", fontSize: "22px" }}>
                {activeTrackingOrder.name}
              </h3>

              <div style={{ fontSize: "14px", color: "#f7a827", fontWeight: "700", marginBottom: "18px" }}>
                Arriving in {activeTrackingOrder.estimate}
              </div>

              <div style={{ background: "#22242c", borderRadius: "18px", padding: "16px", marginBottom: "18px" }}>
                <div style={{ fontSize: "12px", color: "#9da4b0", marginBottom: "4px" }}>
                  Delivery Partner
                </div>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#ffffff" }}>
                  {activeTrackingOrder.driver}
                </div>
                <div style={{ fontSize: "12px", color: "#f7a827", marginTop: "2px" }}>
                  📞 {activeTrackingOrder.phone}
                </div>
              </div>

              <button
                type="button"
                className="cravio-submit-btn"
                onClick={() => {
                  alert("Calling delivery partner...");
                  setActiveTrackingOrder(null);
                }}
              >
                <span>Call Delivery Partner</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Docked Bottom Navigation */}
      <nav className="cravio-bottom-nav" aria-label="Mobile Navigation">
        <button type="button" className="cravio-nav-item" onClick={() => handleNavClick("Home")}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span>Home</span>
        </button>

        <button type="button" className="cravio-nav-item" onClick={() => handleNavClick("Reels")}>
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M4 6.47L5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4z" />
          </svg>
          <span>Reels</span>
        </button>

        <button type="button" className="cravio-nav-item active" onClick={() => handleNavClick("Orders")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span>Orders</span>
          <span className="cravio-nav-dot"></span>
        </button>

        <button type="button" className="cravio-nav-item" onClick={() => handleNavClick("Profile")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}

export default UserOrders;
