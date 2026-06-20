import { useState } from "react";
import { login, register } from "./api";

function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const token = mode === "login"
        ? await login(email, password)
        : await register(email, password);
      localStorage.setItem("token", token);
      onLogin(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    marginBottom: 12,
    padding: "8px 12px",
    fontSize: 14,
    borderRadius: 6,
    border: "1px solid #444",
    background: "#1a1a1a",
    color: "#fff",
    boxSizing: "border-box",
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif", maxWidth: 400, margin: "80px auto" }}>
      <h1 style={{ marginBottom: 8 }}>Autonomous Research Agent</h1>
      <h2 style={{ fontWeight: 400, marginBottom: 24, color: "#aaa" }}>
        {mode === "login" ? "Log in to your account" : "Create an account"}
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        style={inputStyle}
      />

      {error && <p style={{ color: "#ff6b6b", marginBottom: 12, fontSize: 14 }}>{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading || !email || !password}
        style={{ width: "100%", marginBottom: 12 }}
      >
        {loading ? "..." : mode === "login" ? "Log In" : "Create Account"}
      </button>

      <p style={{ textAlign: "center", color: "#888", fontSize: 14 }}>
        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
          style={{ background: "none", border: "none", color: "#646cff", cursor: "pointer", padding: 0, fontSize: 14 }}
        >
          {mode === "login" ? "Register" : "Log In"}
        </button>
      </p>
    </div>
  );
}

export default LoginPage;
