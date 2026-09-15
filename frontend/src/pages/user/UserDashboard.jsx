import React, { useState } from "react";
import { Link } from "react-router-dom";
import CategoryBar from "../../components/CategoryBar";
import FoodCard from "../../components/FoodCard";
import ReelCard from "../../components/ReelCard";
import CartBar from "../../components/CartBar";
import { DEMO_DISHES, DEMO_REELS } from "../../data/demoDishes";

/**
 * UserDashboard Component
 * Main food discovery feed with dish cards, side culinary reels, and partner CTA
 */
function UserDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Main Course",
    "Biryani",
    "Burgers",
    "South Indian",
    "Dessert",
    "Beverages",
  ];

  const filteredDishes =
    selectedCategory === "All"
      ? DEMO_DISHES
      : DEMO_DISHES.filter(
          (d) => d.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="user-dashboard-page" style={{ paddingBottom: 80 }}>
      {/* Category Filter Bar */}
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Main Feed with Dishes & Reels */}
      <div
        className="feed-layout-container"
        style={{
          maxWidth: 1280,
          margin: "24px auto 0",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 32,
          alignItems: "start",
        }}
      >
        {/* Left/Center: Food Discovery Grid */}
        <section>
          <div className="section-header">
            <div>
              <h2 className="section-title">Food Discovery</h2>
              <p className="section-subtitle">
                Click any dish to inspect culinary details, macros & ingredients
              </p>
            </div>
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              {filteredDishes.length} dishes available
            </span>
          </div>

          <div className="food-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
            {filteredDishes.map((dish) => (
              <FoodCard key={dish.id} item={dish} />
            ))}
          </div>
        </section>

        {/* Right: Food Reels Section */}
        <aside
          className="reels-sidebar-section"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "20px",
            position: "sticky",
            top: 80,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-light)" }}>
                Kitchen Reels 🎬
              </h3>
              <p style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                Behind-the-scenes culinary clips
              </p>
            </div>
            <span className="hero-badge" style={{ margin: 0, padding: "2px 8px", fontSize: 10 }}>
              Live
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {DEMO_REELS.map((reel) => (
              <ReelCard key={reel.id} reel={reel} />
            ))}
          </div>
        </aside>
      </div>

      {/* Restaurant Owner CTA Card at Bottom */}
      <section style={{ maxWidth: 1280, margin: "64px auto 0", padding: "0 24px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #182234 0%, #101622 100%)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "36px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <span
              style={{
                color: "#f59e0b",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Partner Program
            </span>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-light)", margin: "8px 0" }}>
              ARE YOU A RESTAURANT OWNER OR CHEF?
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5 }}>
              Bring your kitchen to CRAVIO and reach hungry customers in your neighborhood.
              Upload custom menus, manage item availability, and showcase signature dishes.
            </p>
          </div>

          <Link
            to="/partner/signup"
            className="cravio-btn cravio-btn-primary"
            style={{ background: "#f59e0b", color: "#000", padding: "12px 24px" }}
          >
            Register Your Kitchen →
          </Link>
        </div>
      </section>

      {/* Persistent Bottom Cart Action Bar */}
      <CartBar />
    </div>
  );
}

export default UserDashboard;
