// src/layouts/DashboardLayout.js
import React from "react";
import SideNav from "../components/SideNav";
import { Navbar, Container, Nav } from "react-bootstrap";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar navigation */}
      <SideNav />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
      
        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
