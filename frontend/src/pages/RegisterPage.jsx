import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Register
        </h2>

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
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
              className="w-1/2 bg-purple-500 text-white font-semibold py-2 rounded-lg hover:bg-purple-600 transition-colors duration-200"
            >
              Register
            </button>
            <button
              type="button"
              className="w-1/2 border border-purple-400 text-purple-600 font-semibold py-2 rounded-lg hover:bg-purple-50 transition-colors duration-200"
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
