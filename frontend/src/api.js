const API_BASE = "http://localhost:8000";

export async function getClusters(query) {
  const response = await fetch(`${API_BASE}/research/clusters`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: query }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Research failed");
  }

  const data = await response.json();
  return data.response;
}

export async function getReport(clusters) {
  const response = await fetch(`${API_BASE}/research/report`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ clusters: clusters }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Report failed");
  }
  const data = await response.json();
  return data.response;
}