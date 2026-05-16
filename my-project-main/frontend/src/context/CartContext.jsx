import React, { createContext, useState, useContext, useCallback } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [toasts, setToasts] = useState([]);

  // Toast management
  const showToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // 🟢 Add item to cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      // handle both id and _id from MongoDB
      const itemId = item.id || item._id;
      const existingItem = prevCart.find(
        (cartItem) => (cartItem.id || cartItem._id) === itemId
      );

      if (existingItem) {
        // increase quantity if exists
        const updatedCart = prevCart.map((cartItem) =>
          (cartItem.id || cartItem._id) === itemId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        showToast(`${item.name} quantity updated in cart!`, "success");
        return updatedCart;
      }
      // add new item
      showToast(`${item.name} added to cart!`, "success");
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // 🟢 Update quantity
  const updateQuantity = (id, change) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.id || item._id) === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  // 🟢 Remove item
  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.find((item) => (item.id || item._id) === id);
      if (itemToRemove) {
        showToast(`${itemToRemove.name} removed from cart`, "info");
      }
      return prevCart.filter((item) => (item.id || item._id) !== id);
    });
  };

  // 🟢 Clear entire cart
  const clearCart = () => {
    setCart([]);
  };

  // 🟢 Calculate total
  const total = cart.reduce((sum, item) => {
    const priceNumber = Number(item.price.toString().replace(/[^0-9.]/g, ""));
    return sum + priceNumber * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{ 
        cart, 
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart, 
        total,
        toasts,
        removeToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
