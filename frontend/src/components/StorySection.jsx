import React, { useState, useEffect } from "react";
import { Plus, X, Pencil, Trash2 } from "lucide-react";
import API from "../api"; 

export default function StorySection({
  storyImage,
  setStoryImage,
  storyCaption,
  setStoryCaption,
  stories,
  setStories,
  setSelectedItem,
  setSelectedType,
  submitStory,
  isFeedPage = false, 
}) {
  const [showForm, setShowForm] = useState(false);
  const [previewStory, setPreviewStory] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editStoryId, setEditStoryId] = useState(null);

  // ✅ Filter otomatis hanya jika halaman Feed
  useEffect(() => {
    if (!isFeedPage) return; // 👉 kalau bukan FeedPage, skip
    if (stories?.length) {
      const now = new Date();
      const filtered = stories.filter((s) => {
        const createdAt = new Date(s.created_at);
        return now - createdAt < 24 * 60 * 60 * 1000; // hanya tampil < 24 jam
      });
      setStories(filtered);
    }
  }, [isFeedPage, stories, setStories]);

  // === EDIT STORY ===
  const handleEdit = (story) => {
    setStoryImage(story.image_url);
    setStoryCaption(story.caption || "");
    setEditMode(true);
    setEditStoryId(story.id);
    setShowForm(true);
  };

  // === DELETE STORY ===
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus story ini?")) return;
    try {
      await API.deleteStory(id);
      setStories((prev) => prev.filter((s) => s.id !== id));
      setPreviewStory((prev) => (prev?.id === id ? null : prev));
      alert("Story berhasil dihapus!");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus story!");
    }
  };

  // === SUBMIT (TAMBAH / EDIT) ===
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        const updated = { image_url: storyImage, caption: storyCaption };

        const res = await API.updateStory(editStoryId, updated).catch((err) => {
          console.error("API.updateStory error:", err);
          throw new Error("Gagal update story");
        });

        if (!res || res.error) {
          console.warn("Response API kosong atau error:", res);
        }

        setStories((prev) =>
          prev.map((s) => (s.id === editStoryId ? { ...s, ...updated } : s))
        );

        setPreviewStory((prev) =>
          prev && prev.id === editStoryId ? { ...prev, ...updated } : prev
        );

        alert("Story berhasil diperbarui!");
      } else {
        const newStory = await submitStory(e);
        if (newStory) {
          setStories((prev) => [newStory, ...prev]);
        }
      }

      setShowForm(false);
      setEditMode(false);
      setEditStoryId(null);
      setStoryImage("");
      setStoryCaption("");
    } catch (err) {
      console.error("handleSubmit error:", err);
      alert("Gagal menyimpan story!");
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* === LIST SEMUA STORY === */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">My Stories</h2>

        <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
          {/* === TOMBOL TAMBAH === */}
          <div
            onClick={() => {
              setEditMode(false);
              setStoryImage("");
              setStoryCaption("");
              setShowForm(true);
            }}
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <div className="w-24 h-24 rounded-full border-4 border-dashed border-pink-400 bg-pink-50 flex items-center justify-center shadow-md">
              <Plus className="text-pink-600" size={36} />
            </div>
            <p className="text-gray-600 text-xs mt-2 text-center w-24">Tambah</p>
          </div>

          {/* === LIST STORY === */}
          {stories.map((s) => (
            <div
              key={s.id}
              className="relative cursor-pointer hover:scale-105 transition-transform"
            >
              <div
                onClick={() => {
                  setSelectedItem(s);
                  setSelectedType("story");
                  setPreviewStory(s);
                }}
                className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-500 shadow-md"
              >
                <img
                  src={s.image_url}
                  alt={s.caption}
                  className="w-full h-full object-cover"
                />
              </div>
              {s.caption && (
                <p className="text-gray-600 text-xs mt-2 text-center truncate w-24">
                  {s.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* === FORM TAMBAH / EDIT === */}
      {showForm && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="bg-white w-80 sm:w-96 rounded-2xl p-6 shadow-lg border relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditMode(false);
                setEditStoryId(null);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="font-semibold text-gray-800 mb-4 text-center">
              {editMode ? "✏️ Edit Story" : "📸 Tambah Story"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="URL Gambar Story"
                value={storyImage}
                onChange={(e) => setStoryImage(e.target.value)}
                className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-pink-400"
                required
              />
              <input
                type="text"
                placeholder="Caption (opsional)"
                value={storyCaption}
                onChange={(e) => setStoryCaption(e.target.value)}
                className="w-full border p-2 rounded-lg text-sm focus:ring-2 focus:ring-pink-400"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
              >
                {editMode ? "💾 Simpan Perubahan" : "+ Tambah Story"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* === PREVIEW  === */}
      {previewStory && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-2xl p-4 shadow-lg border max-w-sm w-full">
            <button
              onClick={() => setPreviewStory(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <img
              src={previewStory.image_url}
              alt={previewStory.caption}
              className="rounded-xl w-full h-64 object-cover mb-3"
            />

            {previewStory.caption && (
              <p className="text-gray-700 text-center text-sm mb-3">
                {previewStory.caption}
              </p>
            )}

            <div className="flex justify-center gap-3 mt-2">
              <button
                onClick={() => {
                  handleEdit(previewStory);
                  setPreviewStory(null);
                }}
                className="flex items-center gap-1 bg-yellow-400 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-500 transition"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={() => handleDelete(previewStory.id)}
                className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
              >
                <Trash2 size={14} /> Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
