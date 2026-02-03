import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StorePage from "./pages/StorePage";
import DonatePage from "./pages/DonatePage";
import HistoryPage from "./pages/HistoryPage";
import RefundPage from "./pages/RefundPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/donate" element={<DonatePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/refund" element={<RefundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
