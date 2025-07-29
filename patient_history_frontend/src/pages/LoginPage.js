import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/patientApi";
import { useAuth } from "../hooks/useAuth";

// PUBLIC_INTERFACE
function LoginPage() {
  /** Entry/login page for user authentication */
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token } = await loginUser({ email, password });
      login(token);
      navigate("/", { replace: true });
    } catch (err) {
      setError("Invalid credentials or server error.");
      setLoading(false);
    }
  }

  return (
    <div className="content" style={{ maxWidth: 390, margin: "80px auto" }}>
      <h2 style={{ color: "var(--primary)", marginBottom: 22 }}>Patient History Login</h2>
      <form onSubmit={handleSubmit} style={{}}>
        <label htmlFor="email">Email</label>
        <input required value={email} type="email" id="email"
          onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input required value={password} type="password" id="password"
          onChange={(e) => setPassword(e.target.value)} />
        <button className="btn" style={{ width: "100%", marginTop: 18 }} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div style={{ color: "#c91d1d", marginTop: 12 }}>{error}</div>}
      </form>
    </div>
  );
}

export default LoginPage;
