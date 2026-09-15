import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

/**
 * FoodCard component
 * Food discovery item card linking to /dish/:id on click,
 * with pure-veg tag, price, and seamless CartContext integration.
 */
function FoodCard({ item }) {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity } = useCart();

  const cartEntry = cartItems.find((ci) => String(ci.dish.id) === String(item.id));
  const qty = cartEntry ? cartEntry.quantity : 0;
  const isAvailable = item.status === "Available";

  const handleCardClick = () => {
    navigate(`/dish/${item.id}`);
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (!isAvailable) return;
    addToCart(item, 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateQuantity(item.id, qty - 1);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    addToCart(item, 1);
  };

  return (
    <div className="cravio-food-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <div className="food-card-thumb-wrap">
        <img
          src={
            item.image ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
          }
          alt={item.name}
          className="food-card-img"
        />
        <span className={`food-status-badge ${isAvailable ? "available" : "unavailable"}`}>
          {isAvailable ? "Available" : "Sold Out"}
        </span>
        <span className="food-category-badge">{item.category || "Special"}</span>
      </div>

      <div className="food-card-body">
        <div className="food-title-row">
          <h3 className="food-item-name">{item.name}</h3>
          <span className="food-item-price">₹{item.price}</span>
        </div>

        <div className="food-restaurant-name">
          <span>🏪</span>
          <span>{item.restaurantName || "Cravio Partner Kitchen"}</span>
        </div>

        <p className="food-desc">{item.description}</p>

        <div className="food-card-footer">
          <div className="veg-indicator" title={item.isVeg !== false ? "Pure Veg" : "Non-Veg"}>
            <div
              className="veg-indicator-dot"
              style={{
                backgroundColor: item.isVeg !== false ? "var(--tag-veg)" : "var(--tag-nonveg)",
              }}
            />
          </div>

          <div>
            {qty === 0 ? (
              <button
                type="button"
                className="cravio-btn cravio-btn-outline cravio-btn-sm"
                disabled={!isAvailable}
                onClick={handleAddClick}
              >
                {isAvailable ? "Add +" : "Unavailable"}
              </button>
            ) : (
              <div
                style={{ display: "flex", alignItems: "center", gap: 8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="cravio-btn cravio-btn-secondary cravio-btn-sm"
                  style={{ padding: "4px 8px" }}
                  onClick={handleDecrement}
                >
                  −
                </button>
                <span style={{ fontWeight: 700, fontSize: 13, minWidth: 16, textAlign: "center" }}>
                  {qty}
                </span>
                <button
                  type="button"
                  className="cravio-btn cravio-btn-primary cravio-btn-sm"
                  style={{ padding: "4px 8px" }}
                  onClick={handleIncrement}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
