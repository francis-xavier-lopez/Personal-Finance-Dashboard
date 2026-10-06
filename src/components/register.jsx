import { useState } from "react";
import api from "../api/api";

function Register({ setShowLogin }) {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

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

      if (error.response?.data?.username) {
        setError(error.response.data.username[0]);
      } else {
        setError("Registration failed.");
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Register
        </button>

      </form>

      {message && <p>{message}</p>}

      {error && <p>{error}</p>}

      <button onClick={() => setShowLogin(true)}>
        Already have an account? Login
      </button>

    </div>
  );
}

export default Register;