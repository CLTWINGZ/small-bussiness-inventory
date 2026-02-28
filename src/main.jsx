import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppDataProvider } from "./context/AppDataContext";
import "./index.css"; // Tailwind
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppDataProvider>
      <App />
    </AppDataProvider>
  </React.StrictMode>
);
