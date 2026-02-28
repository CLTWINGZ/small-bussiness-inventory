/* global process */
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import seedData from "./seedData.js"; // ✅ correct

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, "data.json");
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Define writeData BEFORE readData (fixes ReferenceError -> 500)
const writeData = (data) => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
};

const readData = () => {
  // Ensure data.json exists
  if (!fs.existsSync(DATA_PATH)) {
    writeData(seedData);
  }

  const raw = fs.readFileSync(DATA_PATH, "utf-8");

  // ✅ Guard against corrupted/empty JSON
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = seedData;
    writeData(parsed);
  }

  // Ensure critical collections exist (for users migrating from older data.json)
  const withDefaults = {
    users: parsed.users && Array.isArray(parsed.users) ? parsed.users : seedData.users,
    products: Array.isArray(parsed.products) ? parsed.products : [],
    customers: Array.isArray(parsed.customers) ? parsed.customers : [],
    suppliers: Array.isArray(parsed.suppliers) ? parsed.suppliers : [],
    purchaseOrders: Array.isArray(parsed.purchaseOrders) ? parsed.purchaseOrders : [],
    sales: Array.isArray(parsed.sales) ? parsed.sales : [],
    bills: Array.isArray(parsed.bills) ? parsed.bills : [],
    notes: Array.isArray(parsed.notes) ? parsed.notes : [],
    repairOrders: Array.isArray(parsed.repairOrders) ? parsed.repairOrders : [],
  };

  // Persist repaired structure so subsequent reads are stable
  const needsPersist =
    !parsed.users ||
    !Array.isArray(parsed.users) ||
    !Array.isArray(parsed.products) ||
    !Array.isArray(parsed.customers) ||
    !Array.isArray(parsed.suppliers) ||
    !Array.isArray(parsed.purchaseOrders) ||
    !Array.isArray(parsed.sales) ||
    !Array.isArray(parsed.bills) ||
    !Array.isArray(parsed.notes) ||
    !Array.isArray(parsed.repairOrders);

  if (needsPersist) {
    writeData(withDefaults);
  }

  return withDefaults;
};

const createToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "8h",
  });

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// --- Auth ---
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  let data = readData();
  // If somehow users array vanished, reseed to avoid 500s
  if (!Array.isArray(data.users) || data.users.length === 0) {
    writeData(seedData);
    data = readData();
  }

  const user = data.users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = bcrypt.compareSync(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  return res.json({
    token: createToken(user),
    user: { id: user.id, email: user.email, role: user.role },
  });
});

// --- Protected routes helper ---
const buildCrud = (key, beforeCreate = null, afterUpdate = null) => {
  app.get(`/${key}`, authMiddleware, (req, res) => {
    const data = readData();
    res.json(data[key]);
  });

  app.post(`/${key}`, authMiddleware, (req, res) => {
    const data = readData();
    let item = { id: uuid(), ...req.body };

    if (beforeCreate) {
      const error = beforeCreate(item, data);
      if (error) return res.status(400).json({ message: error });
    }

    data[key].unshift(item);
    writeData(data);
    res.status(201).json(item);
  });

  app.put(`/${key}/:id`, authMiddleware, (req, res) => {
    const data = readData();
    const idx = data[key].findIndex((item) => item.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: "Not found" });

    data[key][idx] = { ...data[key][idx], ...req.body };

    if (afterUpdate) afterUpdate(data[key][idx], data);

    writeData(data);
    res.json(data[key][idx]);
  });

  app.delete(`/${key}/:id`, authMiddleware, (req, res) => {
    const data = readData();
    const exists = data[key].some((item) => item.id === req.params.id);
    if (!exists) return res.status(404).json({ message: "Not found" });

    data[key] = data[key].filter((item) => item.id !== req.params.id);
    writeData(data);
    res.status(204).end();
  });
};

// Reset data
app.post("/admin/reset", authMiddleware, (req, res) => {
  const data = readData();
  const isAdmin = data.users.some((u) => u.id === req.user.sub && u.role === "admin");
  if (!isAdmin) return res.status(403).json({ message: "Forbidden" });

  writeData(seedData);
  res.json({ ok: true });
});

