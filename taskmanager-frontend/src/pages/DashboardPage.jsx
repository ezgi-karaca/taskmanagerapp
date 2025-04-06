import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "../components/NavBar";
import ProjectsPage from "./ProjectsPage";
import TasksPage from "./TasksPage";
import "../styles/DashboardPage.css";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [taskDistributions, setTaskDistributions] = useState({});

  const COLORS = ["#7e57c2", "#ffb74d", "#66bb6a"];

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const endpoint =
        role === "MANAGER"
          ? "http://localhost:8080/api/tasks"
          : "http://localhost:8080/api/tasks/my";

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tasks = res.data;

      const groupedByEmployee = (status) => {
        return tasks
          .filter((t) => t.status === status && t.assignedTo)
          .reduce((acc, task) => {
            const user = task.assignedTo.username;
            acc[user] = (acc[user] || 0) + 1;
            return acc;
          }, {});
      };

      setStats({
        total: tasks.length,
        completed: tasks.filter((t) => t.status === "COMPLETED").length,
        inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
        pending: tasks.filter((t) => t.status === "PENDING").length,
      });

      setTaskDistributions({
        PENDING: groupedByEmployee("PENDING"), 
        IN_PROGRESS: groupedByEmployee("IN_PROGRESS"),
        COMPLETED: groupedByEmployee("COMPLETED"),
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

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

  useEffect(() => {
    if (role && activeTab === "dashboard") {
      fetchStats();
    }
  }, [role, activeTab]);

  const formatDistributionData = (distribution) => {
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  };

  const renderCharts = () => {
    if (!stats || !taskDistributions) return null;

    const pieData = [
      { name: "Completed", value: stats.completed },
      { name: "In Progress", value: stats.inProgress },
      { name: "Pending", value: stats.pending },
    ];

    const barTypes = ["PENDING", "IN_PROGRESS", "COMPLETED"];

    return (
      <>
        <div className="dashboard-charts-wrapper">
          <div className="dashboard-chart-box">
            <h3 className="chart-title">📊 Task Status (Pie)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-charts-wrapper">
          {barTypes.map((type, idx) => (
            <div className="dashboard-chart-box" key={type}>
              <h3 className="chart-title">{type} Tasks by Employee</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={formatDistributionData(taskDistributions[type])}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill={COLORS[idx % COLORS.length]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "projects":
        return <ProjectsPage role={role} />;
      case "tasks":
        return <TasksPage role={role} />;
      default:
        return (
          <div className="dashboard-container">
            <div className="summary-text">
              <p>Total Tasks: <strong>{stats?.total || 0}</strong></p>
            </div>
            {renderCharts()}
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