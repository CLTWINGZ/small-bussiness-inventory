const rawBase = import.meta.env.VITE_API_URL;

// Normalize API base URL so env mistakes (missing protocol) don't break routes.
let API_BASE;
if (!rawBase || rawBase.trim() === "") {
  API_BASE = "/api"; // default for Vercel/serverless proxy
} else if (/^https?:\/\//i.test(rawBase)) {
  API_BASE = rawBase;
} else if (rawBase.startsWith("/")) {
  API_BASE = rawBase; // same-origin absolute path (e.g., "/" for Railway single service)
} else {
  API_BASE = `https://${rawBase}`; // add protocol if user set only domain
}
// ensure no trailing slash to avoid double slashes
if (API_BASE.endsWith("/")) API_BASE = API_BASE.slice(0, -1);

const getToken = () => localStorage.getItem("token");

const request = async (path, options = {}) => {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    if (res.status === 401) {
      // invalidate bad token to force fresh login
      clearToken();
    }
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
};

export const api = {
  login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  getAll: () => request("/dashboard/summary"),
  get: (resource) => request(`/${resource}`),
  create: (resource, payload) =>
    request(`/${resource}`, { method: "POST", body: JSON.stringify(payload) }),
  update: (resource, id, payload) =>
    request(`/${resource}/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  remove: (resource, id) => request(`/${resource}/${id}`, { method: "DELETE" }),
  createSale: (payload) => request("/sales", { method: "POST", body: JSON.stringify(payload) }),
  updateSale: (id, payload) => request(`/sales/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteSale: (id) => request(`/sales/${id}`, { method: "DELETE" }),
  createPurchaseOrder: (payload) =>
    request("/purchaseOrders", { method: "POST", body: JSON.stringify(payload) }),
  updatePurchaseOrderStatus: (id, status) =>
    request(`/purchaseOrders/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
  resetData: () => request("/admin/reset", { method: "POST" }),
};

export const setToken = (token) => localStorage.setItem("token", token);
export const clearToken = () => localStorage.removeItem("token");
