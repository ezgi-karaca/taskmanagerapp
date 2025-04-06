import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/LoginPage.css";
import { login } from "../api/api";
import { toast } from "react-toastify";

function LoginPage({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username, password });
      localStorage.setItem("token", response.data);
      setIsAuthenticated(true);

      toast.success("🎉 Successfully logged in!");

      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error("❌ Login failed. Check your credentials.");
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
        <p className="register-link">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
