import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, User, LogOut, Sparkles, Search } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <nav className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 shadow-sm flex flex-col justify-between">
      <div className="p-6">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/feed")}
        >
          <Sparkles className="text-pink-500" size={24} />
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
            Ganapati App
          </h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 px-4 mt-4">
        <button
          onClick={() => navigate("/feed")}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-colors"
        >
          <Home size={18} />
          <span>Feed</span>
        </button>

        <button
          onClick={() => navigate("/search")}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-colors"
        >
          <Search size={18} />
          <span>Search</span>
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-pink-50 hover:text-pink-600 transition-colors"
        >
          <User size={18} />
          <span>Profile</span>
        </button>
      </div>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
