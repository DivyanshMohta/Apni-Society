import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const validUsername = "Admin";
    const validPassword = "Admin";

    if (username === validUsername && password === validPassword) {
      alert("Login successful!");
      navigate("/security-dashboard"); // Redirect to the Security Dashboard
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="center-container">
      <div className="login-container">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="button1" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
