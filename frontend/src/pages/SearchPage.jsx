import React, { useState, useEffect } from "react";
import API from "../api";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    try {
      setLoading(true);
      const users = await API.searchUsers(query.trim());
      setResults(users);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // 🔎 Auto-search (debounce)
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const users = await API.searchUsers(query.trim());
        setResults(users);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  async function handleFollow(userId, isFollowing) {
    try {
      if (isFollowing) {
        await API.unfollow(userId);
      } else {
        await API.follow(userId);
      }
      setResults((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isFollowing: !isFollowing } : u
        )
      );
    } catch (err) {
      console.error("Follow/unfollow failed:", err);
    }
  }

  return (
    <div className="md:ml-64 p-4 sm:p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">
        🔍 Cari Pengguna
      </h2>

      {/* Form Search */}
      <form
        onSubmit={handleSearch}
        className="mb-8 flex flex-col sm:flex-row gap-3 items-center sm:items-start justify-center md:justify-start"
      >
        <input
          type="text"
          placeholder="Cari berdasarkan username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 w-full sm:w-72 shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-pink-500 text-white px-6 py-2 rounded-xl hover:bg-pink-600 transition w-full sm:w-auto"
        >
          Cari
        </button>
      </form>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500 mr-3"></div>
          Loading...
        </div>
      ) : results.length === 0 && query ? (
        <p className="text-center text-gray-500 italic">
          Tidak ada pengguna ditemukan.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {results.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              {/* Header User */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-gray-800">
                      @{user.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      Bergabung:{" "}
                      {new Date(user.created_at).toLocaleDateString("id-ID", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Follow / Following Button */}
                <button
                  onClick={() => handleFollow(user.id, user.isFollowing)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition ${
                    user.isFollowing
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-pink-500 text-white hover:bg-pink-600"
                  }`}
                >
                  {user.isFollowing ? "Mengikuti" : "Ikuti"}
                </button>
              </div>

              {/* Followers / Following */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-pink-600">
                    {user.followers_count || 0}
                  </span>{" "}
                  Followers
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-purple-600">
                    {user.following_count || 0}
                  </span>{" "}
                  Following
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-blue-600">
                    {user.posts?.length || 0}
                  </span>{" "}
                  Posts
                </div>
              </div>

              {/* Stories */}
              {user.stories?.length > 0 && (
                <div className="mb-4 border-t pt-3">
                  <h4 className="font-semibold text-gray-700 text-sm mb-2">
                    Stories:
                  </h4>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {user.stories.map((story) => (
                      <div
                        key={story.id}
                        className="min-w-[70px] h-[70px] rounded-full border-2 border-pink-400 overflow-hidden"
                      >
                        <img
                          src={story.image_url}
                          alt={story.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Posts */}
              {user.posts?.length > 0 ? (
                <div className="border-t pt-3 space-y-3">
                  <h4 className="font-semibold text-gray-700 text-sm">
                    Postingan Terbaru:
                  </h4>
                  {user.posts.slice(0, 2).map((p) => (
                    <div
                      key={p.id}
                      className="border border-gray-100 p-3 rounded-lg bg-gray-50"
                    >
                      <p className="text-gray-700 text-sm">{p.content}</p>
                      {p.image_url && (
                        <img
                          src={p.image_url}
                          alt="post"
                          className="mt-2 rounded-lg max-h-40 object-cover w-full"
                        />
                      )}
                    </div>
                  ))}
                  {user.posts.length > 2 && (
                    <p className="text-xs text-gray-400 italic">
                      + {user.posts.length - 2} postingan lainnya
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 italic text-sm border-t pt-3">
                  Belum ada postingan.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
