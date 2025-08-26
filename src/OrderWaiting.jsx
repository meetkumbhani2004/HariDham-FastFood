// src/Components/OrderWaiting.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderWaiting.css";

const OrderWaiting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState('pending');
  const [checkingStatus, setCheckingStatus] = useState(false);

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
      setOrderStatus(location.state.order.status);
    } else {
      navigate("/");
    }
  }, [navigate, location.state]);

  useEffect(() => {
    if (!order || !currentUser) return;

    // Check order status every 5 seconds
    const statusInterval = setInterval(() => {
      checkOrderStatus();
    }, 5000);

    return () => clearInterval(statusInterval);
  }, [order, currentUser]);

  const checkOrderStatus = async () => {
    if (!order || !currentUser) return;

    setCheckingStatus(true);
    
    // Simulate checking status
    setTimeout(() => {
      const userOrders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`)) || [];
      const updatedOrder = userOrders.find(o => o.id === order.id);
      
      if (updatedOrder && updatedOrder.status !== orderStatus) {
        setOrderStatus(updatedOrder.status);
        setOrder(updatedOrder);
        
        if (updatedOrder.status === 'confirmed') {
  setTimeout(() => {
    navigate('/order-success', { 
      state: { order: updatedOrder, email: location.state?.email } 
    });
  }, 2000);
}

      }
      setCheckingStatus(false);
    }, 1000);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleCheckStatus = () => {
    checkOrderStatus();
  };

  if (!order || !currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-waiting-container">
      <div className="waiting-content">
        <div className="status-animation">
          {orderStatus === 'pending' && (
            <div className="pending-animation">
              <div className="clock-icon">
                <div className="clock-face">
                  <div className="clock-hand hour"></div>
                  <div className="clock-hand minute"></div>
                </div>
              </div>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          {orderStatus === 'confirmed' && (
            <div className="success-animation">
              <div className="checkmark">✓</div>
            </div>
          )}
          
          {orderStatus === 'rejected' && (
            <div className="rejected-animation">
              <div className="cross-mark">✗</div>
            </div>
          )}
        </div>

        <div className="status-message">
          {orderStatus === 'pending' && (
            <div className="pending-message">
              <h1>Order Submitted Successfully!</h1>
              <h2>Waiting for Admin Approval</h2>
              <p>Your order has been submitted and is currently under review by our team.</p>
              <p>You will be automatically redirected once your order is approved.</p>
              
              <div className="order-details-summary">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Total Amount:</strong> ₹{order.total.toFixed(2)}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}</p>
                <p><strong>Items:</strong> {order.items.length} item(s)</p>
              </div>
            </div>
          )}
          
          {orderStatus === 'confirmed' && (
            <div className="confirmed-message">
              <h1>Order Approved!</h1>
              <p>Great news! Your order has been approved by our team.</p>
              <p>Redirecting to order confirmation page...</p>
            </div>
          )}
          
          {orderStatus === 'rejected' && (
            <div className="rejected-message">
              <h1>Order Not Approved</h1>
              <p>Unfortunately, your order could not be processed at this time.</p>
              {order.rejectionReason && (
                <div className="rejection-reason">
                  <strong>Reason:</strong> {order.rejectionReason}
                </div>
              )}
              <p>Please contact our support team for more information.</p>
            </div>
          )}
        </div>

        <div className="action-buttons">
          {orderStatus === 'pending' && (
            <button 
              onClick={handleCheckStatus}
              className="check-status-btn"
              disabled={checkingStatus}
            >
              {checkingStatus ? 'Checking...' : 'Check Status'}
            </button>
          )}
          
          <button onClick={handleBackToHome} className="back-home-btn">
            Back to Home
          </button>
        </div>

        <div className="status-indicator">
          <div className="status-steps">
            <div className="step completed">
              <div className="step-icon">1</div>
              <span>Order Placed</span>
            </div>
            <div className={`step ${orderStatus !== 'pending' ? 'completed' : 'active'}`}>
              <div className="step-icon">2</div>
              <span>Admin Review</span>
            </div>
            <div className={`step ${orderStatus === 'confirmed' ? 'completed' : ''}`}>
              <div className="step-icon">3</div>
              <span>Order Confirmed</span>
            </div>
          </div>
        </div>

        {orderStatus === 'pending' && (
          <div className="waiting-info">
            <div className="info-card">
              <h4>What happens next?</h4>
              <ul>
                <li>Our team will review your order details</li>
                <li>We'll verify payment information and availability</li>
                <li>You'll receive confirmation once approved</li>
                <li>Estimated review time: 5-15 minutes</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderWaiting;




