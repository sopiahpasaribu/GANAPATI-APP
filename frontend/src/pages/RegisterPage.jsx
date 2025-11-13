import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { Sparkles } from "lucide-react";

export default function RegisterPage() {
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
      await API.register(username, password);
      navigate("/login");
    } catch (err) {
      if (err.status === 409) setError("Username sudah ada");
      else setError(err.data?.error || "Terjadi kesalahan");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-white to-purple-100">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 border border-gray-100">
        {/* Logo dan Judul */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-pink-500" size={28} />
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              Ganapati App
            </h1>
          </div>
          <p className="text-gray-500 text-sm">Buat akun baru kamu</p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
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
              className="w-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-2 rounded-lg shadow-md hover:opacity-90 transition-all duration-200"
            >
              Register
            </button>
            <button
              type="button"
              className="w-1/2 border border-pink-400 text-pink-600 font-semibold py-2 rounded-lg hover:bg-pink-50 transition-all duration-200"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
