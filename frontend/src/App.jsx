import { useState, useEffect } from "react";
import { getClusters, getReport, getReports } from "./api";
import ReportDisplay from "./ReportDisplay";
import LoginPage from "./LoginPage";

function parseClusterTitle(text) {
  const titleMatch = text.match(/CLUSTER_TITLE:\s*(.+)/i);
  return titleMatch?.[1]?.trim();
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [query, setQuery] = useState("");
  const [clusters, setClusters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedClusters, setSelectedClusters] = useState([]);
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyReport, setHistoryReport] = useState(null);

  useEffect(() => {
    if (token) {
      getReports()
        .then(setHistory)
        .catch(() => {});
    }
  }, [token]);

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setHistory([]);
    setClusters(null);
    setReport(null);
    setSelectedClusters([]);
    setHistoryReport(null);
  };

  const backButton = () => {
    setLoading(false);
    setClusters(null);
    setReport(null);
    setSelectedClusters([]);
    setHistoryReport(null);
  };

  const handleGetClusters = async () => {
    setLoading(true);
    setClusters(null);
    setSelectedClusters([]);
    try {
      const result = await getClusters(query);
      setClusters(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetReport = async () => {
    setLoading(true);
    try {
      const result = await getReport(selectedClusters, query);
      setReport(result);
      const updated = await getReports();
      setHistory(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <LoginPage onLogin={handleLogin} />;

  const onLandingPage = !clusters && !report && !historyReport;

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Autonomous Research Agent</h1>
        <button onClick={handleLogout} style={{ background: "none", border: "1px solid #444", color: "#aaa", cursor: "pointer", padding: "6px 14px", borderRadius: 6 }}>
          Log Out
        </button>
      </div>

      {/* History report view */}
      {historyReport && (
        <>
          <button onClick={backButton} style={{ marginBottom: 16 }}>Back</button>
          <p style={{ color: "#888", fontSize: 14, marginBottom: 8 }}>
            {historyReport.query} &mdash; {new Date(historyReport.created_at).toLocaleDateString()}
          </p>
          <ReportDisplay content={historyReport.content} />
        </>
      )}

      {/* Main research flow */}
      {!historyReport && (
        <>
          {onLandingPage && (
            <>
              <textarea
                rows={4}
                style={{ width: "100%", marginBottom: 12 }}
                placeholder="Enter research question..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={handleGetClusters} disabled={loading || !query}>
                {loading ? "Getting Clusters..." : "Get Clusters"}
              </button>
            </>
          )}

          {clusters && clusters.length > 0 && (
            <>
              <button onClick={backButton}>Back</button>
              <p style={{ marginTop: 16 }}>
                Select the topics you want included in your report:
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: "0 auto",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, 300px 300px)",
                  marginBottom: 50,
                  gap: 35,
                }}
              >
                {clusters.map((cluster, index) => {
                  const title = parseClusterTitle(cluster);
                  const isSelected = selectedClusters.includes(cluster);
                  return (
                    <li key={index}>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          height: "100%",
                          padding: 12,
                          border: `1px solid ${isSelected ? "#646cff" : "#444"}`,
                          borderRadius: 8,
                          backgroundColor: isSelected ? "rgba(100, 108, 255, 0.08)" : "transparent",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setSelectedClusters((prev) =>
                              prev.includes(cluster)
                                ? prev.filter((c) => c !== cluster)
                                : [...prev, cluster]
                            );
                          }}
                        />
                        <span style={{ fontWeight: 600 }}>{title || `Topic ${index + 1}`}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={handleGetReport}
                disabled={loading || selectedClusters.length === 0}
                style={{ marginTop: 8 }}
              >
                {loading ? "Getting Report..." : "Get Report"}
              </button>
            </>
          )}

          {report && (
            <>
              <button onClick={backButton}>Back</button>
              <ReportDisplay content={report} />
            </>
          )}

          {/* Past reports — only on landing page */}
          {onLandingPage && history.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <h2 style={{ fontSize: 18, marginBottom: 16 }}>Past Reports</h2>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {history.map((r) => (
                  <li
                    key={r.id}
                    onClick={() => setHistoryReport(r)}
                    style={{
                      padding: "12px 16px",
                      border: "1px solid #333",
                      borderRadius: 8,
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#646cff")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#333")}
                  >
                    <span style={{ fontWeight: 500 }}>{r.query || "Report"}</span>
                    <span style={{ color: "#888", fontSize: 13 }}>
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
