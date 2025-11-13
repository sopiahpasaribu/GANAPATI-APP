import React, { useEffect, useState } from "react";
import API from "../api";
import StoryFeed from "../components/StoryFeed";
import PostFeed from "../components/PostFeed";

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
  const [currentUser, setCurrentUser] = useState(null);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);

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
      const filteredUsers = res.filter(
        (u) => u.id !== currentUser?.id && !u.isFollowing
      );
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
      const me = await API.getMe();
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

  useEffect(() => {
    if (currentUser) loadUsers();
  }, [currentUser]);

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
      setShowPostForm(false);
    } catch (err) {
      setError(err.data?.error || "Gagal membuat post");
    }
  }

  async function submitStory(e) {
    e.preventDefault();
    if (!storyImage.trim())
      return setError("Story harus memiliki gambar (URL).");
    try {
      const newStory = await API.createStory(storyImage, storyCaption || "");

      setStories((prev) => [newStory, ...prev]);

      setStoryImage("");
      setStoryCaption("");
      setShowStoryForm(false);
    } catch (err) {
      console.error("Gagal membuat story:", err);
      setError(err.data?.error || "Gagal membuat story");
    }
  }

  async function toggleFollow(u) {
    try {
      if (!u.isFollowing) {
        await API.follow(u.id);
        setUsers((prev) => prev.filter((x) => x.id !== u.id));
      } else {
        await API.unfollow(u.id);
        setUsers((prev) => prev.filter((x) => x.id !== u.id));
      }
      loadFeed();
      loadStories();
    } catch (err) {
      alert(err.data?.error || "Gagal follow/unfollow");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 md:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* === MAIN FEED === */}
          <div className="md:col-span-2 space-y-6">
            <StoryFeed
              isFeedPage={true}
              stories={stories}
              storyImage={storyImage}
              setStoryImage={setStoryImage}
              storyCaption={storyCaption}
              setStoryCaption={setStoryCaption}
              setStories={setStories}
            />
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("feed")}
                  className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
                    activeTab === "feed"
                      ? "text-pink-600 border-b-2 border-pink-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Untuk Anda
                </button>
                <button
                  onClick={() => setActiveTab("following")}
                  className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${
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
                  <div className="text-center py-10 text-gray-400">
                    Belum ada postingan
                  </div>
                ) : (
                  posts.map((p) => <PostFeed key={p.id} p={p} />)
                )}
              </div>
            </div>
          </div>

          {/* === RIGHT SIDEBAR === */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-md text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 opacity-60 rounded-2xl"></div>
              <div className="relative z-10">
                <button
                  onClick={() => setShowPostForm(true)}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-md hover:scale-110 transition-transform duration-300 mx-auto"
                  title="Buat Post"
                >
                  📝
                </button>
                <p className="text-sm text-gray-700 mt-2 font-semibold">
                  Buat Post Baru
                </p>
              </div>
            </div>

            {/* === Saran Untuk Anda === */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">
                Saran untuk Anda
              </h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {users.length === 0 ? (
                  <div className="text-xs text-gray-400 text-center">
                    Tidak ada saran
                  </div>
                ) : (
                  users.map((u) => (
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
                            Disarankan untuk Anda
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleFollow(u)}
                        className="px-3 py-1.5 text-xs rounded-lg bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600 shadow-sm transition-all"
                      >
                        Ikuti
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === POPUP POST === */}
      {showPostForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowPostForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Buat Post Baru
            </h2>
            <form
              onSubmit={submitPost}
              className="space-y-4 bg-white border border-gray-100 rounded-xl p-4 shadow-inner"
            >
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setCount(e.target.value.length);
                }}
                maxLength={200}
                placeholder="Tulis sesuatu yang menarik..."
                className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                rows="4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{count}/200 karakter</span>
              </div>
              <input
                type="text"
                placeholder="Masukkan URL gambar..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              {image && (
                <div className="mt-2">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border border-gray-200 shadow-sm"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostForm(false)}
                  className="px-3 py-1.5 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-sm bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700"
                >
                  Posting Sekarang 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
