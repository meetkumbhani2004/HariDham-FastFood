// src/Components/OrderHistory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Get all orders for current user
    const storedOrders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`)) || [];
    setOrders(storedOrders);
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="order-history">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="order-list">
          {orders.map((order, idx) => (
            <div key={idx} className="order-card">
              <h3>Order ID: {order.id}</h3>
              <p><b>Date:</b> {formatDate(order.orderDate)}</p>
              <p><b>Total:</b> ₹{order.total.toFixed(2)}</p>
              <p><b>Payment:</b> {order.paymentMethod.toUpperCase()}</p>

              <div className="order-items">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <p>{item.name}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
