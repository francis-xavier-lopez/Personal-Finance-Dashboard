import { useState } from "react";
import api from "../api/api";
import AuthLayout from "../components/authlayout";

function Login({ setIsLoggedIn, setShowLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("token/", {
        username: username.trim(),
        password: password,
      });

      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);

      const status = error.response?.status;

      if (!error.response) {
        setError("Cannot reach the server. Is the backend running?");
      } else if (status === 401) {
        setError("Invalid username or password");
      } else if (status === 404) {
        setError("Login URL not found (404). Check the URL in Login.jsx.");
      } else {
        setError(`Login failed (error ${status}). Check the backend terminal.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="auth-title">Welcome back</h2>
      <p className="auth-subtitle">Log in to manage your finances</p>

      <form className="auth-form" onSubmit={handleLogin}>
        <div className="auth-field">
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            type="text"
            placeholder="Enter your username"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="auth-alert error" role="alert">{error}</p>
        )}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {setShowLogin && (
        <p className="auth-switch">
          Don't have an account?{" "}
          <button type="button" onClick={() => setShowLogin(false)}>
            Register
          </button>
        </p>
      )}
    </AuthLayout>
  );
}

export default Login;