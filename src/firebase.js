import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, collection, addDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVcfOpPhOXVD2CFVs4hBycX8UCS6pJ19U",
  authDomain: "haridham-fastfood-111db.firebaseapp.com",
  projectId: "haridham-fastfood-111db",
  storageBucket: "haridham-fastfood-111db.firebasestorage.app",
  messagingSenderId: "337012054789",
  appId: "1:337012054789:web:f076632d1b99f9155fb56c",
  measurementId: "G-SH3VDFLSB0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

/* -----------------------------
   Firestore Helper Functions
------------------------------*/

// ➕ Add Order
export const addOrder = async (userId, addressId, orderData) => {
  try {
    const ordersRef = collection(db, "Login", userId, "Address", addressId, "Orders");
    await addDoc(ordersRef, orderData);
    console.log("✅ Order Added Successfully!");
  } catch (error) {
    console.error("❌ Error adding order:", error);
  }
};

// 📥 Get All Orders
export const getOrders = async (userId, addressId) => {
  try {
    const ordersRef = collection(db, "Login", userId, "Address", addressId, "Orders");
    const snapshot = await getDocs(ordersRef);
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return orders;
  } catch (error) {
    console.error("❌ Error getting orders:", error);
    return [];
  }
};

// ✏️ Update Order
export const updateOrder = async (userId, addressId, orderId, updatedData) => {
  try {
    const orderRef = doc(db, "Login", userId, "Address", addressId, "Orders", orderId);
    await updateDoc(orderRef, updatedData);
    console.log("✅ Order Updated!");
  } catch (error) {
    console.error("❌ Error updating order:", error);
  }
};

// 🗑 Delete Order
export const deleteOrder = async (userId, addressId, orderId) => {
  try {
    const orderRef = doc(db, "Login", userId, "Address", addressId, "Orders", orderId);
    await deleteDoc(orderRef);
    console.log("✅ Order Deleted!");
  } catch (error) {
    console.error("❌ Error deleting order:", error);
  }
};
