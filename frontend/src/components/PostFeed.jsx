import React, { useState, useEffect } from "react";
import API from "../api";
import { MoreVertical, Edit3, Trash2, X, Check } from "lucide-react";

export default function PostFeed({ p, onPostUpdated, onPostDeleted }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(p.content);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await API.getCurrentUser();
        setCurrentUser(user);
      } catch (err) {
        console.error("Gagal ambil user login:", err);
      }
    }
    fetchUser();
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("Yakin ingin menghapus postingan ini?")) return;
    try {
      await API.deletePost(p.id);
      if (onPostDeleted) onPostDeleted(p.id);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus postingan.");
    }
  };

  const handleEdit = async () => {
    try {
      const updated = await API.updatePost(p.id, { content: newContent });
      setIsEditing(false);
      if (onPostUpdated) onPostUpdated(updated);
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui postingan.");
    }
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-white p-[2px] flex items-center justify-center">
              <span className="font-bold text-sm text-gray-900">
                {p.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <div className="font-semibold text-sm text-gray-900">
              {p.username}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(p.createdat).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        {currentUser && currentUser.id === p.userid && (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
            >
              <MoreVertical size={18} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-md z-20">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  <Edit3 size={16} /> Edit
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleDelete();
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <Trash2 size={16} /> Hapus
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Gambar */}
      {p.image_url && (
        <div className="aspect-square bg-gray-100">
          <img
            src={p.image_url}
            alt="post"
            className="w-full h-full object-cover"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      )}

      {/* Isi */}
      <div className="p-4 text-sm leading-relaxed">
        <span className="font-semibold text-gray-900 mr-2">{p.username}</span>
        {p.content}
      </div>

      {/* Modal Edit */}
      {isEditing && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-30">
          <div className="bg-white rounded-xl p-5 w-[90%] max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Edit Postingan
            </h2>
            <textarea
              className="w-full border rounded-lg p-2 text-sm mb-3 focus:ring-2 focus:ring-blue-400"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                <X size={16} /> Batal
              </button>
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              >
                <Check size={16} /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
