import { useState } from "react";
import api from "../api/api";

function Login({ setIsLoggedIn }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("token/", {
        username: username,
        password: password,
      });

      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      setIsLoggedIn(true);

    } catch (error) {
      console.error(error);
      setError("Invalid username or password");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Login
        </button>

      </form>

      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;