/* global process */
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuid } from "uuid";
import { seedData as appSeed } from "../src/data/seedData.js"; // ✅ named import

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const userId = uuid();

const users = [
  {
    id: userId,
    email: "admin@example.com",
    passwordHash: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
];

const seed = {
  users,
  products: appSeed.products ?? [],
  customers: appSeed.customers ?? [],
  sales: appSeed.sales ?? [],
  bills: appSeed.bills ?? [],
  notes: appSeed.notes ?? [],
  repairOrders: appSeed.repairOrders ?? [],
  suppliers: appSeed.suppliers ?? [],
  purchaseOrders: appSeed.purchaseOrders ?? [],
};

export default seed;

// Allow generating a baseline data.json if run directly
if (process.argv[1] === __filename) {
  const target = path.join(__dirname, "data.json");
  fs.writeFileSync(target, JSON.stringify(seed, null, 2));
  console.log(`Seed data written to ${target}`);
}