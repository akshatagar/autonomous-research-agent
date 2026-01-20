import { useState } from "react";
import { runResearch } from "./api";

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await runResearch(query);
      setResult(data.response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>Autonomous Research Agent</h1>

      <textarea
        rows={4}
        style={{ width: "100%", marginBottom: 12 }}
        placeholder="Enter research question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleRun} disabled={loading || !query}>
        {loading ? "Running Research..." : "Run Research"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <pre style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
          {result}
        </pre>
      )}
    </div>
  );
}

export default App;
