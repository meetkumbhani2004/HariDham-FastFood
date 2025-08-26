// src/Components/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashbord.css";

const AdminDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); 
  const [selectedOrder, setSelectedOrder] = useState(null);// date filter

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    setCurrentUser(user);
    loadOrders();

    // ✅ Auto reload on localStorage change
    const handleStorageChange = () => {
      loadOrders();
    };
    window.addEventListener("storage", handleStorageChange);

    // ✅ Polling (backup in case storage event doesn't fire in same tab)
    const interval = setInterval(loadOrders, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [navigate]);

  const loadOrders = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    let allUserOrders = [];

    users.forEach((user) => {
      const userOrders =
        JSON.parse(localStorage.getItem(`orders_${user.id}`)) || [];
      allUserOrders = [...allUserOrders, ...userOrders];
    });

    const pending = allUserOrders.filter(
      (order) => order.status === "pending"
    );
    const all = allUserOrders;

    setPendingOrders(pending);
    setAllOrders(all);
  };

  const handleApproveOrder = (orderId) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    users.forEach((user) => {
      const userOrders =
        JSON.parse(localStorage.getItem(`orders_${user.id}`)) || [];
      const orderIndex = userOrders.findIndex((order) => order.id === orderId);

      if (orderIndex !== -1) {
        userOrders[orderIndex].status = "confirmed";
        userOrders[orderIndex].approvedDate = new Date().toISOString();
        localStorage.setItem(
          `orders_${user.id}`,
          JSON.stringify(userOrders)
        );
      }
    });

    loadOrders();
    alert("Order approved successfully!");
  };

  const handleRejectOrder = (orderId) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    const users = JSON.parse(localStorage.getItem("users")) || [];

    users.forEach((user) => {
      const userOrders =
        JSON.parse(localStorage.getItem(`orders_${user.id}`)) || [];
      const orderIndex = userOrders.findIndex((order) => order.id === orderId);

      if (orderIndex !== -1) {
        userOrders[orderIndex].status = "rejected";
        userOrders[orderIndex].rejectionReason = reason;
        userOrders[orderIndex].rejectedDate = new Date().toISOString();
        localStorage.setItem(
          `orders_${user.id}`,
          JSON.stringify(userOrders)
        );
      }
    });

    loadOrders();
    alert("Order rejected successfully!");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    navigate("/login");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === allOrders.length) {
      setSelectedOrders([]);
    } else {
      const allOrderIds = allOrders.map((order) => order.id);
      setSelectedOrders(allOrderIds);
    }
  };

  // ✅ Calculate Payments Summary with Date filter
  const getPaymentsSummary = () => {
    const confirmedOrders = allOrders.filter(
      (order) => order.status === "confirmed"
    );

    const today = new Date().toISOString().slice(0, 10);

    // agar user date select kare toh wahi use hoga, warna today
    const targetDate = selectedDate || today;

    const filteredOrders = confirmedOrders.filter(
      (order) => order.approvedDate?.slice(0, 10) === targetDate
    );

    const dateTotal = filteredOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    const overallTotal = confirmedOrders.reduce(
      (sum, order) => sum + order.total,
      0
    );

    return {
      dateTotal,
      overallTotal,
      filteredOrders,
      targetDate,
    };
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const { dateTotal, overallTotal, filteredOrders, targetDate } =
    getPaymentsSummary();


      // ✅ Modal Component
  const OrderDetailModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-btn" onClick={onClose}>X</button>
          <h2>Order #{order.id} Details</h2>

          <div className="order-info">
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
            <p><strong>Total:</strong> ₹{order.total.toFixed(2)}</p>
            {order.approvedDate && <p><strong>Approved:</strong> {formatDate(order.approvedDate)}</p>}
            {order.rejectedDate && <p><strong>Rejected:</strong> {formatDate(order.rejectedDate)}</p>}
            {order.rejectionReason && <p><strong>Reason:</strong> {order.rejectionReason}</p>}
          </div>

          <h3>Customer Details</h3>
          <p><strong>Name:</strong> {order.address.name}</p>
          <p><strong>Phone:</strong> {order.address.phone}</p>
          <p>
            <strong>Address:</strong> {order.address.address}, {order.address.locality}, {order.address.city}, {order.address.state} - {order.address.pincode}
          </p>
          {order.address.landmark && <p><strong>Landmark:</strong> {order.address.landmark}</p>}

          <h3>Items Ordered</h3>
          {order.items.map((item, idx) => (
            <div key={idx} className="item-row">
              <img src={item.image} alt={item.name} className="item-image"/>
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-quantity">Qty: {item.quantity || 1}</span>
                <span className="item-price">₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
    

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-user-info">
          <span>Welcome, {currentUser.firstName}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Orders ({pendingOrders.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Orders ({allOrders.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            Payments
          </button>
        </div>

        <div className="orders-container">
          {/* --- Pending Orders --- */}
          {activeTab === "pending" && (
            <div className="pending-orders">
              <h2>Pending Orders</h2>
              {pendingOrders.length === 0 ? (
                <p className="no-orders">No pending orders</p>
              ) : (
                pendingOrders.map((order) => (
                  <div key={order.id} className="order-card pending">
                    <div className="order-header">
                      <h3>Order #{order.id}</h3>
                      <span className="order-status pending">
                        Pending Approval
                      </span>
                    </div>
                    <div className="order-details">
                      <div className="order-info">
                        <p>
                          <strong>Order Date:</strong>{" "}
                          {formatDate(order.orderDate)}
                        </p>
                        <p>
                          <strong>Total Amount:</strong> ₹
                          {order.total.toFixed(2)}
                        </p>
                        <p>
                          <strong>Payment Method:</strong>{" "}
                          {order.paymentMethod.toUpperCase()}
                        </p>
                      </div>

                      <div className="customer-info">
                        <h4>Customer Details</h4>
                        <p>
                          <strong>Name:</strong> {order.address.name}
                        </p>
                        <p>
                          <strong>Phone:</strong> {order.address.phone}
                        </p>
                        <p>
                          <strong>Address:</strong> {order.address.address},{" "}
                          {order.address.locality}, {order.address.city},{" "}
                          {order.address.state} - {order.address.pincode}
                        </p>
                        {order.address.landmark && (
                          <p>
                            <strong>Landmark:</strong>{" "}
                            {order.address.landmark}
                          </p>
                        )}
                      </div>

                      <div className="order-items">
                        <h4>Items Ordered</h4>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="item-row">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="item-image"
                            />
                            <div className="item-details">
                              <span className="item-name">{item.name}</span>
                              <span className="item-quantity">
                                Qty: {item.quantity || 1}
                              </span>
                              <span className="item-price">
                                ₹
                                {(
                                  item.price * (item.quantity || 1)
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="order-actions">
                      <button
                        onClick={() => handleApproveOrder(order.id)}
                        className="approve-btn"
                      >
                        Approve Order
                      </button>
                      <button
                        onClick={() => handleRejectOrder(order.id)}
                        className="reject-btn"
                      >
                        Reject Order
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

         {/* --- All Orders --- */}
          {activeTab === "all" && (
            <div className="all-orders">
              <h2>All Orders</h2>
              {allOrders.length > 0 && (
                <div className="all-orders-actions">
                  <button
                    className="select-all-btn"
                    onClick={toggleSelectAll}
                  >
                    {selectedOrders.length === allOrders.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>

                  {selectedOrders.length > 0 && (
                    <button
                      className="delete-selected-btn"
                      onClick={() => {
                        if (
                          !window.confirm(
                            "Are you sure you want to delete selected orders?"
                          )
                        )
                          return;

                        const users =
                          JSON.parse(localStorage.getItem("users")) || [];
                        users.forEach((user) => {
                          let userOrders =
                            JSON.parse(
                              localStorage.getItem(`orders_${user.id}`)
                            ) || [];
                          userOrders = userOrders.filter(
                            (order) => !selectedOrders.includes(order.id)
                          );
                          localStorage.setItem(
                            `orders_${user.id}`,
                            JSON.stringify(userOrders)
                          );
                        });

                        setSelectedOrders([]);
                        loadOrders();
                      }}
                    >
                      Delete Selected ({selectedOrders.length})
                    </button>
                  )}
                </div>
              )}

              {allOrders.length === 0 ? (
                <p className="no-orders">No orders found</p>
              ) : (
                allOrders.map((order) => (
                 <div
              key={order.id}
              className={`order-card ${order.status}`}
              onClick={() => setSelectedOrder(order)} // ✅ click pe modal open
              style={{ cursor: "pointer" }}
            >
                    <div className="order-header">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrders([
                              ...selectedOrders,
                              order.id,
                            ]);
                          } else {
                            setSelectedOrders(
                              selectedOrders.filter((id) => id !== order.id)
                            );
                          }
                        }}
                        style={{ marginRight: "10px" }}
                      />
                      <h3>Order #{order.id}</h3>
                      <span className={`order-status ${order.status}`}>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                    

                    <div className="order-summary">
                      <p>
                        <strong>Date:</strong>{" "}
                        {formatDate(order.orderDate)}
                      </p>
                      <p>
                        <strong>Amount:</strong> ₹{order.total.toFixed(2)}
                      </p>
                      <p>
                        <strong>Customer:</strong> {order.address.name}
                      </p>
                      <p>
                        <strong>Items:</strong> {order.items.length}
                      </p>
                      
                      {order.status === "confirmed" &&
                        order.approvedDate && (
                          <p>
                            <strong>Approved:</strong>{" "}
                            {formatDate(order.approvedDate)}
                          </p>
                        )}
                      {order.status === "rejected" && (
                        <div>
                          <p>
                            <strong>Rejected:</strong>{" "}
                            {formatDate(order.rejectedDate)}
                          </p>
                          <p>
                            <strong>Reason:</strong>{" "}
                            {order.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
             
            </div>
          )}

          {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
           

          {/* --- Payments Summary --- */}
          {activeTab === "payments" && (
            <div className="payments-summary">
              <h2>Payments Summary</h2>

              {/* Date filter */}
              <div className="date-filter">
                <label>
                  Select Date:{" "}
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </label>
              </div>

              <div className="payment-totals">
                <p>
                  <strong>{selectedDate ? "Selected Date" : "Today"} Total:</strong>{" "}
                  ₹{dateTotal.toFixed(2)}
                </p>
                <p>
                  <strong>All Time Total:</strong> ₹{overallTotal.toFixed(2)}
                </p>
              </div>

              <h3>
                Confirmed Orders on {selectedDate || "Today"} (
                {filteredOrders.length})
              </h3>
              {filteredOrders.length === 0 ? (
                <p>No confirmed orders found</p>
              ) : (
                filteredOrders.map((order) => (
                  <div key={order.id} className="order-card confirmed">
                    <div className="order-header">
                      <h3>Order #{order.id}</h3>
                      <span className="order-status confirmed">
                        Confirmed
                      </span>
                    </div>
                    <div className="order-summary">
                      <p>
                        <strong>Date:</strong>{" "}
                        {formatDate(order.approvedDate)}
                      </p>
                      <p>
                        <strong>Amount:</strong> ₹{order.total.toFixed(2)}
                      </p>
                      <p>
                        <strong>Customer:</strong> {order.address.name}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
