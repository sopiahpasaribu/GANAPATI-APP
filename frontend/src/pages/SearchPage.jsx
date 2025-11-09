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

  // ✅ Auto-search (debounce)
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
      // Refresh state setelah follow/unfollow
      setResults((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, is_following: !isFollowing } : u
        )
      );
    } catch (err) {
      console.error("Follow/unfollow failed:", err);
    }
  }

  return (
    <div className="ml-64 p-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🔍 Search Users</h2>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 w-72 shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-pink-500 text-white px-5 py-2 rounded-xl hover:bg-pink-600 transition"
        >
          Search
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center items-center py-10 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500 mr-3"></div>
          Loading...
        </div>
      ) : results.length === 0 && query ? (
        <p className="text-center text-gray-500 italic">No users found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {results.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
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
                      Joined:{" "}
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Follow/Following Button */}
                <button
                  onClick={() => handleFollow(user.id, user.is_following)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full transition ${
                    user.is_following
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-pink-500 text-white hover:bg-pink-600"
                  }`}
                >
                  {user.is_following ? "Following" : "Follow"}
                </button>
              </div>

              {/* Statistik */}
              <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-pink-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a4 4 0 00-3-3.87V9a5 5 0 10-10 0v5.13A4 4 0 006 18v2h5"
                    />
                  </svg>
                  <span>{user.followers_count || 0} Followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2"
                    />
                  </svg>
                  <span>{user.posts?.length || 0} Posts</span>
                </div>
              </div>

              {/* Daftar postingan */}
              {user.posts?.length > 0 ? (
                <div className="border-t pt-3 space-y-3">
                  <h4 className="font-semibold text-gray-700 text-sm">
                    Recent Posts:
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
                          alt=""
                          className="mt-2 rounded-lg max-h-40 object-cover"
                        />
                      )}
                    </div>
                  ))}
                  {user.posts.length > 2 && (
                    <p className="text-xs text-gray-400 italic">
                      + {user.posts.length - 2} more posts
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 italic text-sm border-t pt-3">
                  No posts yet.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
