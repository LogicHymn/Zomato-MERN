import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/cravio_dashboard.css";

// Decorative Photography Asset
import burgerImg from "../../assets/cravio_burger.jpg";

function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("cravioUser") || "{}");
  const displayName = user.username || "Shlok";

  // Navigation & Interactive States
  const [activeTab, setActiveTab] = useState("Home");
  const [activeCategory, setActiveCategory] = useState("Burgers");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Prayagraj");
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [favorites, setFavorites] = useState({ 1: true });

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("cravioUser");
    navigate("/user/login");
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const categories = [
    { id: "Pizza", name: "Pizza", icon: "🍕" },
    { id: "Burgers", name: "Burgers", icon: "🍔" },
    { id: "Chinese", name: "Chinese", icon: "🍜" },
    { id: "North Indian", name: "North Indian", icon: "🍗" },
    { id: "Desserts", name: "Desserts", icon: "🍰" },
    { id: "Beverages", name: "Beverages", icon: "🍹" },
    { id: "More", name: "More", icon: "🎛️" },
  ];

  const foodReels = [
    {
      id: 1,
      title: "Cheese Pull Pizza",
      author: "@pizzahub",
      likes: "12.4K",
      img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      title: "Cold Coffee Bliss",
      author: "@thecafestory",
      likes: "8.1K",
      img: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      title: "Spicy Schezwan",
      author: "@noodlenest",
      likes: "15.6K",
      img: "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      title: "Gulab Jamun Love",
      author: "@sweetspot",
      likes: "9.3K",
      img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
    },
  ];

  const recommendedRestaurants = [
    {
      id: 1,
      name: "The Food Junction",
      rating: "4.5",
      reviews: "1.2K",
      cuisine: "North Indian",
      price: "₹200 for one",
      time: "25 min",
      img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      name: "Burger Barn",
      rating: "4.3",
      reviews: "892",
      cuisine: "Burgers",
      price: "₹250 for one",
      time: "30 min",
      img: burgerImg,
    },
    {
      id: 3,
      name: "Pasta Palace",
      rating: "4.6",
      reviews: "640",
      cuisine: "Italian",
      price: "₹300 for one",
      time: "20 min",
      img: "https://images.unsplash.com/photo-1621996346565-e3d5d6281696?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <div className="cravio-dash-wrapper">
      {/* 1. Desktop Top Navigation Bar */}
      <nav className="cravio-web-nav">
        <div className="cravio-web-nav-inner">
          {/* Logo & Location */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
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

            {/* Location Selector */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="cravio-location-btn"
                onClick={() => setShowLocationMenu(!showLocationMenu)}
              >
                <svg className="cravio-location-pin" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>{selectedCity}</span>
                <span style={{ fontSize: "10px", color: "#9da4b0" }}>▼</span>
              </button>

              {showLocationMenu && (
                <div className="cravio-user-dropdown" style={{ left: 0, minWidth: "130px" }}>
                  {["Prayagraj", "Varanasi", "Lucknow", "Delhi NCR"].map((city) => (
                    <button
                      key={city}
                      type="button"
                      className="cravio-dropdown-item"
                      onClick={() => {
                        setSelectedCity(city);
                        setShowLocationMenu(false);
                      }}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar in Header (Desktop) */}
          <div className="cravio-nav-search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" style={{ marginRight: "10px" }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="cravio-search-input"
              placeholder="Search dishes, restaurants or cuisines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Navigation Links */}
          <div className="cravio-nav-links">
            <button
              type="button"
              className={`cravio-nav-tab-btn ${activeTab === "Home" ? "active" : ""}`}
              onClick={() => setActiveTab("Home")}
            >
              Home
            </button>
            <button
              type="button"
              className={`cravio-nav-tab-btn ${activeTab === "Reels" ? "active" : ""}`}
              onClick={() => setActiveTab("Reels")}
            >
              Reels
            </button>
            <button
              type="button"
              className={`cravio-nav-tab-btn ${activeTab === "Orders" ? "active" : ""}`}
              onClick={() => setActiveTab("Orders")}
            >
              Orders
            </button>
            <button
              type="button"
              className={`cravio-nav-tab-btn ${activeTab === "Favorites" ? "active" : ""}`}
              onClick={() => setActiveTab("Favorites")}
            >
              Favorites
            </button>
          </div>

          {/* Right Controls: Bell + Avatar */}
          <div className="cravio-nav-controls">
            <button
              type="button"
              className="cravio-bell-btn"
              onClick={() => alert("No new notifications")}
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="cravio-bell-badge" aria-hidden="true"></span>
            </button>

            {/* Avatar with dropdown */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className="cravio-avatar-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="Account menu"
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
                  alt={displayName}
                  className="cravio-avatar-img"
                />
              </button>

              {showUserMenu && (
                <div className="cravio-user-dropdown">
                  <div style={{ padding: "8px 16px 10px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                    <strong style={{ fontSize: "14px", display: "block" }}>{displayName}</strong>
                    <span style={{ fontSize: "12px", color: "#9da4b0" }}>Customer</span>
                  </div>
                  <button
                    type="button"
                    className="cravio-dropdown-item"
                    onClick={() => {
                      setShowUserMenu(false);
                      setActiveTab("Profile");
                    }}
                  >
                    My Profile
                  </button>
                  <button
                    type="button"
                    className="cravio-dropdown-item"
                    onClick={() => {
                      setShowUserMenu(false);
                      setActiveTab("Orders");
                    }}
                  >
                    My Orders
                  </button>
                  <button
                    type="button"
                    className="cravio-dropdown-item logout"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Main Dashboard Content (Desktop & Mobile) */}
      <main className="cravio-dash-main">
        {/* Mobile-Only Search Box */}
        <div className="cravio-mobile-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" style={{ marginRight: "10px" }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="cravio-search-input"
            placeholder="Search for dishes, restaurants or cuisines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* User Greeting */}
        <section className="cravio-dash-greeting">
          <h1 className="cravio-greeting-title">
            Hello, {displayName} 👋
          </h1>
          <p className="cravio-greeting-sub">What are you craving today?</p>
        </section>

        {/* Special Offer Banner */}
        <section className="cravio-offer-banner">
          <div className="cravio-offer-content">
            <span className="cravio-offer-tag">SPECIAL OFFER</span>
            <h2 className="cravio-offer-title">Get 50% OFF</h2>
            <p className="cravio-offer-sub">on your first order with Cravio</p>
            <button
              type="button"
              className="cravio-offer-btn"
              onClick={() => alert("50% discount coupon CRAVIO50 applied at checkout!")}
            >
              <span>Order Now</span>
              <span>→</span>
            </button>
          </div>

          <div className="cravio-offer-media" aria-hidden="true">
            <div className="cravio-offer-sparkles">
              <svg viewBox="0 0 36 36" fill="none">
                <path d="M12 24L5 18" stroke="#F7A827" strokeWidth="3" strokeLinecap="round" />
                <path d="M18 16L18 5" stroke="#F7A827" strokeWidth="3" strokeLinecap="round" />
                <path d="M24 23L31 19" stroke="#F7A827" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            <img src={burgerImg} alt="Cravio Offer Burger" className="cravio-offer-burger-img" />
          </div>
        </section>

        {/* Categories Strip */}
        <div className="cravio-categories-scroll">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`cravio-category-item ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <div className="cravio-category-circle">
                <span>{cat.icon}</span>
              </div>
              <span className="cravio-category-name">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Food Reels Section (Grid on Desktop, Carousel on Mobile) */}
        <section style={{ marginBottom: "40px" }}>
          <div className="cravio-section-header">
            <h3 className="cravio-section-title">Food Reels</h3>
            <button
              type="button"
              className="cravio-see-all-btn"
              onClick={() => setActiveTab("Reels")}
            >
              <span>See All</span>
              <span>›</span>
            </button>
          </div>

          <div className="cravio-reels-grid">
            {foodReels.map((reel) => (
              <div
                key={reel.id}
                className="cravio-reel-card"
                onClick={() => alert(`Playing reel: ${reel.title}`)}
              >
                <img src={reel.img} alt={reel.title} className="cravio-reel-img" />

                <div className="cravio-reel-play-badge" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                <div className="cravio-reel-overlay">
                  <div className="cravio-reel-likes">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="#ffffff">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span>{reel.likes}</span>
                  </div>
                  <h4 className="cravio-reel-title">{reel.title}</h4>
                  <span className="cravio-reel-author">{reel.author}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recommended for you Section (Grid on Desktop, Carousel on Mobile) */}
        <section>
          <div className="cravio-section-header">
            <h3 className="cravio-section-title">Recommended for you</h3>
            <button
              type="button"
              className="cravio-see-all-btn"
              onClick={() => alert("Browse all recommended restaurants")}
            >
              <span>See All</span>
              <span>›</span>
            </button>
          </div>

          <div className="cravio-recommended-grid">
            {recommendedRestaurants.map((res) => (
              <div
                key={res.id}
                className="cravio-restaurant-card"
                onClick={() => alert(`Opening menu for ${res.name}`)}
              >
                <div className="cravio-restaurant-media">
                  <img src={res.img} alt={res.name} className="cravio-restaurant-img" />

                  <div className="cravio-time-badge">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                    <span>{res.time}</span>
                  </div>

                  <button
                    type="button"
                    className={`cravio-card-heart-btn ${favorites[res.id] ? "active" : ""}`}
                    onClick={(e) => toggleFavorite(res.id, e)}
                    aria-label="Add to favorites"
                  >
                    <svg viewBox="0 0 24 24" fill={favorites[res.id] ? "#EF4444" : "none"} stroke="currentColor" strokeWidth="2">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>
                </div>

                <div className="cravio-restaurant-body">
                  <h4 className="cravio-restaurant-name">{res.name}</h4>
                  <div className="cravio-restaurant-meta">
                    <span className="cravio-rating-star">★ {res.rating}</span>
                    <span>({res.reviews})</span>
                    <span>•</span>
                    <span>{res.cuisine}</span>
                  </div>
                  <div className="cravio-restaurant-price">{res.price}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 3. Mobile Docked Bottom Navigation Bar (Visible <= 768px only) */}
      <nav className="cravio-bottom-nav" aria-label="Mobile Navigation">
        <button
          type="button"
          className={`cravio-nav-item ${activeTab === "Home" ? "active" : ""}`}
          onClick={() => setActiveTab("Home")}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span>Home</span>
          {activeTab === "Home" && <span className="cravio-nav-dot"></span>}
        </button>

        <button
          type="button"
          className={`cravio-nav-item ${activeTab === "Reels" ? "active" : ""}`}
          onClick={() => setActiveTab("Reels")}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M4 6.47L5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4z" />
          </svg>
          <span>Reels</span>
          {activeTab === "Reels" && <span className="cravio-nav-dot"></span>}
        </button>

        <button
          type="button"
          className={`cravio-nav-item ${activeTab === "Orders" ? "active" : ""}`}
          onClick={() => setActiveTab("Orders")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span>Orders</span>
          {activeTab === "Orders" && <span className="cravio-nav-dot"></span>}
        </button>

        <button
          type="button"
          className={`cravio-nav-item ${activeTab === "Favorites" ? "active" : ""}`}
          onClick={() => setActiveTab("Favorites")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>Favorites</span>
          {activeTab === "Favorites" && <span className="cravio-nav-dot"></span>}
        </button>

        <button
          type="button"
          className={`cravio-nav-item ${activeTab === "Profile" ? "active" : ""}`}
          onClick={() => setActiveTab("Profile")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Profile</span>
          {activeTab === "Profile" && <span className="cravio-nav-dot"></span>}
        </button>
      </nav>
    </div>
  );
}

export default UserDashboard;
