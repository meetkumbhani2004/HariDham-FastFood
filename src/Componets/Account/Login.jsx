// src/Components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import bgImage from "./banner.jpeg";

// ✅ Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Google OAuth
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ----------------- Local Login -----------------
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

  // Check admin credentials if no regular user matched
  if (!matchedUser && email === adminAccount.email && password === adminAccount.password) {
    matchedUser = adminAccount;
  }

  if (matchedUser) {
    sessionStorage.setItem("currentUser", JSON.stringify(matchedUser));
    window.dispatchEvent(new Event("storage"));

    console.log("Logged in user:", matchedUser.id, matchedUser.email); // ✅

    toast.success(`Welcome ${matchedUser.firstName}!`, {
      position: "top-right",
      autoClose: 2000,
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
      theme: "colored",
    });
  }
};


  // ----------------- Google Login -----------------
  // ----------------- Google Login -----------------
const handleGoogleSuccess = (credentialResponse) => {
  try {
    const token = credentialResponse.credential;
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userEmail = payload.email;
    const name = payload.name || payload.given_name;

    const googleUser = {
      id: Date.now(),
      firstName: name,
      lastName: "",
      email: userEmail,
      role: "user",
    };

    // ✅ Users list me bhi add karo
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find((u) => u.email === userEmail);

    if (!exists) {
      users.push(googleUser);
      localStorage.setItem("users", JSON.stringify(users));
    } else {
      // agar user pehle se hai, wahi user object use karo
      googleUser.id = exists.id;
    }

    // ✅ Current user session set
    sessionStorage.setItem("currentUser", JSON.stringify(googleUser));
    window.dispatchEvent(new Event("storage"));

    toast.success(`Welcome ${name}! (Google Login)`, {
      position: "top-right",
      autoClose: 2000,
      theme: "colored",
    });

    setTimeout(() => {
      navigate("/");
    }, 2000);
  } catch (err) {
    toast.error("Google login failed!", {
      position: "top-right",
      autoClose: 2500,
      theme: "colored",
    });
  }
};


  return (
    <GoogleOAuthProvider clientId="110529769323-cut47n5dmq44pkjltajc2qnjf5r9bupt.apps.googleusercontent.com">
      <div
        className="Hero"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
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

          {/* Google Login Button */}
          <div style={{ marginTop: "20px" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                toast.error("Google login failed!", {
                  position: "top-right",
                  autoClose: 2500,
                  theme: "colored",
                })
              }
            />
          </div>
        </div>

        {/* Toast container */}
        <ToastContainer />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
