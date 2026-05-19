import { useState } from "react";
import { getClusters, getReport } from "./api";

function App() {
  const [query, setQuery] = useState("");
  const [clusters, setClusters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedClusters, setSelectedClusters] = useState([]);
  const [report, setReport] = useState(null);

  const handleGetClusters = async () => {
    setLoading(true);
    setClusters(null);
    setSelectedClusters([]);

    try {
      const clusters = await getClusters(query);
      setClusters(clusters);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetReport = async () => {
    setLoading(true);
    try {
      const result = await getReport(selectedClusters);
      setReport(result);
    } catch (err) {
      console.error(err);
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

      <button onClick={handleGetClusters} disabled={loading || !query}>
        {loading ? "Getting Clusters..." : "Get Clusters"}
      </button>

      {clusters && clusters.length > 0 && (
        <>
          <p style={{ marginTop: 16 }}>Choose one or more clusters:</p>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "12px 0",
            }}
          >
            {clusters.map((cluster, index) => (
              <li key={index} style={{ marginBottom: 8 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedClusters.includes(cluster)}
                    onChange={() => {
                      setSelectedClusters((prev) =>
                        prev.includes(cluster)
                          ? prev.filter((c) => c !== cluster)
                          : [...prev, cluster]
                      );
                    }}
                  />
                  <span>Cluster {index + 1}</span>
                </label>
              </li>
            ))}
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
        <pre style={{ marginTop: 20, whiteSpace: "pre-wrap" }}>
          {report}
        </pre>
      )}
    </div>
  );
}

export default App;
