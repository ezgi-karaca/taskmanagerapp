import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar({ role, username }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/public/TickTask-Photoroom.png" alt="TickTask Logo" className="dashboard-logo"/>

      </div>
      <div className="navbar-center">
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={() => alert("Projects sayfası hazırlanıyor!")}>Projects</button>
        <button onClick={() => alert("Tasks sayfası hazırlanıyor!")}>Tasks</button>
      </div>
      <div className="navbar-right">
      <span className="user-role">
          {username.toUpperCase()}{" "}
          <span>
            [{role.toLowerCase()}]
          </span>
        </span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
