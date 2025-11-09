import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./index.css";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage"; // ✅ perbaikan: import SearchPage dari folder pages
import Navbar from "./components/Navbar"; // ✅ hanya 1 import Navbar

function ProtectedLayout({ token }) {
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Navbar />
      <div className="flex-1 ml-60 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const onStorageChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedLayout token={token} />}>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<SearchPage />} /> {/* ✅ route benar */}
        </Route>
        <Route path="/" element={<Navigate to={token ? "/feed" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
