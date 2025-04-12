import React, { useState, useEffect, useRef } from "react";
import "../styles/Navbar.css";
import NotificationPopup from "./NotificationPopup";
import API from "../api/api";

function Navbar({ role, username, setActiveTab }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    const fetchUnread = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await API.get("/notifications/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const unread = res.data.some((n) => !n.read);
        setHasUnread(unread);
      } catch (err) {
        console.error("Failed to fetch unread notifications", err);
      }
    };

    fetchUnread();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const toggleNotifications = async () => {
    const newState = !showNotifications;
    setShowNotifications(newState);
  
    if (newState) {
      try {
        const token = localStorage.getItem("token");
        await API.patch("/notifications/mark-all-read", null, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasUnread(false);
      } catch (err) {
        console.error("Failed to mark notifications as read", err);
      }
    }
  };
  

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/TickTask-Photoroom.png" alt="TickTask Logo" className="dashboard-logo" />
      </div>

      <div className="navbar-center">
        <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveTab("projects")}>Projects</button>
        <button onClick={() => setActiveTab("tasks")}>Tasks</button>
      </div>

      <div className="navbar-right" ref={containerRef}>
        <button className="notification-icon" onClick={toggleNotifications}>
          🔔
          {hasUnread && <span className="notification-dot" />}
        </button>

        <span className="user-role">
          {username.toUpperCase()} <span>[{role.toLowerCase()}]</span>
        </span>

        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>

        {showNotifications && (
          <div className="notification-popup show">
            <NotificationPopup />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
