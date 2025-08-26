import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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