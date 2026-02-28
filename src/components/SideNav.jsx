import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  LogOut,
  DollarSign,
  Wallet,
  StickyNote,
  FileText,
  User,
  ShoppingCart,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";

const SideNav = ({ userEmail }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAppData();

  const activePath = location.pathname;
  const isOrderRoute = activePath.startsWith("/order");
  const [openOrders, setOpenOrders] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const ordersExpanded = isOrderRoute || openOrders;

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/products", icon: Package, label: "Products" },
    { path: "/suppliers", icon: Users, label: "Suppliers" },
  ];

  const orderSubItems = [
    { path: "/order/pending", label: "Pending Orders" },
    { path: "/order/completed", label: "Completed Orders" },
    { path: "/order/cancelled", label: "Cancelled Orders" },
  ];

  const additionalItems = [
    { path: "/reports", icon: BarChart3, label: "Reports" },
    { path: "/employee", icon: Users, label: "Employees" },
    { path: "/salary", icon: Wallet, label: "Salary" },
    { path: "/billpayments", icon: DollarSign, label: "Bill Payments" },
    { path: "/invoice", icon: FileText, label: "Invoice" },
    { path: "/notes", icon: StickyNote, label: "Notes" },
    { path: "/customers", icon: User, label: "Customers" },
    { path: "/sales", icon: ShoppingCart, label: "Sales" },
  ];

  return (
    <>
      <div className="md:hidden p-4 bg-blue-600 flex justify-between items-center">
        <h1 className="text-white font-bold text-lg">Inventory</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-600 to-blue-500 text-white flex flex-col shadow-lg z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-5 border-b border-blue-400 flex-shrink-0">
          <h1 className="text-2xl font-bold tracking-wide">Inventory Manager</h1>
          {userEmail && <p className="text-sm text-blue-100 mt-1">{userEmail}</p>}
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <div
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    activePath === item.path ? "bg-blue-700 shadow-md" : "hover:bg-blue-500/70"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
              </li>
            ))}

            <li>
              <div
                onClick={() => setOpenOrders(!openOrders)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  isOrderRoute ? "bg-blue-700 shadow-md" : "hover:bg-blue-500/70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag size={20} />
                  <span className="font-medium">Repairing Orders</span>
                </div>
                <span className="text-sm">{ordersExpanded ? "-" : "+"}</span>
              </div>

              {ordersExpanded && (
                <ul className="ml-6 mt-2 space-y-1">
                  {orderSubItems.map((item) => (
                    <li key={item.path}>
                      <div
                        onClick={() => handleNavigation(item.path)}
                        className={`p-2 rounded-lg cursor-pointer text-sm transition-all duration-200 ${
                          activePath === item.path ? "bg-blue-600/80" : "hover:bg-blue-500/50"
                        }`}
                      >
                        {item.label}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            {additionalItems.map((item) => (
              <li key={item.path}>
                <div
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    activePath === item.path ? "bg-blue-700 shadow-md" : "hover:bg-blue-500/70"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-blue-400 flex-shrink-0">
          <div
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 bg-red-600 hover:bg-red-700"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </div>
        </div>
      </div>

      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden" />
      )}
    </>
  );
};

export default SideNav;
