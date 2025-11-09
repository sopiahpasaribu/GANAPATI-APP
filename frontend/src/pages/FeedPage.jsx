import React, { useEffect, useState } from "react";
import API from "../api";
import StoryBar from "../components/StoryBar";
import Post from "../components/Post";

export default function FeedPage() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [stories, setStories] = useState([]);
  const [storyImage, setStoryImage] = useState("");
  const [storyCaption, setStoryCaption] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("feed");
  const [currentUser, setCurrentUser] = useState(null); // ✅ user login

  // --- Load Data ---
  async function loadFeed() {
    try {
      const res = await API.getFeed(1, 10);
      setPosts(res.posts);
    } catch (err) {
      setError(err.data?.error || "Gagal load feed");
    }
  }

  async function loadUsers() {
    try {
      const res = await API.getUsers();
      // ✅ Filter agar user login tidak muncul di saran
      const filteredUsers = res.filter((u) => u.id !== currentUser?.id);
      setUsers(filteredUsers);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadStories() {
    try {
      const res = await API.getStories();
      setStories(res);
    } catch (err) {
      console.error("Gagal load stories:", err);
    }
  }

  async function loadCurrentUser() {
    try {
      const me = await API.getMe(); // endpoint untuk user login
      setCurrentUser(me);
    } catch (err) {
      console.error("Gagal load user login:", err);
    }
  }

  useEffect(() => {
    loadCurrentUser();
    loadFeed();
    loadStories();
  }, []);

  // setelah currentUser ada, baru load saran pengguna
  useEffect(() => {
    if (currentUser) {
      loadUsers();
    }
  }, [currentUser]);

  // --- Posting ---
  async function submitPost(e) {
    e.preventDefault();
    if (!content.trim() && !image.trim())
      return setError("Post tidak boleh kosong");
    try {
      const p = await API.createPost(content, image || null);
      setPosts((prev) => [p, ...prev]);
      setContent("");
      setImage("");
      setCount(0);
    } catch (err) {
      setError(err.data?.error || "Gagal membuat post");
    }
  }

  // --- Story ---
  async function submitStory(e) {
    e.preventDefault();
    if (!storyImage.trim())
      return setError("Story harus memiliki gambar (URL).");
    try {
      await API.createStory(storyImage, storyCaption || "");
      loadStories();
      setStoryImage("");
      setStoryCaption("");
    } catch (err) {
      console.error("Gagal membuat story:", err);
      setError(err.data?.error || "Gagal membuat story");
    }
  }

  // --- Follow ---
  async function toggleFollow(u) {
    try {
      if (u.isFollowing) await API.unfollow(u.id);
      else await API.follow(u.id);
      setUsers((prev) =>
        prev.map((x) =>
          x.id === u.id ? { ...x, isFollowing: !x.isFollowing } : x
        )
      );
      // opsional: reload feed/story agar update jika sudah follow
      loadFeed();
      loadStories();
    } catch (err) {
      alert(err.data?.error || "Gagal follow/unfollow");
    }
  }

  // --- UI ---
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-1 space-y-6">
            {/* Story Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Buat Story</h3>
              <form onSubmit={submitStory} className="space-y-3">
                <input
                  type="text"
                  placeholder="URL Gambar"
                  value={storyImage}
                  onChange={(e) => setStoryImage(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Caption (opsional)"
                  value={storyCaption}
                  onChange={(e) => setStoryCaption(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
                >
                  + Tambah Story
                </button>
              </form>
            </div>

            {/* Post Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3">Buat Post</h3>
              <form onSubmit={submitPost} className="space-y-3">
                <textarea
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    setCount(e.target.value.length);
                  }}
                  maxLength={200}
                  placeholder="Apa yang sedang kamu pikirkan?"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-sm"
                  rows="3"
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">{count}/200</span>
                </div>
                <input
                  type="text"
                  placeholder="URL Gambar (opsional)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
                >
                  📝 Posting
                </button>
              </form>
            </div>
          </div>

          {/* MAIN FEED */}
          <div className="lg:col-span-2">
            <StoryBar stories={stories} />
            <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("feed")}
                  className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
                    activeTab === "feed"
                      ? "text-pink-600 border-b-2 border-pink-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Untuk Anda
                </button>
                <button
                  onClick={() => setActiveTab("following")}
                  className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${
                    activeTab === "following"
                      ? "text-pink-600 border-b-2 border-pink-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Mengikuti
                </button>
              </div>
              <div className="p-4">
                {posts.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    Belum ada postingan
                  </div>
                ) : (
                  posts.map((p) => <Post key={p.id} p={p} />)
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4">
                Saran untuk Anda
              </h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        {u.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {u.username}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {u.isFollowing
                            ? "Mengikuti Anda"
                            : "Disarankan untuk Anda"}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFollow(u)}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-all duration-200 ${
                        u.isFollowing
                          ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          : "bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600 shadow-sm"
                      }`}
                    >
                      {u.isFollowing ? "Mengikuti" : "Ikuti"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
