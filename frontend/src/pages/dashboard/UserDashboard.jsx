import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/cravio_dashboard.css";

// Decorative Photography Asset
import burgerImg from "../../assets/cravio_burger.jpg";
import saladDishImg from "../../assets/cravio_salad_dish.jpg";

import UserOrders from "./UserOrders";
import UserReels from "./UserReels";

function UserDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("cravioUser") || "{}");
  const displayName = user.username || "Shlok";

  // Appearance / Theme State (Dark / Light Mode)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("cravioTheme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("cravioTheme", theme);
  }, [theme]);

  // Navigation & Interactive States
  const [activeTab, setActiveTab] = useState("Home");
  const [dockTab, setDockTab] = useState("Home"); // "Home" | "Under250" | "Dining" | "Healthy"
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("Prayagraj");
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [favorites, setFavorites] = useState({});

  // Dynamic Foods added by Partners (NO dummy foods)
  const [foods, setFoods] = useState([]);
  const [loadingFoods, setLoadingFoods] = useState(true);

  // Cart & Orders State (Starts Empty - NO dummy order)
  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cravioCart") || "[]");
    } catch (e) {
      return [];
    }
  });
  const [showCartBar, setShowCartBar] = useState(true);
  const [showCartModal, setShowCartModal] = useState(false);

  // Load Real Foods Added by Food Partners
  const loadFoods = async () => {
    let localFoods = [];
    try {
      localFoods = JSON.parse(localStorage.getItem("cravioCustomFoods") || "[]");
    } catch (e) {
      localFoods = [];
    }

    try {
      const res = await axios.get("http://localhost:3000/api/food", { withCredentials: true });
      if (res.data?.food && Array.isArray(res.data.food)) {
        const backendFoods = res.data.food.map((f) => ({
          id: f._id || f.id,
          name: f.name,
          cuisine: f.category || "Specialty",
          price: `₹${f.price} for one`,
          numericPrice: Number(f.price) || 200,
          isHealthy: (f.category || "").toLowerCase().includes("salad") || (f.category || "").toLowerCase().includes("healthy"),
          time: "25 min",
          rating: f.rating || "4.5",
          reviews: f.review || "10",
          restaurantName: f.restaurantName || f.foodPartner?.restaurantName || "Partner Kitchen",
          img: f.image || saladDishImg,
          status: f.status || "Available",
        }));

        const combined = [...backendFoods];
        localFoods.forEach((lf) => {
          if (!combined.some((cf) => cf.id === lf.id || cf.name === lf.name)) {
            combined.push({
              id: lf.id,
              name: lf.name,
              cuisine: lf.category || "Specialty",
              price: `₹${lf.price} for one`,
              numericPrice: Number(lf.price) || 200,
              isHealthy: (lf.category || "").toLowerCase().includes("salad") || (lf.category || "").toLowerCase().includes("healthy"),
              time: "25 min",
              rating: "4.8",
              reviews: "1",
              restaurantName: lf.restaurantName || "Partner Kitchen",
              img: lf.img || saladDishImg,
              status: lf.status || "Available",
            });
          }
        });

        setFoods(combined);
        setLoadingFoods(false);
        return;
      }
    } catch (err) {
      console.warn("Could not fetch backend foods:", err.message);
    }

    // Map local foods if backend isn't reachable
    const formattedLocal = localFoods.map((lf) => ({
      id: lf.id,
      name: lf.name,
      cuisine: lf.category || "Specialty",
      price: `₹${lf.price} for one`,
      numericPrice: Number(lf.price) || 200,
      isHealthy: (lf.category || "").toLowerCase().includes("salad") || (lf.category || "").toLowerCase().includes("healthy"),
      time: "25 min",
      rating: "4.8",
      reviews: "1",
      restaurantName: lf.restaurantName || "Partner Kitchen",
      img: lf.img || saladDishImg,
      status: lf.status || "Available",
    }));

    setFoods(formattedLocal);
    setLoadingFoods(false);
  };

  useEffect(() => {
    loadFoods();

    const handleSync = () => loadFoods();
    window.addEventListener("cravio-foods-updated", handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("cravio-foods-updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  // Save Cart to localStorage
  useEffect(() => {
    localStorage.setItem("cravioCart", JSON.stringify(cartItems));
  }, [cartItems]);

  if (activeTab === "Orders") {
    return <UserOrders onTabChange={setActiveTab} />;
  }

  if (activeTab === "Reels") {
    return <UserReels onTabChange={setActiveTab} />;
  }

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

  // Add Item to Cart
  const handleAddToCart = (dish, e) => {
    e.stopPropagation();
    const existing = cartItems.find((item) => item.id === dish.id);
    let updatedCart;
    if (existing) {
      updatedCart = cartItems.map((item) =>
        item.id === dish.id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          id: dish.id,
          name: dish.name,
          price: dish.numericPrice || 199,
          restaurantName: dish.restaurantName || "Partner Kitchen",
          img: dish.img,
          qty: 1,
        },
      ];
    }
    setCartItems(updatedCart);
    setShowCartBar(true);
  };

  // Place Real Order
  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    const newOrder = {
      id: "CRV" + Math.floor(10000 + Math.random() * 90000),
      restaurantName: cartItems[0].restaurantName || "Partner Kitchen",
      items: cartItems.map((c) => `${c.name} (x${c.qty})`).join(", "),
      itemCount: cartItems.reduce((acc, curr) => acc + curr.qty, 0),
      totalPrice: cartItems.reduce((acc, curr) => acc + curr.price * curr.qty, 0) + 28,
      status: "In kitchen",
      step: 2,
      time: "20–25 min",
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + " • " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      img: cartItems[0].img || burgerImg,
    };

    let existingOrders = [];
    try {
      existingOrders = JSON.parse(localStorage.getItem("cravioOrders") || "[]");
    } catch (e) {
      existingOrders = [];
    }

    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem("cravioOrders", JSON.stringify(updatedOrders));

    // Clear cart
    setCartItems([]);
    setShowCartModal(false);
    setShowCartBar(false);
    alert(`Order #${newOrder.id} placed successfully with ${newOrder.restaurantName}!`);
    setActiveTab("Orders");
  };

  // Recent order for Profile Preview
  const getLatestOrder = () => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem("cravioOrders") || "[]");
      return savedOrders[0] || null;
    } catch (e) {
      return null;
    }
  };
  const latestOrder = getLatestOrder();

  const categories = [
    { id: "All", name: "All", icon: "✨" },
    { id: "Pizza", name: "Pizza", icon: "🍕" },
    { id: "Burgers", name: "Burgers", icon: "🍔" },
    { id: "Pasta", name: "Pasta", icon: "🍝" },
    { id: "Momos", name: "Momos", icon: "🥟" },
    { id: "Chinese", name: "Chinese", icon: "🍜" },
    { id: "North Indian", name: "North Indian", icon: "🍗" },
    { id: "Desserts", name: "Desserts", icon: "🍰" },
    { id: "Beverages", name: "Beverages", icon: "🍹" },
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

  // Filter foods dynamically based on category, search, and footer dock
  const filteredFoods = foods.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory !== "All" && !res.cuisine.toLowerCase().includes(activeCategory.toLowerCase())) {
      return false;
    }

    if (dockTab === "Under250") {
      return res.numericPrice <= 250;
    }
    if (dockTab === "Healthy") {
      return res.isHealthy;
    }
    return true;
  });

  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + 28 : 0;
  const primaryCartRestaurant = cartItems[0]?.restaurantName || "Partner Kitchen";

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
              placeholder="Search dishes or cuisines added by partners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Navigation Links */}
          <div className="cravio-nav-links">
            <button
              type="button"
              className={`cravio-nav-tab-btn ${activeTab === "Home" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("Home");
                setDockTab("Home");
              }}
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
              onClick={() => alert(latestOrder ? `Your order from ${latestOrder.restaurantName} is: ${latestOrder.status}` : "No new notifications")}
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {latestOrder && <span className="cravio-bell-badge" aria-hidden="true"></span>}
            </button>

            {/* Avatar with Dropdown */}
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
                <div className="cravio-user-dropdown" style={{ minWidth: "260px" }}>
                  {/* User Info Header */}
                  <div style={{ padding: "10px 16px 12px 16px", borderBottom: "1px solid var(--cravio-border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: "14px", display: "block", color: "inherit" }}>{displayName}</strong>
                        <span style={{ fontSize: "12px", color: "var(--cravio-subtext)" }}>{user.email || "foodie@cravio.in"}</span>
                      </div>
                      <span style={{ fontSize: "11px", background: "rgba(247,168,39,0.15)", color: "var(--cravio-gold)", padding: "2px 8px", borderRadius: "10px", fontWeight: 700 }}>
                        GOLD
                      </span>
                    </div>
                  </div>

                  {/* 1. Appearance Option */}
                  <div className="cravio-appearance-box">
                    <div className="cravio-appearance-label">
                      <span>Appearance</span>
                      <span style={{ fontSize: "11px", textTransform: "none", color: "var(--cravio-gold)" }}>
                        {theme === "dark" ? "Dark Mode" : "Light Mode"}
                      </span>
                    </div>
                    <div className="cravio-theme-segmented">
                      <button
                        type="button"
                        className={`cravio-theme-option ${theme === "dark" ? "active" : ""}`}
                        onClick={() => setTheme("dark")}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.3 2a10 10 0 0 0-1.9 20 10 10 0 0 0 8.4-4.6 8 8 0 0 1-6.5-15.4z"/>
                        </svg>
                        Dark
                      </button>
                      <button
                        type="button"
                        className={`cravio-theme-option ${theme === "light" ? "active" : ""}`}
                        onClick={() => setTheme("light")}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="5" />
                          <line x1="12" y1="1" x2="12" y2="3" />
                          <line x1="12" y1="21" x2="12" y2="23" />
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                          <line x1="1" y1="12" x2="3" y2="12" />
                          <line x1="21" y1="12" x2="23" y2="12" />
                          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                        Light
                      </button>
                    </div>
                  </div>

                  {/* 2. My Orders Section in Profile */}
                  <div className="cravio-profile-orders-box">
                    <div className="cravio-appearance-label">
                      <span>My Orders</span>
                      <button
                        type="button"
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--cravio-gold)",
                          fontSize: "11px",
                          fontWeight: 700,
                          cursor: "pointer",
                          padding: 0,
                        }}
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveTab("Orders");
                        }}
                      >
                        View All ›
                      </button>
                    </div>

                    {latestOrder ? (
                      <div
                        className="cravio-profile-order-preview"
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveTab("Orders");
                        }}
                        title={`View tracking for ${latestOrder.restaurantName}`}
                      >
                        <img src={latestOrder.img || burgerImg} alt="Order" className="cravio-profile-order-img" />
                        <div className="cravio-profile-order-meta">
                          <h5>{latestOrder.restaurantName}</h5>
                          <span>● {latestOrder.status} • {latestOrder.time || "Arriving soon"}</span>
                        </div>
                      </div>
                    ) : (
                      <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "var(--cravio-subtext)" }}>
                        No orders placed yet.
                      </p>
                    )}
                  </div>

                  {/* Profile Details & Logout */}
                  <button
                    type="button"
                    className="cravio-dropdown-item"
                    onClick={() => {
                      setShowUserMenu(false);
                      setShowProfileModal(true);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Profile Settings
                  </button>

                  <button
                    type="button"
                    className="cravio-dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h1 className="cravio-greeting-title">
                Hello, {displayName} 👋
              </h1>
              <p className="cravio-greeting-sub">What are you craving today?</p>
            </div>

            {/* Current Active Filter Badge */}
            {dockTab !== "Home" && (
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "9999px",
                background: dockTab === "Healthy" ? "rgba(163,230,53,0.15)" : "rgba(247,168,39,0.15)",
                color: dockTab === "Healthy" ? "#bef264" : "var(--cravio-gold)",
                fontSize: "12px",
                fontWeight: 700,
                border: "1px solid currentColor"
              }}>
                <span>Filtered by: {dockTab === "Healthy" ? "🌱 Healthy Mode" : dockTab === "Under250" ? "🏷️ Under ₹250" : "🍽️ Dining Spots"}</span>
                <button
                  type="button"
                  onClick={() => setDockTab("Home")}
                  style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0, fontWeight: 800 }}
                  title="Clear filter"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Special Offer Banner */}
        <section className="cravio-offer-banner">
          <div className="cravio-offer-content">
            <span className="cravio-offer-tag">SPECIAL OFFER</span>
            <h2 className="cravio-offer-title">
              {dockTab === "Healthy" ? "Clean Eating 40% OFF" : "Get 50% OFF"}
            </h2>
            <p className="cravio-offer-sub">
              {dockTab === "Healthy" ? "Nutritious gourmet bowls & fresh salads" : "on fresh dishes prepared by our verified partners"}
            </p>
            <button
              type="button"
              className="cravio-offer-btn"
              onClick={() => alert("Applied code CRAVIO50! 50% discount will be applied at checkout.")}
            >
              Claim Now
            </button>
          </div>
          <div className="cravio-offer-media">
            <img
              src={saladDishImg}
              alt="Promotional Dish"
              className="cravio-offer-img"
            />
          </div>
        </section>

        {/* Categories Section */}
        <section>
          <h3 className="cravio-section-title">Categories</h3>
          <div className="cravio-categories-list">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="cravio-category-item"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchQuery(cat.id === "All" ? "" : cat.name);
                }}
              >
                <div className={`cravio-category-circle ${activeCategory === cat.id ? "active" : ""}`}>
                  <span>{cat.icon}</span>
                </div>
                <span className="cravio-category-name">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Food Reels Preview */}
        <section>
          <div className="cravio-section-header">
            <h3 className="cravio-section-title">Trending Food Reels 🔥</h3>
            <button
              type="button"
              className="cravio-see-all-btn"
              onClick={() => setActiveTab("Reels")}
            >
              <span>Watch All</span>
              <span>›</span>
            </button>
          </div>

          <div className="cravio-reels-grid">
            {foodReels.map((reel) => (
              <div
                key={reel.id}
                className="cravio-reel-card"
                onClick={() => setActiveTab("Reels")}
              >
                <img src={reel.img} alt={reel.title} className="cravio-reel-img" />
                <div className="cravio-reel-overlay"></div>

                <div className="cravio-reel-play-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>

                <div className="cravio-reel-info">
                  <h4 className="cravio-reel-title">{reel.title}</h4>
                  <div className="cravio-reel-author">
                    <span>{reel.author}</span>
                    <span>•</span>
                    <span>♥ {reel.likes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partner Dishes Section (Dynamic from Food Partners) */}
        <section>
          <div className="cravio-section-header">
            <div>
              <h3 className="cravio-section-title">
                {dockTab === "Under250" ? "Dishes Under ₹250" : dockTab === "Healthy" ? "Healthy & Diet Bowls" : "Available From Food Partners"}
              </h3>
              <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "var(--cravio-subtext)" }}>
                {filteredFoods.length} {filteredFoods.length === 1 ? "dish" : "dishes"} available
              </p>
            </div>

            <button
              type="button"
              className="cravio-see-all-btn"
              onClick={() => {
                setDockTab("Home");
                setActiveCategory("All");
                setSearchQuery("");
              }}
            >
              <span>{dockTab !== "Home" || activeCategory !== "All" ? "Reset Filters" : "Refresh"}</span>
              <span>›</span>
            </button>
          </div>

          {loadingFoods ? (
            <div style={{ textAlign: "center", padding: "50px 20px", color: "var(--cravio-subtext)" }}>
              Loading partner food items...
            </div>
          ) : filteredFoods.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 24px",
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "24px",
                border: "1.5px dashed rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ fontSize: "44px", marginBottom: "14px" }}>👨‍🍳</div>
              <h4 style={{ fontSize: "18px", fontWeight: 700, margin: "0 0 8px 0", color: "#ffffff" }}>
                {searchQuery || activeCategory !== "All" ? "No dishes match this filter" : "No Food Items Added Yet"}
              </h4>
              <p style={{ fontSize: "13.5px", color: "var(--cravio-subtext)", margin: "0 0 20px 0", maxWidth: "420px", marginInline: "auto", lineHeight: "1.5" }}>
                {searchQuery || activeCategory !== "All"
                  ? "Try resetting filters or searching for another cuisine."
                  : "Food partners can add dishes from the Partner Portal. Once added, delicious meals will immediately appear here!"}
              </p>
              <Link
                to="/partner/login"
                className="cravio-offer-btn"
                style={{ display: "inline-flex", textDecoration: "none", alignItems: "center", gap: "8px" }}
              >
                <span>Go to Partner Portal</span>
                <span>➔</span>
              </Link>
            </div>
          ) : (
            <div className="cravio-recommended-grid">
              {filteredFoods.map((dish) => (
                <div
                  key={dish.id}
                  className="cravio-restaurant-card"
                  onClick={() => alert(`Selected ${dish.name} from ${dish.restaurantName}`)}
                >
                  <div className="cravio-restaurant-media">
                    <img src={dish.img} alt={dish.name} className="cravio-restaurant-img" />

                    <div className="cravio-time-badge">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                      </svg>
                      <span>{dish.time}</span>
                    </div>

                    <button
                      type="button"
                      className={`cravio-card-heart-btn ${favorites[dish.id] ? "active" : ""}`}
                      onClick={(e) => toggleFavorite(dish.id, e)}
                      aria-label="Add to favorites"
                    >
                      <svg viewBox="0 0 24 24" fill={favorites[dish.id] ? "#EF4444" : "none"} stroke="currentColor" strokeWidth="2">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>

                  <div className="cravio-restaurant-body">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                      <div>
                        <h4 className="cravio-restaurant-name" style={{ marginBottom: "2px" }}>{dish.name}</h4>
                        <span style={{ fontSize: "12px", color: "var(--cravio-gold)", fontWeight: 700 }}>
                          by {dish.restaurantName}
                        </span>
                      </div>
                      <span className="cravio-restaurant-price" style={{ fontSize: "15px", fontWeight: 800 }}>
                        ₹{dish.numericPrice}
                      </span>
                    </div>

                    <div className="cravio-restaurant-meta" style={{ marginTop: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span className="cravio-rating-star">★ {dish.rating}</span>
                        <span>•</span>
                        <span>{dish.cuisine}</span>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(dish, e)}
                        style={{
                          background: "var(--cravio-gold)",
                          color: "#121316",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "9999px",
                          fontSize: "12px",
                          fontWeight: 800,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          transition: "transform 0.15s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                      >
                        <span>+ Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ==========================================================================
          3. REAL FLOATING CART PILL (Appears ONLY when cart has items)
          ========================================================================== */}
      {cartItems.length > 0 && showCartBar && (
        <div className="cravio-floating-cart-bar" role="region" aria-label="Cart summary">
          <div className="cravio-floating-cart-left">
            <img
              src={cartItems[0]?.img || saladDishImg}
              alt="Cart Item"
              className="cravio-floating-cart-img"
            />
            <div className="cravio-floating-cart-info">
              <h4>{primaryCartRestaurant}</h4>
              <button
                type="button"
                className="cravio-floating-cart-link"
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit" }}
                onClick={() => setShowCartModal(true)}
              >
                <span>View Cart Items</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="cravio-floating-cart-right">
            <button
              type="button"
              className="cravio-cart-view-btn"
              onClick={() => setShowCartModal(true)}
              aria-label={`View Cart (${cartItems.length} items)`}
            >
              <strong>View Cart</strong>
              <span>{cartItems.length} {cartItems.length === 1 ? "item" : "items"}</span>
            </button>

            <button
              type="button"
              className="cravio-cart-dismiss-btn"
              onClick={() => setShowCartBar(false)}
              aria-label="Dismiss Cart Pill"
              title="Hide cart bar"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ==========================================================================
          4. CUSTOM BOTTOM NAVIGATION DOCK
          ========================================================================== */}
      <nav className="cravio-custom-bottom-dock" aria-label="Bottom Navigation">
        {/* 1. Home Button (Red/Burgundy Pill Capsule) */}
        <button
          type="button"
          className={`cravio-dock-btn-home ${dockTab === "Home" ? "active" : ""}`}
          onClick={() => {
            setDockTab("Home");
            setActiveTab("Home");
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span>Home</span>
        </button>

        {/* 2. Under ₹250 */}
        <button
          type="button"
          className={`cravio-dock-btn-normal ${dockTab === "Under250" ? "active" : ""}`}
          onClick={() => setDockTab(dockTab === "Under250" ? "Home" : "Under250")}
          style={{ color: dockTab === "Under250" ? "var(--cravio-gold)" : undefined }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          <span>Under ₹250</span>
        </button>

        {/* 3. Dining */}
        <button
          type="button"
          className={`cravio-dock-btn-normal ${dockTab === "Dining" ? "active" : ""}`}
          onClick={() => {
            if (dockTab === "Dining") {
              setDockTab("Home");
            } else {
              setDockTab("Dining");
              alert("Showing premier Dine-In table reservations in " + selectedCity);
            }
          }}
          style={{ color: dockTab === "Dining" ? "var(--cravio-gold)" : undefined }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
            <path d="M4 11h16a1 1 0 0 1 1 1v1a7 7 0 0 1-7 7H10a7 7 0 0 1-7-7v-1a1 1 0 0 1 1-1z" />
            <line x1="2" y1="21" x2="22" y2="21" />
          </svg>
          <span>Dining</span>
        </button>

        {/* 4. Healthy Mode (Dark Green Capsule with Lime Heart) */}
        <button
          type="button"
          className={`cravio-dock-btn-healthy ${dockTab === "Healthy" ? "active" : ""}`}
          onClick={() => setDockTab(dockTab === "Healthy" ? "Home" : "Healthy")}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <span>Healthy Mode</span>
        </button>
      </nav>

      {/* ==========================================================================
          5. REAL CART CHECKOUT MODAL
          ========================================================================== */}
      {showCartModal && (
        <div className="cravio-cart-modal" onClick={() => setShowCartModal(false)}>
          <div className="cravio-cart-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(247,168,39,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--cravio-gold)" }}>
                  🛍️
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 800 }}>{primaryCartRestaurant}</h3>
                  <span style={{ fontSize: "12px", color: "var(--cravio-subtext)" }}>
                    {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in cart
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCartModal(false)}
                style={{ background: "transparent", border: "none", color: "inherit", fontSize: "18px", cursor: "pointer", padding: "4px" }}
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <p style={{ textAlign: "center", color: "var(--cravio-subtext)", padding: "20px 0" }}>Your cart is empty.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px", maxHeight: "240px", overflowY: "auto" }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "12px" }}>
                    <div>
                      <strong style={{ fontSize: "14px", display: "block" }}>{item.name}</strong>
                      <span style={{ fontSize: "12px", color: "var(--cravio-subtext)" }}>Qty: {item.qty} • ₹{item.price} each</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700 }}>₹{item.price * item.qty}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bill Summary */}
            {cartItems.length > 0 && (
              <>
                <div style={{ borderTop: "1px dashed var(--cravio-border)", paddingTop: "14px", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--cravio-subtext)" }}>
                    <span>Item Subtotal</span>
                    <span>₹{cartSubtotal}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--cravio-subtext)" }}>
                    <span>Delivery Partner Fee</span>
                    <span style={{ color: "#10b981", fontWeight: 600 }}>FREE</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--cravio-subtext)" }}>
                    <span>Taxes & Restaurant Charges</span>
                    <span>₹28</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 800, marginTop: "8px", paddingTop: "8px", borderTop: "1px solid var(--cravio-border)" }}>
                    <span>To Pay</span>
                    <span style={{ color: "var(--cravio-gold)" }}>₹{cartTotal}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  type="button"
                  className="cravio-offer-btn"
                  style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "15px", borderRadius: "14px" }}
                  onClick={handlePlaceOrder}
                >
                  Place Order • ₹{cartTotal} ›
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ==========================================================================
          6. PROFILE MODAL
          ========================================================================== */}
      {showProfileModal && (
        <div className="cravio-profile-modal" onClick={() => setShowProfileModal(false)}>
          <div className="cravio-profile-modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>Account & Settings</h3>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                style={{ background: "transparent", border: "none", color: "inherit", fontSize: "18px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* User Details */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px", background: "rgba(255,255,255,0.03)", borderRadius: "16px", marginBottom: "18px" }}>
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
                alt={displayName}
                style={{ width: "52px", height: "52px", borderRadius: "50%", border: "2px solid var(--cravio-gold)" }}
              />
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: "16px", display: "block" }}>{displayName}</strong>
                <span style={{ fontSize: "13px", color: "var(--cravio-subtext)" }}>{user.email || "foodie@cravio.in"}</span>
                <span style={{ fontSize: "11px", color: "var(--cravio-gold)", display: "block", marginTop: "2px", fontWeight: 700 }}>
                  ⭐ Cravio Gold Member
                </span>
              </div>
            </div>

            {/* 1. Appearance Option */}
            <div style={{ marginBottom: "18px" }}>
              <div className="cravio-appearance-label">
                <span>Appearance Theme</span>
                <span style={{ fontSize: "11px", textTransform: "none", color: "var(--cravio-gold)" }}>
                  {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                </span>
              </div>
              <div className="cravio-theme-segmented">
                <button
                  type="button"
                  className={`cravio-theme-option ${theme === "dark" ? "active" : ""}`}
                  onClick={() => setTheme("dark")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.3 2a10 10 0 0 0-1.9 20 10 10 0 0 0 8.4-4.6 8 8 0 0 1-6.5-15.4z"/>
                  </svg>
                  Dark Mode
                </button>
                <button
                  type="button"
                  className={`cravio-theme-option ${theme === "light" ? "active" : ""}`}
                  onClick={() => setTheme("light")}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                  Light Mode
                </button>
              </div>
            </div>

            {/* 2. My Orders Section */}
            <div style={{ marginBottom: "18px" }}>
              <div className="cravio-appearance-label">
                <span>My Orders</span>
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--cravio-gold)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setShowProfileModal(false);
                    setActiveTab("Orders");
                  }}
                >
                  Go to Orders ›
                </button>
              </div>

              {latestOrder ? (
                <div
                  className="cravio-profile-order-preview"
                  onClick={() => {
                    setShowProfileModal(false);
                    setActiveTab("Orders");
                  }}
                >
                  <img src={latestOrder.img || burgerImg} alt="Order" className="cravio-profile-order-img" />
                  <div className="cravio-profile-order-meta" style={{ flex: 1 }}>
                    <h5>{latestOrder.restaurantName}</h5>
                    <span style={{ color: "#10b981", fontWeight: 600 }}>● {latestOrder.status} • {latestOrder.time || "Arriving soon"}</span>
                    <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "var(--cravio-subtext)" }}>{latestOrder.items}</p>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: "12px", color: "var(--cravio-subtext)", margin: "4px 0" }}>No orders placed yet.</p>
              )}
            </div>

            {/* Saved Delivery Addresses */}
            <div style={{ marginBottom: "20px" }}>
              <div className="cravio-appearance-label">
                <span>Saved Addresses</span>
              </div>
              <div style={{ fontSize: "13px", padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span>📍</span>
                <div>
                  <strong>Home</strong>
                  <p style={{ margin: 0, fontSize: "11px", color: "var(--cravio-subtext)" }}>Civil Lines, Prayagraj, UP</p>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              className="cravio-dropdown-item logout"
              style={{ padding: "12px", borderRadius: "12px", justifyContent: "center", border: "1px solid rgba(248,113,113,0.3)" }}
              onClick={handleLogout}
            >
              Sign Out of Cravio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
