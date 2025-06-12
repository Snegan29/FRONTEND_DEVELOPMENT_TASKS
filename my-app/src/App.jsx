import React, { useState } from "react";
import ProductPage from "./ProductPage";
import Dashboard from "./Dashboard";
import "./App.css"; // Optional: For basic styles

function App() {
  const [activeTab, setActiveTab] = useState("product");

  return (
    <div className="app-container">
      <aside className="sidebar">
        <button
          className={activeTab === "product" ? "active" : ""}
          onClick={() => setActiveTab("product")}
        >
          Product Page
        </button>
        <button
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          Dashboard
        </button>
      </aside>

      <main className="main-content">
        {activeTab === "product" && <ProductPage />}
        {activeTab === "dashboard" && <Dashboard />}
      </main>
    </div>
  );
}

export default App;
