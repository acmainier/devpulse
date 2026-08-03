import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Auth() {
  const { setUser } = useAuth();
  const [mode, setMode] = useState("login");

  // Form Inputs using state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // Redirects user after succesful submit

  const isRegister = mode === "register";

  // Flips selected mode locally, no navigation involved
  const toggleMode = () => {
    setMode(isRegister ? "login" : "register");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stops broswers default form behaviour
    setError("");

    try {
      const url = isRegister
        ? "http://localhost:3001/api/auth/register"
        : "http://localhost:3001/api/auth/login";

      // Login only needs email/password, Register also sends username
      const payload = isRegister
        ? { username, email, password }
        : { email, password };

      const response = await axios.post(url, payload);

      localStorage.setItem("token", response.data.token); // Keeps user logged in
      setUser(response.data.user); // Updates context so the sidebar swaps immediately
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="form-header">{isRegister ? "Sign Up" : "Log In"}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {isRegister && (
        <div className="auth-field">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      )}

      <div className="auth-field">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="auth-field">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit">{isRegister ? "Sign Up" : "Log In"}</button>

      <p className="auth-toggle">
        {isRegister ? "Already have an account?" : "Need an account?"}{" "}
        <button type="button" onClick={toggleMode}>
          {isRegister ? "Log In" : "Sign Up"}
        </button>
      </p>
    </form>
  );
}

export default Auth;
