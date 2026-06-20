const API_BASE = "http://localhost:8000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export async function login(email, password) {
  const data = await handleResponse(
    await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
  );
  return data.access_token;
}

export async function register(email, password) {
  const data = await handleResponse(
    await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
  );
  return data.access_token;
}

export async function getClusters(query) {
  const data = await handleResponse(
    await fetch(`${API_BASE}/research/clusters`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ query }),
    })
  );
  return data.response;
}

export async function getReport(clusters, query) {
  const data = await handleResponse(
    await fetch(`${API_BASE}/research/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ clusters, query }),
    })
  );
  return data.response;
}

export async function getReports() {
  const data = await handleResponse(
    await fetch(`${API_BASE}/research/reports`, {
      headers: authHeaders(),
    })
  );
  return data;
}
