import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart (delta can be positive or negative)
  const addToCart = (menuItem, delta = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === menuItem.id);

      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) {
          // Remove item if quantity goes 0 or below
          return prev.filter((item) => item.id !== menuItem.id);
        } else {
          return prev.map((item) =>
            item.id === menuItem.id ? { ...item, quantity: newQuantity } : item
          );
        }
      } else {
        // Only add if delta is positive
        if (delta <= 0) return prev;
        return [
          ...prev,
          {
            ...menuItem,
            quantity: delta,
            restaurantId: menuItem.restaurantId,
          },
        ];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (menuItemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== menuItemId));
  };

  // Clear cart
  const clearCart = () => setCartItems([]);

  // Update quantity directly
  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) return removeFromCart(menuItemId);
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};
