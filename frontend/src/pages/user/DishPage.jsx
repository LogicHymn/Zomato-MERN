import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { DEMO_DISHES } from "../../data/demoDishes";
import { useCart } from "../../context/CartContext";
import CartBar from "../../components/CartBar";

/**
 * DishPage Component
 * Route: /dish/:id
 * Single reusable dish details page for all food items
 */
function DishPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  // Find dish from central data or fallback to first dish
  const dish = DEMO_DISHES.find((d) => String(d.id) === String(id)) || DEMO_DISHES[0];

  const [quantity, setQuantity] = useState(1);
  const [addedNotif, setAddedNotif] = useState(false);

  const isAvailable = dish.status === "Available";

  const handleAdd = () => {
    if (!isAvailable) return;
    addToCart(dish, quantity);
    setAddedNotif(true);
    setTimeout(() => setAddedNotif(false), 2000);
  };

  return (
    <div className="dish-page-container" style={{ maxWidth: 1000, margin: "32px auto 90px", padding: "0 24px" }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 20, fontSize: 13, color: "var(--text-secondary)" }}>
        <Link to="/user/dashboard" style={{ color: "var(--text-muted)" }}>
          ← Back to Food Discovery
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "var(--text-primary)" }}>{dish.name}</span>
      </div>

      <div
        className="dish-layout-card"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 0,
        }}
      >
        {/* Large Food Image */}
        <div style={{ position: "relative", minHeight: 360, background: "var(--bg-input)" }}>
          <img
            src={dish.image}
            alt={dish.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <span
            className={`food-status-badge ${isAvailable ? "available" : "unavailable"}`}
            style={{ position: "absolute", top: 16, left: 16 }}
          >
            {isAvailable ? "● Available Now" : "● Sold Out"}
          </span>
          <span
            className="food-category-badge"
            style={{ position: "absolute", bottom: 16, left: 16, padding: "5px 12px", fontSize: 12 }}
          >
            {dish.category}
          </span>
        </div>

        {/* Dish Details */}
        <div style={{ padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            {/* Header info */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div
                className="veg-indicator"
                title={dish.isVeg ? "Pure Vegetarian" : "Non-Vegetarian"}
              >
                <div
                  className="veg-indicator-dot"
                  style={{ backgroundColor: dish.isVeg ? "var(--tag-veg)" : "var(--tag-nonveg)" }}
                />
              </div>
              <span style={{ fontSize: 13, color: dish.isVeg ? "var(--tag-veg)" : "var(--tag-nonveg)", fontWeight: 600 }}>
                {dish.isVeg ? "Pure Veg" : "Non-Veg"}
              </span>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-light)", marginBottom: 6 }}>
              {dish.name}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: 13, marginBottom: 16 }}>
              <span>🏪 Prepared by:</span>
              <strong style={{ color: "var(--text-primary)" }}>{dish.restaurantName}</strong>
            </div>

            <div style={{ fontSize: 24, fontWeight: 800, color: "var(--brand-primary)", marginBottom: 18 }}>
              ₹{dish.price}
            </div>

            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              {dish.description}
            </p>

            {/* Ingredients */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                Ingredients & Preparation
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {dish.ingredients}
              </p>
            </div>

            {/* Nutrition & Macros */}
            <div
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                marginBottom: 24,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                Nutrition & Macros (Per Serving)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, textAlign: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Calories</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-light)", marginTop: 2 }}>
                    {dish.macros?.calories || "450 kcal"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Protein</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#38bdf8", marginTop: 2 }}>
                    {dish.macros?.protein || "22 g"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Carbs</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#facc15", marginTop: 2 }}>
                    {dish.macros?.carbs || "48 g"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Fat</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f87171", marginTop: 2 }}>
                    {dish.macros?.fat || "18 g"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add to order controls */}
          <div style={{ paddingTop: 18, borderTop: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              {/* Quantity selector */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
                  Quantity:
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bg-input)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: 4 }}>
                  <button
                    type="button"
                    className="cravio-btn cravio-btn-secondary cravio-btn-sm"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    −
                  </button>
                  <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="cravio-btn cravio-btn-secondary cravio-btn-sm"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Order Button */}
              <button
                type="button"
                className="cravio-btn cravio-btn-primary"
                disabled={!isAvailable}
                onClick={handleAdd}
                style={{ flex: 1, padding: "12px 20px" }}
              >
                {isAvailable ? `Add ${quantity} to Order • ₹${dish.price * quantity}` : "Dish Unavailable"}
              </button>
            </div>

            {addedNotif && (
              <div style={{ fontSize: 12, color: "var(--status-available)", textAlign: "center", marginTop: 10 }}>
                ✓ {dish.name} added to your cart!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Persistent Bottom Cart Action Bar */}
      <CartBar />
    </div>
  );
}

export default DishPage;
