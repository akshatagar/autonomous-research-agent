import { useState } from "react";
import { getClusters, getReport } from "./api";
import ReportDisplay from "./ReportDisplay";

function parseClusterTitle(text) {
  const titleMatch = text.match(/CLUSTER_TITLE:\s*(.+)/i);
  return titleMatch?.[1]?.trim();
}

function App() {
  const [query, setQuery] = useState("");
  const [clusters, setClusters] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedClusters, setSelectedClusters] = useState([]);
  const [report, setReport] = useState(null);

  const backButton = async () => {
    setLoading(false)
    setClusters(null)
    setReport(null)
    setSelectedClusters([])
  }

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

      {!clusters && <><textarea
        rows={4}
        style={{ width: "100%", marginBottom: 12 }}
        placeholder="Enter research question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleGetClusters} disabled={loading || !query}>
        {loading ? "Getting Clusters..." : "Get Clusters"}
      </button> </>}

      {clusters && clusters.length > 0 && (
        <>
          <button onClick={backButton}>
            Back
          </button>

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
                      backgroundColor: isSelected
                        ? "rgba(100, 108, 255, 0.08)"
                        : "transparent",
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
                    <span style={{ fontWeight: 600 }}>
                      {title || `Topic ${index + 1}`}
                    </span>
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

      {report && <ReportDisplay content={report} />}
    </div>
  );
}

export default App; 
