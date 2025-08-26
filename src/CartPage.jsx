// src/Components/CartPage.jsx
import React from "react";
import { useCart } from "./CartContext";
import "./cartDrawer.css";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const handleCheckout = () => {
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!user) {
      alert("Please login before checkout!");
      navigate("/login");
      return;
    }
    navigate("/checkout"); 
  };

  return (
    <div className="cart-bg">
      <div className="cart-page">
        <div className="cart-title">
          <h1 className="car-header">YOUR SHOPPING CART</h1>
          <p>Home • Your Shopping Cart</p>
        </div>

        <div className="cart-container">
          <div className="cart-left">
            {cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ITEMS</th>
                    <th>PRICE</th>
                    <th>QTY</th>
                    <th>TOTAL</th>
                    <th>REMOVE</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, idx) => (
                    <tr key={idx}>
                      <td className="product-detail">
                        <img src={item.image} alt={item.name} />
                        <span>{item.name}</span>
                      </td>
                      <td>₹{item.price}</td>
                      <td>
                        <button onClick={() => decreaseQuantity(item.id)}>-</button>
                        <span style={{ margin: "0 10px" }}>{item.quantity || 1}</span>
                        <button onClick={() => increaseQuantity(item.id)}>+</button>
                      </td>
                      <td>₹{(item.price * (item.quantity || 1)).toFixed(2)}</td>
                      <td>
                        <button onClick={() => removeItem(item.id)} className="delete-btn">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {cartItems.length > 0 && (
              <div className="cart-total">
                <p><strong>TOTAL:</strong> ₹{total.toFixed(2)}</p>
                <button onClick={() => navigate("/Menu")} className="order">
                  Continue Shopping
                </button>
                <button onClick={handleCheckout} className="order">
                  Proceed to Checkout
                </button>
                <button onClick={clearCart} className="order">
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="order-cancle">
        <strong>NOTE:</strong> Order cancel = 50% refundable
      </div>
    </div>
  );
};

export default CartPage;
