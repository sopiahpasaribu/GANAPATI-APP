import React, { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import API from "../api";

function StoryItem({ s, onEdit, onDelete, onView }) {
  const currentUser = localStorage.getItem("username");
  const isMyStory = s.username === currentUser;

  return (
    <div
      className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-200 relative group"
      onClick={() => onView(s)} 
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 p-[3px] shadow-md">
        <div className="w-full h-full rounded-full bg-white p-[2px]">
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {s.image_url ? (
              <img
                src={s.image_url}
                alt={s.username}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            ) : (
              <span className="text-gray-500 text-xs font-semibold">
                {s.username?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      {isMyStory && (
        <div className="absolute top-0 right-0 hidden group-hover:flex flex-col gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              onEdit(s);
            }}
            className="bg-yellow-400 text-white p-1 rounded-full shadow hover:bg-yellow-500"
            title="Edit Story"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); 
              onDelete(s.id);
            }}
            className="bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
            title="Hapus Story"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      <p className="text-xs mt-2 text-gray-700 font-medium truncate max-w-[80px] text-center">
        {s.username}
      </p>
    </div>
  );
}

export default function StoryFeed({
  stories,
  storyImage,
  setStoryImage,
  storyCaption,
  setStoryCaption,
  setStories,
}) {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null); 

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editId) {
        await API.updateStory(editId, { caption: storyCaption });
      } else {
        await API.createStory(storyImage, storyCaption);
      }

      const updatedStories = await API.getStories();
      setStories(updatedStories);

      setStoryImage("");
      setStoryCaption("");
      setEditId(null);
      setShowForm(false);
    } catch (err) {
      console.error("Gagal menyimpan story:", err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus story ini?")) return;
    try {
      await API.deleteStory(id);
      const updatedStories = await API.getStories();
      setStories(updatedStories);
    } catch (err) {
      console.error("Gagal hapus story:", err);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm overflow-x-auto scrollbar-hide">
      <div className="flex flex-nowrap space-x-4 items-center">
        {/* Tombol Tambah Story */}
        <div className="flex flex-col items-center cursor-pointer">
          <div
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setStoryImage("");
              setStoryCaption("");
            }}
            className="w-20 h-20 rounded-full border-2 border-dashed border-pink-400 flex items-center justify-center text-pink-500 bg-pink-50 hover:bg-pink-100 hover:scale-105 transition-transform duration-200 shadow-sm"
          >
            <Plus size={30} />
          </div>
          <p className="text-xs mt-2 text-pink-600 font-medium">Tambah</p>
        </div>

        {stories?.length > 0 ? (
          stories.map((s) => (
            <StoryItem
              key={s.id}
              s={s}
              onEdit={(story) => {
                setEditId(story.id);
                setStoryImage(story.image_url || "");
                setStoryCaption(story.caption || "");
                setShowForm(true);
              }}
              onDelete={handleDelete}
              onView={(story) => setSelectedStory(story)} 
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 italic ml-3">
            Belum ada story, yuk tambah dulu!
          </p>
        )}
      </div>

      {/* Modal Tambah / Edit Story */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold text-center bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-5">
              {editId ? "Edit Story" : "Tambah Story Baru"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!editId && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    URL Gambar
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan URL gambar"
                    value={storyImage}
                    onChange={(e) => setStoryImage(e.target.value)}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  placeholder="Tulis caption singkat..."
                  value={storyCaption}
                  onChange={(e) => setStoryCaption(e.target.value)}
                  className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-sm bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
                >
                  {editId ? "Simpan Perubahan" : "Tambah"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ✅ Modal Preview Story */}
      {selectedStory && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="bg-white rounded-2xl p-4 max-w-sm w-full mx-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {/* ✅ Tambahkan nama user di atas gambar */}
            <p className="text-center font-semibold text-gray-800 mb-2">
              @{selectedStory.username}
            </p>

            <img
              src={selectedStory.image_url}
              alt={selectedStory.username}
              className="rounded-xl w-full h-80 object-cover mb-4"
            />
            <p className="text-gray-700 text-sm text-center italic">
              {selectedStory.caption || "(tanpa caption)"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
