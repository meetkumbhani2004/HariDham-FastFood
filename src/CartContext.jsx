import { createContext, useContext, useState } from "react";
import { db } from "./firebase";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = async (product) => {
    const existing = cartItems.find((item) => item.id === product.id);
    let updatedCart;

    if (existing) {
      updatedCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }

    setCartItems(updatedCart);

    // 🔥 Firestore me bhi save karo agar user login hai
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (user) {
      try {
        await setDoc(
          doc(db, "carts", user.id),
          {
            userId: user.id,
            email: user.email,
            items: updatedCart,
            updatedAt: new Date(),
          },
          { merge: true }
        );
      } catch (err) {
        console.error("Error saving cart:", err);
      }
    }
  };

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, increaseQuantity, decreaseQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
