import React, { useEffect, useState } from "react";
import API from "../api";

function Post({ p }) {
  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm mr-3">
          {p.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-sm">{p.username}</div>
          <div className="text-xs text-gray-500">
            {new Date(p.createdat).toLocaleString()}
          </div>
        </div>
      </div>
      <div className="ml-11 text-sm leading-relaxed">{p.content}</div>
    </div>
  );
}

export default function FeedPage() {
  const [content, setContent] = useState("");
  const [count, setCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

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
      setUsers(res);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadFeed();
    loadUsers();
  }, []);

  async function submitPost(e) {
    e.preventDefault();
    if (!content.trim()) return setError("Tidak boleh kosong");
    try {
      const p = await API.createPost(content);
      setPosts((prev) => [p, ...prev]);
      setContent("");
      setCount(0);
    } catch (err) {
      setError(err.data?.error || "Gagal membuat post");
    }
  }

  async function toggleFollow(u) {
    try {
      if (u.isFollowing) await API.unfollow(u.id);
      else await API.follow(u.id);
      setUsers((prev) =>
        prev.map((x) =>
          x.id === u.id ? { ...x, isFollowing: !x.isFollowing } : x
        )
      );
    } catch (err) {
      alert(err.data?.error || "Gagal follow/unfollow");
    }
  }

  return (
    <>
      <div className="container max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={submitPost} className="mb-6">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setCount(e.target.value.length);
            }}
            maxLength={200}
            placeholder="Apa yang sedang kamu pikirkan?"
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 resize-none"
            rows="3"
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-500">{count}/200</div>
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:from-pink-600 hover:to-purple-700"
            >
              Post
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 border">
            <h2 className="font-semibold text-lg mb-4">Feed</h2>
            {posts.length === 0 ? (
              <div className="text-gray-500 text-center py-10">
                Tidak ada postingan
              </div>
            ) : (
              posts.map((p) => <Post key={p.id} p={p} />)
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4 max-h-[500px] overflow-auto">
            <h2 className="font-semibold text-lg mb-4">People</h2>
            {users.map((u) => (
              <div
                key={u.id}
                className="flex justify-between items-center py-2 border-b border-gray-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                    {u.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm">{u.username}</span>
                </div>
                <button
                  onClick={() => toggleFollow(u)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    u.isFollowing
                      ? "border border-gray-300 hover:bg-gray-50"
                      : "bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600"
                  }`}
                >
                  {u.isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
