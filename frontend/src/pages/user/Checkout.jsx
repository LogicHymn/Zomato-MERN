import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

/**
 * Checkout Page
 * Route: /checkout
 * Complete order summary, item quantity adjustment, delivery address, bill summary,
 * and polished order-placed success animation.
 */
function Checkout() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState({
    house: "Flat 402, Sea Green Apartments",
    street: "14th Road, Off Turner Road",
    city: "Bandra West, Mumbai",
    state: "Maharashtra",
    pincode: "400050",
  });

  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const deliveryFee = subtotal > 0 ? 40 : 0;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + taxes;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  // Order Success Screen
  if (orderPlaced) {
    return (
      <div className="auth-page-container" style={{ minHeight: "calc(100vh - 120px)" }}>
        <div className="auth-card" style={{ textAlign: "center", padding: "48px 32px" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "var(--status-available-bg)",
              border: "2px solid var(--status-available)",
              color: "var(--status-available)",
              fontSize: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
            }}
          >
            ✓
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-light)", marginBottom: 8 }}>
            Order Placed!
          </h1>

          <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
            Your order has been successfully placed. The kitchen has received your ticket and is preparing your meal.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link to="/profile" className="cravio-btn cravio-btn-primary" style={{ padding: 12 }}>
              View Orders
            </Link>

            <Link to="/user/dashboard" className="cravio-btn cravio-btn-outline">
              Continue Browsing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="auth-page-container">
        <div className="auth-card" style={{ textAlign: "center", padding: "48px 32px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-light)", marginBottom: 8 }}>
            Your Cart is Empty
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
            Looks like you haven't added any dishes yet. Discover delicious chef creations and fill your box!
          </p>
          <Link to="/user/dashboard" className="cravio-btn cravio-btn-primary" style={{ padding: 12 }}>
            Explore Dishes Now →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page-container" style={{ maxWidth: 1000, margin: "32px auto 80px", padding: "0 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-light)" }}>
            Review Your Order
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
            Confirm delivery address, quantities, and place your order
          </p>
        </div>

        {/* Add More Items Button */}
        <Link to="/user/dashboard" className="cravio-btn cravio-btn-outline cravio-btn-sm">
          + Add More Items
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 28, alignItems: "start" }}>
        {/* Left Column: Order Items & Delivery Address */}
        <div>
          {/* Order Items Card */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "24px",
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-light)" }}>
                Your Order ({cartItems.length} items)
              </h2>
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Freshly prepared
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", divideY: "1px solid var(--border-subtle)" }}>
              {cartItems.map(({ dish, quantity }) => (
                <div
                  key={dish.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 0",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      style={{ width: 52, height: 52, borderRadius: "var(--radius-sm)", objectFit: "cover" }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-light)", fontSize: 14 }}>
                        {dish.name}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>
                        ₹{dish.price} each • {dish.restaurantName}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {/* Quantity controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-input)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: "2px 6px" }}>
                      <button
                        type="button"
                        style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 14, padding: "2px 6px" }}
                        onClick={() => updateQuantity(dish.id, quantity - 1)}
                      >
                        −
                      </button>
                      <span style={{ fontWeight: 700, minWidth: 16, textAlign: "center", fontSize: 13 }}>
                        {quantity}
                      </span>
                      <button
                        type="button"
                        style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", fontSize: 14, padding: "2px 6px" }}
                        onClick={() => updateQuantity(dish.id, quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <span style={{ fontWeight: 700, minWidth: 60, textAlign: "right", color: "var(--text-light)" }}>
                      ₹{dish.price * quantity}
                    </span>

                    <button
                      type="button"
                      title="Remove Item"
                      onClick={() => removeFromCart(dish.id)}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: 16 }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, textAlign: "right" }}>
              <Link to="/user/dashboard" style={{ color: "var(--brand-primary)", fontSize: 13, fontWeight: 600 }}>
                + Add More Items
              </Link>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              padding: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>📍</span>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-light)" }}>
                  Delivery Address
                </h2>
              </div>
              <button
                type="button"
                className="cravio-btn cravio-btn-outline cravio-btn-sm"
                onClick={() => setIsEditingAddress(!isEditingAddress)}
              >
                {isEditingAddress ? "Save Address" : "Edit Address"}
              </button>
            </div>

            {isEditingAddress ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="House / Flat / Floor"
                  value={address.house}
                  onChange={(e) => setAddress({ ...address, house: e.target.value })}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Street / Landmark"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>
                <div><strong>Home:</strong> {address.house}</div>
                <div>{address.street}</div>
                <div>{address.city}, {address.state} - {address.pincode}</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Bill Summary & Payment CTA */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            position: "sticky",
            top: 80,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-light)", marginBottom: 18 }}>
            Bill Summary
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
              <span>Item Total</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>₹{subtotal}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
              <span>Delivery Fee</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>₹{deliveryFee}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-secondary)" }}>
              <span>Taxes & Restaurant Charges (5%)</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>₹{taxes}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: 14,
                borderTop: "1px solid var(--border-subtle)",
                fontSize: 16,
                fontWeight: 800,
                color: "var(--text-light)",
              }}
            >
              <span>To Pay</span>
              <span style={{ color: "var(--brand-primary)" }}>₹{total}</span>
            </div>
          </div>

          <button
            type="button"
            className="cravio-btn cravio-btn-primary"
            style={{ width: "100%", marginTop: 24, padding: "14px 20px", fontSize: 15 }}
            onClick={handlePlaceOrder}
          >
            Place Order • ₹{total}
          </button>

          <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 12 }}>
            🔒 Safe & Secure Checkout • Free cancellations before dispatch
          </p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
