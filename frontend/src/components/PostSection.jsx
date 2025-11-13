import React, { useState } from "react";

export default function PostSection({
  posts,
  setPosts,
  content,
  setContent,
  image,
  setImage,
  count,
  setCount,
  selectedItem,
  setSelectedItem,
  selectedType,
  setSelectedType,
  editMode,
  setEditMode,
  editContent,
  setEditContent,
  editImage,
  setEditImage,
  submitPost,
  handleDeletePost,
  handleUpdatePost,
}) {
  const [showAddModal, setShowAddModal] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* === LIST POSTS === */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
          <span>Posts</span>
        </h2>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada postingan</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedItem(p);
                  setSelectedType("post");
                }}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all cursor-pointer"
              >
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt="Post"
                    className="w-full h-56 object-cover"
                  />
                )}
                <div className="p-4">
                  <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                    {p.content}
                  </p>
                  <p className="text-xs text-gray-400 italic">
                    {formatDate(p.created_at)}
                  </p>
                </div>
              </div>
            ))}

            {/* Tombol Tambah Post */}
            <div
              onClick={() => setShowAddModal(true)}
              className="flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl h-56 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white text-4xl font-bold shadow-md hover:scale-105 transition-transform">
                +
              </div>
              <p className="text-gray-500 text-sm mt-2">Tambah Postingan</p>
            </div>
          </div>
        )}
      </div>

      {/* === POPUP TAMBAH POSTINGAN === */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-2xl w-[90%] sm:w-[420px] shadow-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-semibold"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Tambah Postingan Baru
            </h3>
            <form
              onSubmit={(e) => {
                submitPost(e);
                setShowAddModal(false);
              }}
              className="space-y-3"
            >
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setCount(e.target.value.length);
                }}
                maxLength={200}
                placeholder="Tulis sesuatu..."
                className="w-full border p-2 rounded-lg text-sm resize-none"
                rows="3"
              />
              <div className="text-xs text-gray-500 text-right">{count}/200</div>
              <input
                type="text"
                placeholder="URL Gambar (opsional)"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full border p-2 rounded-lg text-sm"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90"
              >
                Posting
              </button>
            </form>
          </div>
        </div>
      )}

      {/* === MODAL LIHAT POST === */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => {
            setSelectedItem(null);
            setEditMode(false);
          }}
        >
          <div
            className="bg-white rounded-2xl w-[90%] sm:w-[420px] overflow-hidden shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setSelectedItem(null);
                setEditMode(false);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-semibold"
            >
              ✕
            </button>

            {selectedType === "story" ? null : editMode ? (
              <form onSubmit={handleUpdatePost} className="p-6 space-y-4">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border rounded-md p-2 text-sm"
                  rows="4"
                />
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full border rounded-md p-2 text-sm"
                  placeholder="Image URL (optional)"
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pink-500 text-white rounded-md text-sm hover:bg-pink-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-5">
                {selectedItem.image_url && (
                  <img
                    src={selectedItem.image_url}
                    alt="Post"
                    className="w-full h-56 object-cover rounded-xl mb-4"
                  />
                )}
                <p className="text-gray-700 mb-3 text-center text-sm leading-relaxed">
                  {selectedItem.content}
                </p>
                <p className="text-xs text-gray-400 text-right italic">
                  {formatDate(selectedItem.created_at)}
                </p>
                <div className="flex justify-center mt-4 gap-4">
                  <button
                    onClick={() => {
                      setEditMode(true);
                      setEditContent(selectedItem.content || "");
                      setEditImage(selectedItem.image_url || "");
                    }}
                    className="px-4 py-2 border rounded-md text-sm text-gray-600 hover:bg-gray-100"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(selectedItem.id)}
                    className="px-4 py-2 border rounded-md text-sm text-red-600 hover:bg-red-50"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