// Products with optional supplier linkage
buildCrud("products");

// Customers
buildCrud("customers");

// Suppliers
buildCrud("suppliers");

// Purchase Orders: on status Delivered apply stock once.
buildCrud(
  "purchaseOrders",
  (po, data) => {
    if (po.productId) {
      const product = data.products.find((p) => p.id === po.productId);
      if (!product) return "Product not found for linked purchase order.";
      po.itemName = product.name;
    }
    po.quantity = Number(po.quantity || 0);
    po.unitCost = Number(po.unitCost || 0);
    po.totalCost = Number((po.quantity * po.unitCost).toFixed(2));
    po.status = po.status || "Ordered";
    po.stockApplied = false;
    return null;
  },
  (po, data) => {
    if (po.status === "Delivered" && po.productId && !po.stockApplied) {
      const product = data.products.find((p) => p.id === po.productId);
      if (product) {
        product.stock = Number(product.stock || 0) + Number(po.quantity || 0);
        po.stockApplied = true;
      }
    }
  }
);

// Bills
buildCrud("bills");

// Notes
buildCrud("notes");

// Repair Orders
buildCrud("repairOrders");

// Sales: create adjusts product stock and totals
app.get("/sales", authMiddleware, (req, res) => {
  const data = readData();
  res.json(data.sales);
});

app.post("/sales", authMiddleware, (req, res) => {
  const { customerId, productId, quantity, paymentStatus } = req.body;
  const data = readData();

  const customer = data.customers.find((c) => c.id === customerId);
  const product = data.products.find((p) => p.id === productId);
  if (!customer || !product)
    return res.status(400).json({ message: "Customer or product not found" });

  const qty = Number(quantity);
  if (!Number.isFinite(qty) || qty <= 0)
    return res.status(400).json({ message: "Invalid quantity" });

  const stock = Number(product.stock || 0);
  if (stock < qty) return res.status(400).json({ message: "Insufficient stock" });

  const unitPrice = Number(product.unitPrice || 0);
  const subtotal = Number((unitPrice * qty).toFixed(2));
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const sale = {
    id: uuid(),
    date: new Date().toISOString().slice(0, 10),
    customerId: customer.id,
    customerName: customer.name,
    items: [
      {
        productId: product.id,
        productName: product.name,
        quantity: qty,
        unitPrice,
        lineTotal: subtotal,
      },
    ],
    subtotal,
    tax,
    total,
    paymentStatus: paymentStatus || "Paid",
  };

  product.stock = stock - qty;

  data.sales.unshift(sale);
  writeData(data);
  res.status(201).json(sale);
});

app.put("/sales/:id", authMiddleware, (req, res) => {
  const data = readData();
  const idx = data.sales.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });

  data.sales[idx] = { ...data.sales[idx], ...req.body };
  writeData(data);
  res.json(data.sales[idx]);
});

app.delete("/sales/:id", authMiddleware, (req, res) => {
  const data = readData();
  const exists = data.sales.some((s) => s.id === req.params.id);
  if (!exists) return res.status(404).json({ message: "Not found" });

  data.sales = data.sales.filter((s) => s.id !== req.params.id);
  writeData(data);
  res.status(204).end();
});

// Dashboard aggregated stats
app.get("/dashboard/summary", authMiddleware, (req, res) => {
  const data = readData();
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthSales = data.sales.filter((s) => String(s.date || "").startsWith(monthKey));
  const monthlyRevenue = monthSales.reduce((sum, s) => sum + Number(s.total || 0), 0);

  res.json({
    productCount: data.products.length,
    customerCount: data.customers.length,
    supplierCount: data.suppliers.length,
    monthlyRevenue,
    pendingBills: data.bills.filter((b) => b.status === "Pending").length,
    pendingRepairs: data.repairOrders.filter((r) => r.status === "Pending").length,
  });
});

// ✅ Helpful error logger (so 500s show real cause)
app.use((err, req, res) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
