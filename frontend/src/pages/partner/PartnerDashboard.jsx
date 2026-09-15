import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * PartnerDashboard Page
 * Route: /partner/dashboard
 * Preserves the exact design from the screenshot, enhanced with:
 * - Visual "Upload Image" dropzone instead of URL input
 * - Veg / Non-Veg food type selector
 * - "Upload Restaurant Reel" section
 * - Preserved menu table with status toggling and delete actions
 */
function PartnerDashboard() {
  const [menuItems, setMenuItems] = useState([
    {
      _id: "dish_01",
      name: "Hyderabadi Dum Biryani",
      category: "Rice",
      price: 349,
      isVeg: false,
      status: "Available",
      image:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80",
    },
    {
      _id: "dish_02",
      name: "Crispy Masala Dosa",
      category: "South Indian",
      price: 159,
      isVeg: true,
      status: "Available",
      image:
        "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=300&q=80",
    },
    {
      _id: "dish_03",
      name: "Alphonso Mango Lassi",
      category: "Beverages",
      price: 89,
      isVeg: true,
      status: "Unavailable",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80",
    },
  ]);

  const [newFood, setNewFood] = useState({
    name: "",
    price: "",
    category: "Main Course",
    isVeg: true,
    description: "",
  });

  const [reelTitle, setReelTitle] = useState("");
  const [reelPublishSuccess, setReelPublishSuccess] = useState(false);

  const handleToggleStatus = (id) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, status: item.status === "Available" ? "Unavailable" : "Available" }
          : item
      )
    );
  };

  const handleDeleteDish = (id) => {
    setMenuItems((prev) => prev.filter((item) => item._id !== id));
  };

  const handleAddDish = (e) => {
    e.preventDefault();
    if (!newFood.name || !newFood.price) return;

    const addedItem = {
      _id: `dish_${Date.now()}`,
      name: newFood.name,
      category: newFood.category,
      price: Number(newFood.price),
      isVeg: newFood.isVeg,
      status: "Available",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80",
    };

    setMenuItems([addedItem, ...menuItems]);
    setNewFood({
      name: "",
      price: "",
      category: "Main Course",
      isVeg: true,
      description: "",
    });
  };

  const handlePublishReel = (e) => {
    e.preventDefault();
    setReelPublishSuccess(true);
    setReelTitle("");
    setTimeout(() => setReelPublishSuccess(false), 3000);
  };

  return (
    <div className="partner-dashboard-container">
      {/* Dashboard Header */}
      <div className="partner-dash-header">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-light)" }}>
              Spice Garden Kitchen
            </h1>
            <span className="status-pill available">● Kitchen Live</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
            Partner ID: part_65f8a01b2c • Chef Rajesh Sharma • Bandra West, Mumbai
          </p>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/user/dashboard" className="cravio-btn cravio-btn-outline cravio-btn-sm">
            View Live Storefront
          </Link>
          <Link to="/partner/login" className="cravio-btn cravio-btn-danger cravio-btn-sm">
            Partner Sign Out
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="dash-stats-grid">
        <div className="dash-stat-card">
          <div className="dash-stat-label">Total Menu Dishes</div>
          <div className="dash-stat-value">{menuItems.length}</div>
          <div className="dash-stat-meta">Active in catalog</div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-label">Available for Order</div>
          <div className="dash-stat-value" style={{ color: "var(--status-available)" }}>
            {menuItems.filter((i) => i.status === "Available").length}
          </div>
          <div className="dash-stat-meta">Accepting orders</div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-label">Customer Rating</div>
          <div className="dash-stat-value" style={{ color: "#f59e0b" }}>
            ⭐ 4.8 / 5.0
          </div>
          <div className="dash-stat-meta">From 340+ reviews</div>
        </div>
      </div>

      {/* Add Food Form Card */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
          marginBottom: "32px",
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-light)" }}>
            Add New Food Item
          </h2>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
            Publish a new dish to your kitchen's digital menu
          </p>
        </div>

        <form onSubmit={handleAddDish}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Dish Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Kadai Paneer"
                value={newFood.name}
                onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price (INR ₹) *</label>
              <input
                type="number"
                required
                className="form-input"
                placeholder="249"
                value={newFood.price}
                onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={newFood.category}
                onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
              >
                <option value="Main Course">Main Course</option>
                <option value="Rice">Rice & Biryani</option>
                <option value="Burgers">Fast Food / Burgers</option>
                <option value="South Indian">South Indian</option>
                <option value="Dessert">Dessert</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            {/* Veg / Non-Veg Selector */}
            <div className="form-group">
              <label className="form-label">Food Type</label>
              <div style={{ display: "flex", gap: 10, height: 40, alignItems: "center" }}>
                <label
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    background: newFood.isVeg ? "rgba(22, 163, 74, 0.15)" : "var(--bg-input)",
                    border: `1px solid ${newFood.isVeg ? "var(--tag-veg)" : "var(--border-subtle)"}`,
                    borderRadius: "var(--radius-sm)",
                    padding: "8px",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    color: newFood.isVeg ? "var(--tag-veg)" : "var(--text-secondary)",
                  }}
                >
                  <input
                    type="radio"
                    name="foodType"
                    checked={newFood.isVeg === true}
                    onChange={() => setNewFood({ ...newFood, isVeg: true })}
                    style={{ display: "none" }}
                  />
                  <span>🟢 Veg</span>
                </label>

                <label
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    background: !newFood.isVeg ? "rgba(220, 38, 38, 0.15)" : "var(--bg-input)",
                    border: `1px solid ${!newFood.isVeg ? "var(--tag-nonveg)" : "var(--border-subtle)"}`,
                    borderRadius: "var(--radius-sm)",
                    padding: "8px",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    color: !newFood.isVeg ? "var(--tag-nonveg)" : "var(--text-secondary)",
                  }}
                >
                  <input
                    type="radio"
                    name="foodType"
                    checked={newFood.isVeg === false}
                    onChange={() => setNewFood({ ...newFood, isVeg: false })}
                    style={{ display: "none" }}
                  />
                  <span>🔴 Non-Veg</span>
                </label>
              </div>
            </div>
          </div>

          {/* Upload Image Dropzone UI */}
          <div className="form-group" style={{ marginTop: 14 }}>
            <label className="form-label">Food Image</label>
            <div
              style={{
                border: "1.5px dashed var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-input)",
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 4 }}>📷</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-light)" }}>
                Click to upload food image
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                PNG, JPG, WEBP up to 5MB (Multer multipart pipeline)
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 14 }}>
            <label className="form-label">Description & Ingredients</label>
            <textarea
              rows={2}
              className="form-textarea"
              placeholder="Freshly prepared chef specialty with roasted whole spices..."
              value={newFood.description}
              onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
            <button type="submit" className="cravio-btn cravio-btn-primary">
              + Publish Dish to Menu
            </button>
          </div>
        </form>
      </div>

      {/* Upload Reel Section */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
          marginBottom: "32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-light)" }}>
              Upload Restaurant Reel 🎬
            </h2>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
              Post short culinary clips to feature on the Customer Discovery Feed
            </p>
          </div>
          <span className="hero-badge" style={{ margin: 0, padding: "3px 10px", fontSize: 11 }}>
            Video Feature
          </span>
        </div>

        <form onSubmit={handlePublishReel}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, alignItems: "center" }}>
            <div
              style={{
                border: "1.5px dashed var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-input)",
                padding: "28px 20px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>🎥</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-light)" }}>
                + Upload Reel Video
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                MP4 / MOV / WEBM (Vertical 9:16 recommended, max 60s)
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Reel Title / Dish Featured</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Sizzling Charcoal Tandoor Flame"
                  value={reelTitle}
                  onChange={(e) => setReelTitle(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="cravio-btn cravio-btn-secondary"
                style={{ borderColor: "var(--brand-primary)", color: "var(--brand-primary)" }}
              >
                Publish Reel
              </button>

              {reelPublishSuccess && (
                <div style={{ fontSize: 12, color: "var(--status-available)", textAlign: "center" }}>
                  ✓ Reel submitted for customer discovery feed!
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Menu Management Table Card */}
      <div className="menu-table-card">
        <div className="table-header-bar">
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-light)" }}>
              Current Menu Catalog ({menuItems.length})
            </h2>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
              Manage item availability and remove items
            </p>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="cravio-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Dish</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Type</th>
                <th>Availability</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img src={item.image} alt={item.name} className="table-food-img" />
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--text-light)" }}>
                    {item.name}
                  </td>
                  <td>
                    <span
                      style={{
                        background: "var(--bg-input)",
                        padding: "3px 8px",
                        borderRadius: "var(--radius-sm)",
                        fontSize: 11,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: "var(--text-light)" }}>
                    ₹{item.price}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 12,
                        color: item.isVeg ? "var(--tag-veg)" : "var(--tag-nonveg)",
                        fontWeight: 600,
                      }}
                    >
                      {item.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${
                        item.status === "Available" ? "available" : "unavailable"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item._id)}
                        className="cravio-btn cravio-btn-outline cravio-btn-sm"
                      >
                        Toggle Status
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDish(item._id)}
                        className="cravio-btn cravio-btn-danger cravio-btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PartnerDashboard;
