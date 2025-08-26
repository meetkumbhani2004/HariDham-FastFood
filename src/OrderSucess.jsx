// src/Components/OrderSuccess.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Oredersucess.css";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [order, setOrder] = useState(null);



  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!user) {
      navigate("/login");
      return;
    }
    setCurrentUser(user);

    // Get order from location state
    if (location.state?.order) {
      setOrder(location.state.order);
    } else {
      navigate("/");
    }
  }, [navigate, location.state]);

  const handleContinueShopping = () => {
    navigate("/menu");
  };

  const handleViewOrders = () => {
    navigate("/");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!order || !currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-success-container">
      <div className="success-content">
        <div className="success-header">
          <div className="success-animation">
            <div className="checkmark-circle">
              <div className="checkmark">✓</div>
            </div>
            <div className="confetti">
              <div className="confetti-piece"></div>
              <div className="confetti-piece"></div>
              <div className="confetti-piece"></div>
              <div className="confetti-piece"></div>
              <div className="confetti-piece"></div>
              <div className="confetti-piece"></div>
            </div>
          </div>
          
          <h1>Order Confirmed!</h1>
          <p className="success-message">
            🎉 Great news! Your order has been approved and confirmed by our team.
          </p>
          <p className="order-id">Order ID: <strong>{order.id}</strong></p>
        </div>

        <div className="order-timeline">
          <div className="timeline-item completed">
            <div className="timeline-icon">📝</div>
            <div className="timeline-content">
              <h4>Order Placed</h4>
              <p>{formatDate(order.orderDate)}</p>
            </div>
          </div>
          
          <div className="timeline-item completed">
            <div className="timeline-icon">👨‍💼</div>
            <div className="timeline-content">
              <h4>Admin Approved</h4>
              <p>{formatDate(order.approvedDate || order.orderDate)}</p>
            </div>
          </div>
          
          <div className="timeline-item active">
            <div className="timeline-icon">📦</div>
            <div className="timeline-content">
              <h4>Preparing Order</h4>
              <p>In Progress</p>
            </div>
          </div>
          
          <div className="timeline-item">
            <div className="timeline-icon">🚚</div>
            <div className="timeline-content">
              <h4>Out for Delivery</h4>
              <p>Expected: {order.estimatedDelivery}</p>
            </div>
          </div>
        </div>

        <div className="order-summary-card">
          <h3>Order Summary</h3>
          
          <div className="order-items">
            {order.items.map((item, idx) => (
              <div key={idx} className="order-item">
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity || 1}</p>
                  <p className="item-price">₹{(item.price * (item.quantity || 1)).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-total">
            <div className="total-line">
              <span>Total Amount:</span>
              <span className="total-amount">₹{order.total.toFixed(2)}</span>
            </div>
            <div className="payment-method">
              <span>Payment Method:</span>
              <span>{order.paymentMethod.toUpperCase()}</span>
            </div>
          </div>
        </div>

        <div className="delivery-details">
          <h3>Delivery Address</h3>
          <div className="address-card1">
            <h4>{order.address.name}</h4>
            <p>{order.address.address}</p>
            <p>{order.address.locality}</p>
            <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
            <p>Phone: {order.address.phone}</p>
            {order.address.landmark && <p>Landmark: {order.address.landmark}</p>}
          </div>
        </div>

        <div className="delivery-info">
          <div className="info-box">
            <div className="info-item">
              <span className="info-icon">📅</span>
              <div>
                <h4>Expected Delivery</h4>
                <p>{order.estimatedDelivery}</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">⏰</span>
              <div>
                <h4>Delivery Time</h4>
                <p>10 AM - 8 PM</p>
              </div>
            </div>
            <div className="info-item">
              <span className="info-icon">📱</span>
              <div>
                <h4>Track Your Order</h4>
                <p>SMS & Email updates</p>
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={handleContinueShopping} className="continue-btn">
            Continue Shopping
          </button>
          <button onClick={handleViewOrders} className="orders-btn">
            View All Orders
          </button>
        </div>

        <div className="additional-info">
          <div className="info-card">
            <h4>What's Next?</h4>
            <ul>
              <li>You'll receive order confirmation via email/SMS</li>
              <li>We'll notify you when your order is out for delivery</li>
              <li>Keep your phone handy for delivery updates</li>
              <li>Cash on Delivery: Keep exact change ready</li>
            </ul>
          </div>
          
          <div className="support-info">
            <h4>Need Help?</h4>
            <p>Contact our customer support for any queries about your order.</p>
            <p>📞 Customer Care: 1800-123-4567</p>
            <p>📧 Email: support@yourstore.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;