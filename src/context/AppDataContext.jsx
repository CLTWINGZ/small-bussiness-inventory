/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { api, setToken as persistToken, clearToken as dropToken } from "../api/client";

const AppDataContext = createContext(null);

export const AppDataProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [data, setData] = useState({
    products: [],
    customers: [],
    suppliers: [],
    purchaseOrders: [],
    sales: [],
    bills: [],
    notes: [],
    repairOrders: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authenticated = Boolean(token);

  const fetchAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [products, customers, suppliers, purchaseOrders, sales, bills, notes, repairOrders] =
        await Promise.all([
          api.get("products"),
          api.get("customers"),
          api.get("suppliers"),
          api.get("purchaseOrders"),
          api.get("sales"),
          api.get("bills"),
          api.get("notes"),
          api.get("repairOrders"),
        ]);
      setData({
        products,
        customers,
        suppliers,
        purchaseOrders,
        sales,
        bills,
        notes,
        repairOrders,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    persistToken(res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
  };

  const logout = () => {
    dropToken();
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setData({
      products: [],
      customers: [],
      suppliers: [],
      purchaseOrders: [],
      sales: [],
      bills: [],
      notes: [],
      repairOrders: [],
    });
  };

  const resetAllData = async () => {
    await api.resetData();
    await fetchAll();
  };

  // Helpers to reduce repetition for CRUD calls
  const create = async (resource, payload) => {
    const created = await api.create(resource, payload);
    setData((prev) => ({ ...prev, [resource]: [created, ...prev[resource]] }));
    return created;
  };

  const update = async (resource, id, payload) => {
    const updated = await api.update(resource, id, payload);
    setData((prev) => ({
      ...prev,
      [resource]: prev[resource].map((item) => (item.id === id ? updated : item)),
    }));
    return updated;
  };

  const remove = async (resource, id) => {
    await api.remove(resource, id);
    setData((prev) => ({
      ...prev,
      [resource]: prev[resource].filter((item) => item.id !== id),
    }));
  };

  // Specific actions
  const addProduct = (payload) => create("products", payload);
  const updateProduct = (id, payload) => update("products", id, payload);
  const deleteProduct = (id) => remove("products", id);

  const addCustomer = (payload) => create("customers", payload);
  const updateCustomer = (id, payload) => update("customers", id, payload);
  const deleteCustomer = (id) => remove("customers", id);

  const addSupplier = (payload) => create("suppliers", payload);
  const updateSupplier = (id, payload) => update("suppliers", id, payload);
  const deleteSupplier = (id) => remove("suppliers", id);

  const createSale = async (payload) => {
    const sale = await api.createSale(payload);
    // refresh products because stock changed
    const products = await api.get("products");
    setData((prev) => ({ ...prev, sales: [sale, ...prev.sales], products }));
    return { ok: true, sale };
  };
  const updateSale = (id, payload) => api.updateSale(id, payload);
  const deleteSale = async (id) => {
    await api.deleteSale(id);
    setData((prev) => ({ ...prev, sales: prev.sales.filter((s) => s.id !== id) }));
  };

  const addBill = (payload) => create("bills", payload);
  const payBill = (id, amount) => update("bills", id, { status: "Paid", paidAt: new Date().toISOString().slice(0, 10), amount });

  const addNote = (payload) => create("notes", payload);
  const deleteNote = (id) => remove("notes", id);

  const addRepairOrder = (payload) => create("repairOrders", payload);
  const updateRepairOrder = (id, payload) => update("repairOrders", id, payload);
  const deleteRepairOrder = (id) => remove("repairOrders", id);

  const createPurchaseOrder = async (payload) => {
    const po = await api.createPurchaseOrder(payload);
    setData((prev) => ({ ...prev, purchaseOrders: [po, ...prev.purchaseOrders] }));
    return po;
  };
  const updatePurchaseOrderStatus = async (id, status) => {
    const updated = await api.updatePurchaseOrderStatus(id, status);
    // refresh products if delivered
    const products = status === "Delivered" ? await api.get("products") : data.products;
    setData((prev) => ({
      ...prev,
      purchaseOrders: prev.purchaseOrders.map((po) => (po.id === id ? updated : po)),
      products,
    }));
  };
  const deletePurchaseOrder = (id) => remove("purchaseOrders", id);

  const dashboardStats = useMemo(() => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const monthSales = data.sales.filter((s) => s.date?.startsWith(monthKey));
    const monthlyRevenue = monthSales.reduce((sum, s) => sum + s.total, 0);
    const lowStockProducts = data.products.filter((p) => p.stock <= p.reorderLevel);
    return {
      productCount: data.products.length,
      customerCount: data.customers.length,
      supplierCount: data.suppliers.length,
      monthlyRevenue,
      pendingBills: data.bills.filter((b) => b.status === "Pending").length,
      pendingRepairs: data.repairOrders.filter((r) => r.status === "Pending").length,
      lowStockProducts,
      recentSales: data.sales.slice(0, 5),
      recentRepairs: data.repairOrders.slice(0, 5),
    };
  }, [data]);

  const value = {
    ...data,
    dashboardStats,
    loading,
    error,
    authenticated,
    user,
    login,
    logout,
    refresh: fetchAll,
    addProduct,
    updateProduct,
    deleteProduct,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    createSale,
    updateSale,
    deleteSale,
    addBill,
    payBill,
    addNote,
    deleteNote,
    addRepairOrder,
    updateRepairOrder,
    deleteRepairOrder,
    createPurchaseOrder,
    updatePurchaseOrderStatus,
    deletePurchaseOrder,
    resetAllData,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) throw new Error("useAppData must be used within AppDataProvider.");
  return context;
};
