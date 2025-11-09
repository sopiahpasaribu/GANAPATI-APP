import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function LoginPage({ setToken }) { // ✅ tambahkan setToken dari props
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Isi semua field");
      return;
    }

    try {
      // ✅ bersihkan token lama sebelum login baru
      localStorage.removeItem("token");

      const data = await API.login(username, password);
      console.log("Login response:", data); // debug (boleh dihapus nanti)

      if (!data.token) {
        setError("Login gagal: token tidak diterima dari server");
        return;
      }

      // ✅ simpan token dan update state di App
      localStorage.setItem("token", data.token);
      if (setToken) setToken(data.token); // 🔥 penting agar App re-render

      // ✅ redirect ke feed
      navigate("/feed", { replace: true });

    } catch (err) {
      console.error("Login error:", err);
      if (err.status === 401) setError("Kredensial salah");
      else setError(err.data?.error || "Terjadi kesalahan saat login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-blue-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="w-1/2 bg-pink-500 text-white font-semibold py-2 rounded-lg hover:bg-pink-600 transition-colors duration-200"
            >
              Login
            </button>
            <button
              type="button"
              className="w-1/2 border border-pink-400 text-pink-600 font-semibold py-2 rounded-lg hover:bg-pink-50 transition-colors duration-200"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
  