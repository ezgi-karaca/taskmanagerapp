import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardPage.css";

function DashboardPage({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome to the Dashboard 🎯</h1>
      <p className="dashboard-text">You have successfully logged in!</p>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default DashboardPage;
