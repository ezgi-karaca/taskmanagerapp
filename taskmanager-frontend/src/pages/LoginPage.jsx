import React from "react";
import "../styles/LoginPage.css";

function LoginPage() {
  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Login</h2>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default LoginPage;
