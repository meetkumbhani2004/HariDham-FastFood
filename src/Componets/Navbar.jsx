import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import Logo from "../assets/logo.svg";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false); // ✅ dialog state
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Load user on mount + listen storage event
  useEffect(() => {
    const savedUser = sessionStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const handleStorageChange = () => {
      const updatedUser = sessionStorage.getItem("currentUser");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Show confirm dialog instead of direct logout
  const confirmLogout = () => {
    setOpenLogoutDialog(true);
  };

  const handleLogoutCancel = () => {
    setOpenLogoutDialog(false);
  };

  const handleLogoutConfirm = () => {
    sessionStorage.removeItem("currentUser");
    setUser(null);
    window.dispatchEvent(new Event("storage"));
    setOpenLogoutDialog(false);
    navigate("/login");
  };

  // Drawer menu (Mobile)
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ flexGrow: 1, my: 2 }}>
        <img src={Logo} alt="logo" height={"70"} width="200" />
      </Typography>

      <ul className="mobile-navigation">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/Menu">Menu</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>

        {user?.role === "admin" && (
          <li><NavLink to="/admin">Dashboard</NavLink></li>
        )}

        {user ? (
          <li className="login-btn1" onClick={confirmLogout}>Logout</li>
        ) : (
          <li className="login-btn1" onClick={() => navigate("/login")}>Login</li>
        )}
      </ul>

      <div className="drawer-user">
        <h4>{user ? `${user.firstName} ${user.lastName}` : "Guest"}</h4>
        <p>{user ? user.email : "No email"}</p>
      </div>
    </Box>
  );

  return (
    <Box>
      <AppBar component="nav" sx={{ bgcolor: "black" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          <Typography sx={{ flexGrow: 1 }}>
            <img src={Logo} alt="logo" height={"70"} width="200" />
          </Typography>

          <Typography
            sx={{
              display: { xs: "none", sm: "block" },
              mr: 2,
            }}
          >
            <h4>{user ? `${user.firstName} ${user.lastName}` : "Guest"}</h4>
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
            <ul className="navigation-menu">
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/Menu">Menu</NavLink></li>
              <li><NavLink to="/about">About</NavLink></li>
              <li><NavLink to="/contact">Contact</NavLink></li>

              {user?.role === "admin" && (
                <li><NavLink to="/admin">Dashboard</NavLink></li>
              )}

              {user ? (
                <li className="login-btn1" style={{ cursor: "pointer" }} onClick={confirmLogout}>
                  Logout
                </li>
              ) : (
                <li className="login-btn1" style={{ cursor: "pointer" }} onClick={() => navigate("/login")}>
                  Login
                </li>
              )}
            </ul>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: 230, boxSizing: "border-box" },
        }}
      >
        {drawer}
      </Drawer>

      <Toolbar />

      {/* ✅ Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={handleLogoutCancel}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out? You will need to log in again to access your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Header;
