import "./Login.css";
import bgImage from "./banner.jpeg";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const adminAccount = {
      id: 999,
      firstName: "Admin",
      lastName: "Panel",
      email: "admin@test.com",
      password: "1234",
      role: "admin",
    };

    let matchedUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!matchedUser && email === adminAccount.email && password === adminAccount.password) {
      matchedUser = adminAccount;
    }

    if (matchedUser) {
      sessionStorage.setItem("currentUser", JSON.stringify(matchedUser));
      window.dispatchEvent(new Event("storage"));

      toast.success(`Welcome ${matchedUser.firstName}!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      setTimeout(() => {
        if (matchedUser.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 2000);
    } else {
      toast.error("Invalid email or password!", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div
      className="Hero"
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
      <div className="login-container">
        <h3 className="log-tit">LOGIN</h3>
        <form onSubmit={handleLogin} className="login-form">
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
            If you don't have an account, please{" "}
            <a href="/register" className="link">
              Register Here
            </a>
          </p>

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default Login;
