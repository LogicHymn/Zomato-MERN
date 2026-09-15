import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

/**
 * CartBar component
 * Persistent bottom action drawer shown when the cart has items
 */
function CartBar() {
  const { totalCount, subtotal } = useCart();

  if (totalCount === 0) return null;

  return (
    <div className="cravio-cart-bar-container">
      <div className="cravio-cart-bar">
        <div className="cart-bar-left">
          <div className="cart-bar-badge">{totalCount} {totalCount === 1 ? "item" : "items"} added</div>
          <div className="cart-bar-subtotal">₹{subtotal} <span className="cart-bar-subtext">plus taxes</span></div>
        </div>

        <Link to="/checkout" className="cravio-btn cravio-btn-primary cart-bar-btn">
          <span>Continue to Checkout</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

export default CartBar;
