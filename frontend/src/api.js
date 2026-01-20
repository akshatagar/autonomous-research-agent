const API_BASE = "http://localhost:8000";

export async function runResearch(query) {
  const response = await fetch(`${API_BASE}/research`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Research failed");
  }

  return response.json();
}
