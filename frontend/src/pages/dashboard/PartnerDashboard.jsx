import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/cravio_partner.css";

// Decorative Photography Assets
import burgerImg from "../../assets/cravio_burger.jpg";
import saladDishImg from "../../assets/cravio_salad_dish.jpg";
import chiliBowlImg from "../../assets/cravio_chili_bowl.jpg";

function PartnerDashboard() {
  const navigate = useNavigate();
  const partner = JSON.parse(localStorage.getItem("cravioPartner") || "{}");
  const restaurantName = partner.restaurantName || "Shlok's Kitchen";

  // Dashboard States
  const [activeNav, setActiveNav] = useState("Home");
  const [restaurantStatus, setRestaurantStatus] = useState("Open"); // "Open" | "Busy" | "Closed"
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Dynamic Menu Items (Starts Empty - NO dummy items)
  const [menuItems, setMenuItems] = useState([]);
  const [loadingFoods, setLoadingFoods] = useState(true);

  // Modal State for Adding Food Items
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Burgers");
  const [newItemImage, setNewItemImage] = useState(burgerImg);
  const [submitting, setSubmitting] = useState(false);

  // Load food items from Backend and localStorage
  const loadPartnerFoods = async () => {
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
          desc: f.description,
          price: f.price,
          category: f.category,
          status: f.status || "Available",
          img: f.image || saladDishImg,
          restaurantName: f.restaurantName || f.foodPartner?.restaurantName || restaurantName,
        }));

        // Merge backend foods with local foods (prevent duplicates)
        const combined = [...backendFoods];
        localFoods.forEach((lf) => {
          if (!combined.some((cf) => cf.id === lf.id || cf.name === lf.name)) {
            combined.push(lf);
          }
        });

        setMenuItems(combined);
        setLoadingFoods(false);
        return;
      }
    } catch (err) {
      console.warn("Backend foods fetch warning:", err.message);
    }

    setMenuItems(localFoods);
    setLoadingFoods(false);
  };

  useEffect(() => {
    loadPartnerFoods();

    const handleFoodsUpdated = () => {
      loadPartnerFoods();
    };

    window.addEventListener("cravio-foods-updated", handleFoodsUpdated);
    window.addEventListener("storage", handleFoodsUpdated);

    return () => {
      window.removeEventListener("cravio-foods-updated", handleFoodsUpdated);
      window.removeEventListener("storage", handleFoodsUpdated);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/food-partner/logout", {}, { withCredentials: true });
    } catch (err) {
      console.warn("Logout error:", err);
    }
    localStorage.removeItem("cravioPartner");
    navigate("/partner/login");
  };

  const toggleItemAvailability = async (id) => {
    const updated = menuItems.map((item) => {
      if (item.id === id) {
        const newStatus = item.status === "Available" ? "Unavailable" : "Available";
        return { ...item, status: newStatus };
      }
      return item;
    });

    setMenuItems(updated);
    localStorage.setItem("cravioCustomFoods", JSON.stringify(updated));
    window.dispatchEvent(new Event("cravio-foods-updated"));

    try {
      await axios.patch(`http://localhost:3000/api/food/${id}/status`, {}, { withCredentials: true });
    } catch (err) {
      console.warn("Could not patch status to backend:", err.message);
    }
  };

  const handleDeleteItem = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this food item?")) return;

    const updated = menuItems.filter((item) => item.id !== id);
    setMenuItems(updated);
    localStorage.setItem("cravioCustomFoods", JSON.stringify(updated));
    window.dispatchEvent(new Event("cravio-foods-updated"));

    try {
      await axios.delete(`http://localhost:3000/api/food/${id}`, { withCredentials: true });
    } catch (err) {
      console.warn("Could not delete from backend:", err.message);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice) return;

    setSubmitting(true);

    const newFoodObj = {
      id: "food_" + Date.now(),
      name: newItemName.trim(),
      description: newItemDesc.trim() || "Delicious freshly prepared dish from our kitchen.",
      price: parseFloat(newItemPrice) || 199,
      category: newItemCategory,
      image: newItemImage,
      restaurantName,
      status: "Available",
    };

    // 1. Try posting to backend
    try {
      const res = await axios.post(
        "http://localhost:3000/api/food",
        {
          name: newFoodObj.name,
          description: newFoodObj.description,
          price: newFoodObj.price,
          category: newFoodObj.category,
          image: newFoodObj.image,
          restaurantName,
        },
        { withCredentials: true }
      );

      if (res.data?.food?._id) {
        newFoodObj.id = res.data.food._id;
      }
    } catch (err) {
      console.warn("Backend save warning (saved locally):", err.message);
    }

    // 2. Save locally and emit sync event so User side immediately receives the new food
    const updatedFoods = [
      {
        id: newFoodObj.id,
        name: newFoodObj.name,
        desc: newFoodObj.description,
        price: newFoodObj.price,
        category: newFoodObj.category,
        status: "Available",
        img: newFoodObj.image,
        restaurantName,
      },
      ...menuItems,
    ];

    setMenuItems(updatedFoods);
    localStorage.setItem("cravioCustomFoods", JSON.stringify(updatedFoods));
    window.dispatchEvent(new Event("cravio-foods-updated"));

    // Reset form
    setNewItemName("");
    setNewItemPrice("");
    setNewItemDesc("");
    setShowAddModal(false);
    setSubmitting(false);
  };

  // Filtered Menu Items
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.desc && item.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="cravio-partner-dash-page">
      {/* 1. Left Sidebar (Desktop) */}
      <aside className="cravio-partner-sidebar">
        <div>
          {/* Brand */}
          <div className="cravio-partner-side-brand">
            <div className="cravio-partner-side-brand-name">
              Cravio
              <span style={{ color: "var(--partner-gold)", fontSize: "14px" }}>●</span>
            </div>
            <span className="cravio-partner-side-brand-badge">Partner Portal</span>
          </div>

          {/* Navigation Items */}
          <nav className="cravio-partner-side-nav">
            <button
              type="button"
              className={`cravio-partner-nav-item ${activeNav === "Home" ? "active" : ""}`}
              onClick={() => setActiveNav("Home")}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              <span>Home</span>
            </button>

            <button
              type="button"
              className={`cravio-partner-nav-item ${activeNav === "Menu" ? "active" : ""}`}
              onClick={() => setActiveNav("Menu")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Menu Items</span>
            </button>

            <button
              type="button"
              className={`cravio-partner-nav-item ${activeNav === "Orders" ? "active" : ""}`}
              onClick={() => setActiveNav("Orders")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Orders</span>
            </button>

            <button
              type="button"
              className={`cravio-partner-nav-item ${activeNav === "Analytics" ? "active" : ""}`}
              onClick={() => setActiveNav("Analytics")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>Analytics</span>
            </button>

            <button
              type="button"
              className={`cravio-partner-nav-item ${activeNav === "Reviews" ? "active" : ""}`}
              onClick={() => setActiveNav("Reviews")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span>Reviews</span>
            </button>

            <button
              type="button"
              className={`cravio-partner-nav-item ${activeNav === "Wallet" ? "active" : ""}`}
              onClick={() => setActiveNav("Wallet")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z" />
              </svg>
              <span>Wallet</span>
            </button>

            <button
              type="button"
              className={`cravio-partner-nav-item ${activeNav === "Settings" ? "active" : ""}`}
              onClick={() => setActiveNav("Settings")}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar Box */}
        <div className="cravio-partner-side-bottom">
          <div className="cravio-partner-side-story-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--partner-gold)" strokeWidth="2" style={{ margin: "0 auto 6px auto", display: "block" }}>
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6z" />
              <line x1="6" y1="17" x2="18" y2="17" />
            </svg>
            <span>Good Food Builds Great Stories</span>
          </div>

          <button type="button" className="cravio-partner-logout-btn" onClick={handleLogout}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Dashboard Content */}
      <main className="cravio-partner-main">
        {/* Top Header Bar */}
        <header className="cravio-partner-topbar">
          <div className="cravio-partner-topbar-left">
            <h1>Good Morning, {restaurantName} 👋</h1>
            <p>Delicious food. Happier people.</p>
          </div>

          <div className="cravio-partner-topbar-right">
            {/* Live Restaurant Status Pill (Open / Busy / Closed) */}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                className={`cravio-partner-status-pill ${restaurantStatus.toLowerCase()}`}
                onClick={() => setShowStatusMenu(!showStatusMenu)}
              >
                <span className="cravio-partner-status-dot"></span>
                <span>{restaurantStatus}</span>
                <span style={{ fontSize: "10px", marginLeft: "2px" }}>▼</span>
              </button>

              {showStatusMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "40px",
                    right: 0,
                    background: "#1a1b24",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "14px",
                    padding: "6px",
                    minWidth: "120px",
                    zIndex: 50,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.7)",
                  }}
                >
                  {["Open", "Busy", "Closed"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        width: "100%",
                        padding: "8px 12px",
                        background: "transparent",
                        border: "none",
                        color: "#ffffff",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        cursor: "pointer",
                        borderRadius: "8px",
                        textAlign: "left",
                      }}
                      onClick={() => {
                        setRestaurantStatus(st);
                        setShowStatusMenu(false);
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: st === "Open" ? "#34d399" : st === "Busy" ? "#fbbf24" : "#f87171",
                        }}
                      ></span>
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              className="cravio-partner-bell"
              onClick={() => alert("No new notifications at this time")}
              aria-label="Partner notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>

            {/* Avatar */}
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=120&q=80"
              alt="Partner Chef"
              className="cravio-partner-top-avatar"
              onClick={() => alert(`Logged in as Food Partner: ${restaurantName}`)}
            />
          </div>
        </header>

        {/* 3. Promotional Hero Card (Bring Your Best Dishes) */}
        <section className="cravio-partner-hero-promo">
          <div className="cravio-partner-hero-promo-left">
            <h2 className="cravio-partner-hero-promo-title">Bring Your Best Dishes to More Food Lovers</h2>
            <p className="cravio-partner-hero-promo-sub">Add, manage and update your menu easily.</p>
            <button
              type="button"
              className="cravio-partner-add-btn-solid"
              onClick={() => setShowAddModal(true)}
            >
              <span>+</span>
              <span>Add New Food Item</span>
            </button>
          </div>

          <div className="cravio-partner-hero-promo-media">
            <img src={saladDishImg} alt="Special Menu Item" className="cravio-partner-hero-promo-img" />
            <div className="cravio-partner-hero-promo-chalk">Cook Serve Grow ✨</div>
          </div>
        </section>

        {/* 4. 4 Stat KPI Cards (Starts clean with 0) */}
        <section className="cravio-partner-kpi-grid">
          {/* 1. Total Orders */}
          <div className="cravio-partner-kpi-card">
            <div className="cravio-partner-kpi-icon" style={{ background: "rgba(247,168,39,0.15)", color: "var(--partner-gold)" }}>
              🍽️
            </div>
            <div className="cravio-partner-kpi-val">0</div>
            <div className="cravio-partner-kpi-label">Total Orders</div>
            <div className="cravio-partner-kpi-trend">
              <span className="cravio-partner-trend-pill" style={{ color: "#9ca3af" }}>0% this week</span>
            </div>
          </div>

          {/* 2. Total Revenue */}
          <div className="cravio-partner-kpi-card">
            <div className="cravio-partner-kpi-icon" style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>
              ₹
            </div>
            <div className="cravio-partner-kpi-val">₹0</div>
            <div className="cravio-partner-kpi-label">Total Revenue</div>
            <div className="cravio-partner-kpi-trend">
              <span className="cravio-partner-trend-pill" style={{ color: "#9ca3af" }}>0% this week</span>
            </div>
          </div>

          {/* 3. Happy Customers */}
          <div className="cravio-partner-kpi-card">
            <div className="cravio-partner-kpi-icon" style={{ background: "rgba(96,165,250,0.15)", color: "#60a5fa" }}>
              👥
            </div>
            <div className="cravio-partner-kpi-val">0</div>
            <div className="cravio-partner-kpi-label">Happy Customers</div>
            <div className="cravio-partner-kpi-trend">
              <span className="cravio-partner-trend-pill" style={{ color: "#9ca3af" }}>0% this week</span>
            </div>
          </div>

          {/* 4. Avg. Rating */}
          <div className="cravio-partner-kpi-card">
            <div className="cravio-partner-kpi-icon" style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}>
              ★
            </div>
            <div className="cravio-partner-kpi-val">—</div>
            <div className="cravio-partner-kpi-label">Avg. Rating</div>
            <div className="cravio-partner-kpi-trend">
              <span className="cravio-partner-trend-pill" style={{ color: "#9ca3af" }}>New Partner</span>
            </div>
          </div>
        </section>

        {/* 5. Your Menu Items Section */}
        <section className="cravio-partner-menu-box">
          <div className="cravio-partner-menu-header">
            <div>
              <h3 className="cravio-partner-menu-title">Your Menu Items</h3>
              <span style={{ fontSize: "12px", color: "var(--partner-subtext)" }}>
                {menuItems.length} {menuItems.length === 1 ? "item" : "items"} currently published
              </span>
            </div>

            <div className="cravio-partner-menu-controls">
              {/* Search Bar */}
              <div className="cravio-partner-menu-search">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" style={{ marginRight: "8px" }}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search food items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Category Dropdown */}
              <select
                className="cravio-partner-filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Burgers">Burgers</option>
                <option value="Pizza">Pizza</option>
                <option value="Pasta">Pasta</option>
                <option value="Momos">Momos</option>
                <option value="North Indian">North Indian</option>
                <option value="Chinese">Chinese</option>
                <option value="Beverages">Beverages</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>
          </div>

          {/* Menu Items List or Clean Empty State */}
          {loadingFoods ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--partner-subtext)" }}>
              Loading menu items...
            </div>
          ) : filteredMenuItems.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "50px 24px",
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "20px",
                border: "1px dashed rgba(255, 255, 255, 0.1)",
              }}
            >
              <div style={{ fontSize: "42px", marginBottom: "12px" }}>🍽️</div>
              <h4 style={{ fontSize: "17px", fontWeight: 700, margin: "0 0 6px 0", color: "#ffffff" }}>
                {searchQuery ? "No dishes match your search" : "No Menu Items Added Yet"}
              </h4>
              <p style={{ fontSize: "13px", color: "var(--partner-subtext)", margin: "0 0 20px 0", maxWidth: "380px", marginInline: "auto" }}>
                {searchQuery
                  ? "Try searching for another dish or clear your search query."
                  : "Add your first dish using the button below. Once published, it will immediately appear on the User app for customers to order!"}
              </p>
              <button
                type="button"
                className="cravio-partner-add-btn-solid"
                onClick={() => setShowAddModal(true)}
              >
                + Add New Food Item
              </button>
            </div>
          ) : (
            <div className="cravio-partner-items-list">
              {filteredMenuItems.map((item) => (
                <div key={item.id} className="cravio-partner-item-row">
                  <div className="cravio-partner-item-left">
                    <img src={item.img} alt={item.name} className="cravio-partner-item-thumb" />
                    <div className="cravio-partner-item-info">
                      <h4>{item.name}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>

                  <div className="cravio-partner-item-right">
                    <span className="cravio-partner-item-price">₹{item.price}</span>

                    <button
                      type="button"
                      className={`cravio-partner-avail-pill ${item.status.toLowerCase()}`}
                      onClick={() => toggleItemAvailability(item.id)}
                      title="Click to toggle Available / Unavailable"
                    >
                      {item.status}
                    </button>

                    <div className="cravio-partner-item-actions">
                      <button
                        type="button"
                        className="cravio-partner-edit-btn"
                        onClick={() => alert(`Edit item: ${item.name}`)}
                        title="Edit dish"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        className="cravio-partner-more-btn"
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        title="Delete dish"
                        style={{ color: "#f87171" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Outline Add Button */}
          <button
            type="button"
            className="cravio-partner-add-outline-btn"
            onClick={() => setShowAddModal(true)}
          >
            <span>+</span>
            <span>Add New Food Item</span>
          </button>
        </section>

        {/* 6. Upgrade to Cravio Pro Banner */}
        <section className="cravio-partner-upgrade-box">
          <div className="cravio-partner-upgrade-left">
            <div className="cravio-partner-crown-icon">👑</div>
            <div className="cravio-partner-upgrade-info">
              <h4>Upgrade to Cravio Pro</h4>
              <p>Get featured, lower commission and more benefits.</p>
            </div>
          </div>

          <button
            type="button"
            className="cravio-partner-upgrade-btn"
            onClick={() => alert("Redirecting to Cravio Pro subscription plans...")}
          >
            <span>Upgrade Now</span>
            <span>➔</span>
          </button>
        </section>
      </main>

      {/* 7. Add New Food Item Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: "20px",
            boxSizing: "border-box",
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: "#181a24",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "24px",
              padding: "26px",
              maxWidth: "480px",
              width: "100%",
              boxSizing: "border-box",
              boxShadow: "0 25px 60px rgba(0,0,0,0.85)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>Add New Food Item</h3>
                <span style={{ fontSize: "12px", color: "var(--partner-subtext)" }}>
                  Listing for: {restaurantName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: "transparent", border: "none", color: "#ffffff", fontSize: "18px", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="cravio-partner-field">
                <label>Dish Name *</label>
                <div className="cravio-partner-input-wrap">
                  <input
                    type="text"
                    className="cravio-partner-input"
                    placeholder="e.g. Paneer Butter Masala"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="cravio-partner-field">
                  <label>Price (₹) *</label>
                  <div className="cravio-partner-input-wrap">
                    <input
                      type="number"
                      className="cravio-partner-input"
                      placeholder="e.g. 249"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="cravio-partner-field">
                  <label>Category</label>
                  <div className="cravio-partner-input-wrap">
                    <select
                      className="cravio-partner-input"
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      style={{ background: "transparent", color: "#ffffff" }}
                    >
                      <option value="Burgers" style={{ background: "#181a24" }}>Burgers</option>
                      <option value="Pizza" style={{ background: "#181a24" }}>Pizza</option>
                      <option value="Pasta" style={{ background: "#181a24" }}>Pasta</option>
                      <option value="Momos" style={{ background: "#181a24" }}>Momos</option>
                      <option value="North Indian" style={{ background: "#181a24" }}>North Indian</option>
                      <option value="Chinese" style={{ background: "#181a24" }}>Chinese</option>
                      <option value="Beverages" style={{ background: "#181a24" }}>Beverages</option>
                      <option value="Desserts" style={{ background: "#181a24" }}>Desserts</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Photo Preset Selector */}
              <div className="cravio-partner-field">
                <label>Dish Photo Preset</label>
                <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "6px" }}>
                  {[
                    { label: "Burger", url: burgerImg },
                    { label: "Salad / Bowl", url: saladDishImg },
                    { label: "Spicy / Momos", url: chiliBowlImg },
                    { label: "Pizza", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80" },
                    { label: "Pasta", url: "https://images.unsplash.com/photo-1621996346565-e3d5d6281696?auto=format&fit=crop&w=300&q=80" },
                    { label: "Biryani", url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80" },
                    { label: "Coffee", url: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=300&q=80" },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setNewItemImage(preset.url)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "10px",
                        border: newItemImage === preset.url ? "2px solid var(--partner-gold)" : "1px solid rgba(255,255,255,0.1)",
                        background: newItemImage === preset.url ? "rgba(247,168,39,0.15)" : "#1f202b",
                        color: newItemImage === preset.url ? "var(--partner-gold)" : "#cbd5e1",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cravio-partner-field">
                <label>Description</label>
                <div className="cravio-partner-input-wrap" style={{ height: "auto", padding: "10px 14px" }}>
                  <textarea
                    className="cravio-partner-input"
                    rows="2"
                    placeholder="Brief description of flavors, toppings or ingredients..."
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    style={{ resize: "none" }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="cravio-partner-submit-btn"
                style={{ marginTop: "10px" }}
                disabled={submitting}
              >
                {submitting ? "Publishing..." : "Publish Dish to Cravio ➔"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PartnerDashboard;
