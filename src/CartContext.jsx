// src/Components/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ जब भी user बदले → cart reset/load
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("currentUser"));

    if (user) {
      // 👉 उस user के लिए cart localStorage में रखेंगे
      const savedCart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
      setCartItems(savedCart);
    } else {
      // 👉 Guest cart सिर्फ sessionStorage में रहेगा
      const guestCart = JSON.parse(sessionStorage.getItem("guestCart")) || [];
      setCartItems(guestCart);
    }
  }, []);

  const syncCart = (updatedCart) => {
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    setCartItems(updatedCart);

    if (user) {
      // user‑specific cart save localStorage में
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));
    } else {
      // guest का cart सिर्फ sessionStorage
      sessionStorage.setItem("guestCart", JSON.stringify(updatedCart));
    }
  };

  const addToCart = (product) => {
    const existing = cartItems.find((item) => item.id === product.id);
    let updatedCart;
    if (existing) {
      updatedCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }
    syncCart(updatedCart);
  };

  const increaseQuantity = (id) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );
    syncCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cartItems
      .map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity || 1) - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    syncCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    syncCart(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
    } else {
      sessionStorage.removeItem("guestCart");
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, increaseQuantity, decreaseQuantity, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
