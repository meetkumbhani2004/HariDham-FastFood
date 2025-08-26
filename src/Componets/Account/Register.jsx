// src/Components/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import bgImage from "./banner.jpeg";

// ✅ Toastify imports
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const alreadyExist = users.find((u) => u.email === email);
    if (alreadyExist) {
      toast.error("This email is already registered. Please login.", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
      });

      setTimeout(() => navigate("/login"), 2500);
      return;
    }

    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      password,
      role: "user",
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    toast.success("Registration successful! Please login.", {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });

    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <div
      className="register-page"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        alignItems: "left",
        justifyContent: "left",
        textAlign: "center",
      }}
    >
      <div className="register-container">
        <h3 className="reg-title">REGISTER</h3>
        <form onSubmit={handleRegister} className="register-form">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <p className="acc">
            Already have an account?{" "}
            <a href="/login" className="link">
              Login here
            </a>
          </p>

          <button className="register-btn" type="submit">
            Register
          </button>
        </form>
      </div>

      {/* ✅ Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Register;
