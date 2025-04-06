import React from "react";
import "../styles/Navbar.css";

function Navbar({ role, username, setActiveTab }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src="/TickTask-Photoroom.png"
          alt="TickTask Logo"
          className="dashboard-logo"
        />
      </div>
      <div className="navbar-center">
        <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
        <button onClick={() => setActiveTab("projects")}>Projects</button>
        <button onClick={() => setActiveTab("tasks")}>Tasks</button>
      </div>
      <div className="navbar-right">
        <span className="user-role">
          {username.toUpperCase()} <span>[{role.toLowerCase()}]</span>
        </span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
