const API_URL = import.meta.env.VITE_API_URL || "/api";

const getToken = () => localStorage.getItem("token");

const request = async (path, options = {}) => {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
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
