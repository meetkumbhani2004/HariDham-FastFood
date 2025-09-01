// src/Components/CheckoutPage.jsx (Modified)
import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import "./checkout.css";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [step, setStep] = useState(1);
  const [upiId, setUpiId] = useState('');
  
  
  // Address State
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
    isDefault: false
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // Order State
  const [isProcessing, setIsProcessing] = useState(false);


useEffect(() => {
  const user = JSON.parse(sessionStorage.getItem("currentUser"));
  if (user) {
    const fetchCart = async () => {
      const cartRef = doc(db, "carts", user.id);
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        setCart(cartSnap.data());
      }
    };
    fetchCart();
  }
}, []);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!user) {
      navigate("/login");
      return;
    }
    setCurrentUser(user);
    
    // Load saved addresses
    const savedAddresses = JSON.parse(localStorage.getItem(`addresses_${user.id}`)) || [];
    setAddresses(savedAddresses);
    
    if (savedAddresses.length > 0) {
      const defaultAddr = savedAddresses.find(addr => addr.isDefault) || savedAddresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [navigate]);

  const total = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const deliveryFee = total > 500 ? 0 : 30;
  const tax = total * 0.05; // 5% tax
  const finalTotal = total + deliveryFee + tax;

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const addressWithId = {
      ...newAddress,
      id: Date.now(),
      userId: currentUser.id
    };
    
    const updatedAddresses = [...addresses, addressWithId];
    setAddresses(updatedAddresses);
    localStorage.setItem(`addresses_${currentUser.id}`, JSON.stringify(updatedAddresses));
    
    setSelectedAddress(addressWithId);
    setShowAddressForm(false);
    setNewAddress({
      name: '',
      phone: '',
      pincode: '',
      locality: '',
      address: '',
      city: '',
      state: '',
      landmark: '',
      isDefault: false
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const order = {
        id: `ORDER_${Date.now()}`,
        userId: currentUser.id,
        items: cartItems,
        address: selectedAddress,
        paymentMethod,
        total: finalTotal,
        status: 'pending', // Changed from 'confirmed' to 'pending'
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
      };

      // Save order
      const existingOrders = JSON.parse(localStorage.getItem(`orders_${currentUser.id}`)) || [];
      existingOrders.push(order);
      localStorage.setItem(`orders_${currentUser.id}`, JSON.stringify(existingOrders));

      clearCart();
      setIsProcessing(false);
      
      // Redirect to order waiting page instead of success page
      navigate('/order-waiting', { state: { order } });
    }, 2000);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Address</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Payment</div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Review</div>
        </div>
      </div>

      <div className="checkout-content">
        <div className="checkout-left">
          
          {/* Address Section */}
          <div className="checkout-section">
            <h2>
              <span className="step-number">1</span>
              Delivery Address
            </h2>
            
            {addresses.length > 0 && (
    <div className="address-list">
      {addresses.map((address) => (
        <div 
          key={address.id} 
          className={`address-card ${selectedAddress?.id === address.id ? 'selected' : ''}`}
        >
          <input 
            type="radio" 
            name="address" 
            checked={selectedAddress?.id === address.id}
            readOnly
            onClick={() => setSelectedAddress(address)}
          />
          <div className="address-details" onClick={() => setSelectedAddress(address)}>
            <h4>{address.name}</h4>
            <p>{address.address}, {address.locality}</p>
            <p>{address.city}, {address.state} - {address.pincode}</p>
            <p>Phone: {address.phone}</p>
            {address.landmark && <p>Landmark: {address.landmark}</p>}
          </div>
          <button 
            className="delete-address-btn"
            onClick={() => {
              const filtered = addresses.filter(a => a.id !== address.id);
              setAddresses(filtered);
              localStorage.setItem(`addresses_${currentUser.id}`, JSON.stringify(filtered));
              if (selectedAddress?.id === address.id) {
                setSelectedAddress(filtered[0] || null);
              }
            }}
          >
            🗑️ Delete
          </button>
        </div>
      ))}
    </div>
  )}

            <button 
              className="add-address-btn"
              onClick={() => setShowAddressForm(!showAddressForm)}
            >
              + Add New Address
            </button>

            {showAddressForm && (
              <form className="address-form" onSubmit={handleAddressSubmit}>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Locality"
                    value={newAddress.locality}
                    onChange={(e) => setNewAddress({...newAddress, locality: e.target.value})}
                    required
                  />
                </div>
                <textarea
                  placeholder="Address (Area and Street)"
                  value={newAddress.address}
                  onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                  required
                />
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="City/District/Town"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Landmark (Optional)"
                  value={newAddress.landmark}
                  onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                />
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                  />
                  Make this my default address
                </label>
                <div className="form-buttons">
                  <button type="submit" className="save-btn">Save Address</button>
                  <button type="button" onClick={() => setShowAddressForm(false)} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Payment Section */}
          <div className="checkout-section">
            <h2>
              <span className="step-number">2</span>
              Payment Method
            </h2>
            
            <div className="payment-options">
              <div className="payment-option">
                <input 
                  type="radio" 
                  id="cod" 
                  name="payment" 
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="cod">
                  <div className="payment-info">
                    <h4>Cash on Delivery</h4>
                    <p>Pay when your order is delivered</p>
                  </div>
                </label>
              </div>

              <div className="payment-option">
  <input 
    type="radio" 
    id="upi" 
    name="payment" 
    value="upi"
    checked={paymentMethod === 'upi'}
    onChange={(e) => {
      setPaymentMethod(e.target.value);
      setUpiId(''); // reset previous input
    }}
  />
  <label htmlFor="upi">
    <div className="payment-info">
      <h4>UPI Payment</h4>
      <p>Pay using Google Pay, PhonePe, Paytm</p>
    </div>
  </label>

  {paymentMethod === 'upi' && (
    <div className="upi-form">
      <input
        type="text"
        placeholder="Enter your UPI ID"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        required
      />
      <p className="upi-note">You must complete the UPI payment before submitting the order</p>
    </div>
  )}
</div>

              <div className="payment-option">
                <input 
                  type="radio" 
                  id="card" 
                  name="payment" 
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="card">
                  <div className="payment-info">
                    <h4>Credit/Debit Card</h4>
                    <p>Visa, MasterCard, Rupay</p>
                  </div>
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="card-form">
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  />
                  <div className="card-row">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Order Review */}
          <div className="checkout-section">
            <h2>
              <span className="step-number">3</span>
              Review Items and Delivery
            </h2>
            
            <div className="order-items">
              {cartItems.map((item, idx) => (
                <div key={idx} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity || 1}</p>
                    <p className="item-price">₹{(item.price * (item.quantity || 1)).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="delivery-info">
              <h4>Estimated Delivery: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</h4>
              <p>Your order will be delivered within 2-3 business days after approval</p>
            </div>
          </div>
        </div>

        <div className="checkout-right">
          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-line">
              <span>Items ({cartItems.length}):</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            
            <div className="summary-line">
              <span>Delivery:</span>
              <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
            </div>
            
            <div className="summary-line">
              <span>Tax (5%):</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            
            <div className="summary-line total">
              <span>Total:</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>

            {total < 500 && (
              <p className="delivery-note">Add ₹{(500 - total).toFixed(2)} more for FREE delivery</p>
            )}

            <button 
  className="place-order-btn"
  onClick={handlePlaceOrder}
  disabled={
    isProcessing || 
    !selectedAddress || 
    !paymentMethod || 
    (paymentMethod === 'upi' && upiId.trim() === '')
  }
>
  {isProcessing ? 'Processing...' : `Submit Order - ₹${finalTotal.toFixed(2)}`}
</button>


            <div className="security-info">
              <p>🔒 Your transaction is secured with SSL encryption</p>
              <p className="admin-note">📋 Order requires admin approval before confirmation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;