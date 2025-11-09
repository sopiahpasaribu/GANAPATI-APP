import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./index.css";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar"; // ✅ import Navbar di sini

// ✅ Komponen wrapper untuk halaman yang butuh login + tampilkan Navbar
function ProtectedLayout({ token }) {
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet /> {/* tempat halaman Feed / Profile muncul */}
      </div>
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Update state kalau token berubah (misal setelah login/logout)
  useEffect(() => {
    const onStorageChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ✅ Semua route yang butuh login dibungkus di ProtectedLayout */}
        <Route element={<ProtectedLayout token={token} />}>
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Default redirect */}
        <Route
          path="/"
          element={<Navigate to={token ? "/feed" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
