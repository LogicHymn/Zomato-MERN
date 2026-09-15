import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Initialize cart from localStorage so it persists across page reloads & routes
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cravio_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Appearance state (dark / light)
  const [appearance, setAppearance] = useState(() => {
    return localStorage.getItem("cravio_theme") || "dark";
  });

  useEffect(() => {
    try {
      localStorage.setItem("cravio_cart", JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("cravio_theme", appearance);
    if (appearance === "light") {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  }, [appearance]);

  const addToCart = (dish, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => String(item.dish.id) === String(dish.id));
      if (existing) {
        return prev.map((item) =>
          String(item.dish.id) === String(dish.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { dish, quantity }];
    });
  };

  const updateQuantity = (dishId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(dishId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        String(item.dish.id) === String(dishId)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (dishId) => {
    setCartItems((prev) =>
      prev.filter((item) => String(item.dish.id) !== String(dishId))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.dish.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalCount,
        subtotal,
        appearance,
        setAppearance,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;
