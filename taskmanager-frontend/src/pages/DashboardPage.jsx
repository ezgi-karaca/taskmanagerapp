import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/Navbar";
import "../styles/DashboardPage.css";
import ProjectsPage from "./ProjectsPage";

function DashboardPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
      setUsername(decoded.sub);
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "projects":
        return <ProjectsPage role={role} />;
      default:
        return (
          <div className="dashboard-container">
            <h1 className="dashboard-title">Welcome to the Dashboard 🎯</h1>
            <p className="dashboard-text">
              Your role is: <strong>{role}</strong>
            </p>

            {role === "MANAGER" && (
              <p className="dashboard-text">
                📊 You can manage all tasks and users.
              </p>
            )}
            {role === "EMPLOYEE" && (
              <p className="dashboard-text">
                🧑‍💻 You can view and update your own tasks.
              </p>
            )}
            {role === "ADMIN" && (
              <p className="dashboard-text">
                🛠️ You have full access to system settings.
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <>
      <Navbar role={role} username={username} setActiveTab={setActiveTab} />
      {renderTabContent()}
    </>
  );
}

export default DashboardPage;
