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

  const switchMode = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setError(null);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <p className="login-brand">Research <em>Agent</em></p>
        <p className="login-tagline">AI-powered research reports in minutes.</p>
        <hr className="login-divider" />

        <p className="login-form-title">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </p>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="form-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && email && password && !loading && handleSubmit()}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <button
          className="btn btn-primary"
          style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
          onClick={handleSubmit}
          disabled={loading || !email || !password}
        >
          {loading
            ? <span className="loading-pulse">Please wait…</span>
            : mode === "login" ? "Log In" : "Create Account"}
        </button>

        <div className="login-toggle">
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          <button onClick={switchMode}>
            {mode === "login" ? "Register" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
