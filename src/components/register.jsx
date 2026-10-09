import { useState } from "react";
import api from "../api/api";
import AuthLayout from "../components/authlayout";

// Django returns errors like { password: ["Too short."] } — show the first one
const getErrorMessage = (error) => {
  if (!error.response) {
    return "Cannot reach the server. Is the backend running?";
  }

  const data = error.response.data;

  if (data && typeof data === "object") {
    const first = Object.values(data)[0];
    const message = Array.isArray(first) ? first[0] : first;
    if (message) return String(message);
  }

  return "Registration failed.";
};

function Register({ setShowLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      await api.post("auth/register/", {
        username: username,
        email: email,
        password: password,
      });

      setMessage("Registration successful. Please login.");

      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="auth-title">Create account</h2>
      <p className="auth-subtitle">Start tracking your income and expenses</p>

      <form className="auth-form" onSubmit={handleRegister}>
        <div className="auth-field">
          <label htmlFor="reg-username">Username</label>
          <input
            id="reg-username"
            type="text"
            placeholder="Choose a username"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {message && (
          <p className="auth-alert success" role="status">{message}</p>
        )}

        {error && (
          <p className="auth-alert error" role="alert">{error}</p>
        )}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account?{" "}
        <button type="button" onClick={() => setShowLogin(true)}>
          Login
        </button>
      </p>
    </AuthLayout>
  );
}

export default Register;