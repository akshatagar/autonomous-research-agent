import { useState, useEffect } from "react";
import { getClusters, getReport, getReports } from "./api";
import ReportDisplay from "./ReportDisplay";
import LoginPage from "./LoginPage";

function parseClusterTitle(text) {
  const m = text.match(/CLUSTER_TITLE:\s*(.+)/i);
  return m?.[1]?.trim();
}

function Spinner() {
  return <span className="btn-spinner" aria-hidden="true" />;
}

function ReportSkeleton() {
  return (
    <div className="skeleton">
      <div className="skeleton-line skeleton-line--title" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-line--med" />
      <div className="skeleton-line skeleton-line--short" />
      <div className="skeleton-line" style={{ marginTop: 28 }} />
      <div className="skeleton-line skeleton-line--med" />
      <div className="skeleton-line" />
      <div className="skeleton-line skeleton-line--short" />
      <div className="skeleton-line" style={{ marginTop: 28 }} />
      <div className="skeleton-line skeleton-line--med" />
      <div className="skeleton-line skeleton-line--short" />
    </div>
  );
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
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (token) getReports().then(setHistory).catch(() => {});
  }, [token]);

  const handleLogin = (newToken) => setToken(newToken);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setHistory([]);
    setClusters(null);
    setReport(null);
    setSelectedClusters([]);
    setHistoryReport(null);
    setError(null);
  };

  const reset = () => {
    setLoading(false);
    setClusters(null);
    setReport(null);
    setSelectedClusters([]);
    setHistoryReport(null);
    setError(null);
  };

  const handleGetClusters = async () => {
    setError(null);
    setLoading(true);
    setClusters(null);
    setSelectedClusters([]);
    try {
      const result = await getClusters(query);
      setClusters(result);
    } catch (err) {
      setError(err.message || "Failed to find topics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetReport = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await getReport(selectedClusters, query);
      setReport(result);
      getReports().then(setHistory).catch(() => {});
    } catch (err) {
      setError(err.message || "Failed to generate report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCluster = (cluster) => {
    setSelectedClusters((prev) =>
      prev.includes(cluster) ? prev.filter((c) => c !== cluster) : [...prev, cluster]
    );
  };

  const handleCopy = () => {
    const text = report ?? historyReport?.content;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!token) return <LoginPage onLogin={handleLogin} />;

  const onLanding = !clusters && !report && !historyReport;
  const isGenerating = loading && !!clusters && !report;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <nav className="navbar">
        <span className="nav-brand">Research <em>Agent</em></span>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Log out
        </button>
      </nav>

      <main className="main">

        {/* ── History report viewer ── */}
        {historyReport && (
          <>
            <div className="report-view-header">
              <button className="btn btn-ghost" onClick={reset}>← Back</button>
              {historyReport.query && (
                <span className="report-view-query">{historyReport.query}</span>
              )}
              <button className="btn btn-ghost" style={{ marginLeft: "auto" }} onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <ReportDisplay content={historyReport.content} />
          </>
        )}

        {!historyReport && (
          <>
            {/* ── Landing: search ── */}
            {onLanding && (
              <div className="search-section">
                <h1 className="search-heading">What do you want to research?</h1>
                <p className="search-subheading">
                  Enter a question or topic and we'll find relevant sources and generate a structured report.
                </p>
                <div className="search-form">
                  <textarea
                    className="search-input"
                    rows={4}
                    placeholder="e.g. How is AI being used in drug discovery?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && query && !loading)
                        handleGetClusters();
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleGetClusters}
                    disabled={loading || !query}
                  >
                    {loading ? <><Spinner /> Finding topics</> : "Find Topics →"}
                  </button>
                  {error && <div className="form-error">{error}</div>}
                </div>
              </div>
            )}

            {/* ── Cluster selection ── */}
            {clusters && clusters.length > 0 && (
              <div className="clusters-section">
                <div className="page-back-row">
                  <button className="btn btn-ghost" onClick={reset}>← Back</button>
                  <span className="page-back-label">Select topics to include in your report</span>
                  {!isGenerating && (
                    <div className="cluster-select-actions">
                      <button
                        className="btn btn-ghost"
                        onClick={() => setSelectedClusters([...clusters])}
                      >
                        All
                      </button>
                      <button
                        className="btn btn-ghost"
                        onClick={() => setSelectedClusters([])}
                      >
                        None
                      </button>
                    </div>
                  )}
                </div>

                {isGenerating ? (
                  <ReportSkeleton />
                ) : (
                  <>
                    <div className="clusters-grid">
                      {clusters.map((cluster, i) => {
                        const title = parseClusterTitle(cluster);
                        const selected = selectedClusters.includes(cluster);
                        return (
                          <label
                            key={i}
                            className={`cluster-card${selected ? " cluster-card--selected" : ""}`}
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => toggleCluster(cluster)}
                            />
                            <span className="cluster-card__check" />
                            <span className="cluster-card__title">{title || `Topic ${i + 1}`}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="clusters-footer">
                      <button
                        className="btn btn-primary"
                        onClick={handleGetReport}
                        disabled={selectedClusters.length === 0}
                      >
                        {`Generate Report (${selectedClusters.length} selected)`}
                      </button>
                      {selectedClusters.length > 0 && (
                        <span className="clusters-selection-count">
                          {selectedClusters.length} of {clusters.length} topics
                        </span>
                      )}
                    </div>
                    {error && <div className="form-error" style={{ marginTop: 12 }}>{error}</div>}
                  </>
                )}
              </div>
            )}

            {/* ── Report view ── */}
            {report && (
              <>
                <div className="report-view-header">
                  <button className="btn btn-ghost" onClick={reset}>← Back</button>
                  {query && <span className="report-view-query">{query}</span>}
                  <button className="btn btn-ghost" style={{ marginLeft: "auto" }} onClick={handleCopy}>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <ReportDisplay content={report} />
              </>
            )}

            {/* ── History: shown on landing only ── */}
            {onLanding && history.length > 0 && (
              <div className="history-section">
                <p className="history-heading">Recent Reports</p>
                <ul className="history-list">
                  {history.map((r) => (
                    <li
                      key={r.id}
                      className="history-item"
                      onClick={() => setHistoryReport(r)}
                    >
                      <span className="history-item__query">
                        {r.query || "Untitled report"}
                      </span>
                      <div className="history-item__right">
                        <span className="history-item__date">
                          {new Date(r.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="history-item__arrow">›</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
