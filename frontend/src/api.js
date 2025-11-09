const API = (function () {
  const base = import.meta.env.VITE_API_BASE || "http://localhost:4000";

  async function request(path, opts = {}) {
    const headers = opts.headers || {};
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = "Bearer " + token;
    const res = await fetch(base + path, { ...opts, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw { status: res.status, data };
    return data;
  }

  return {
    // 🔹 Auth
    register: (u, p) =>
      request("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      }),

    login: (u, p) =>
      request("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u, password: p }),
      }),

    logout: () => {
      localStorage.removeItem("token");
    },

    // 🔹 Post
    createPost: (content, image_url = null) =>
      request("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, image_url }),
      }),

    getFeed: (page, limit) => request(`/api/feed?page=${page}&limit=${limit}`),
    getPostsByUserId: (id) => request(`/api/users/${id}/posts`),
    getMyPosts: () => request("/api/me/posts"),

    // 🔹 Users
    getUsers: () => request("/api/users"),
    searchUsers: (username) =>
      request(`/api/users/search?username=${encodeURIComponent(username)}`),
    getUserById: (id) => request(`/api/users/${id}`),

    // 🔹 Follow system
    follow: (id) => request(`/api/follow/${id}`, { method: "POST" }),
    unfollow: (id) => request(`/api/follow/${id}`, { method: "DELETE" }),

    // ✅ Tambahan baru:
    getFollowers: () => request("/api/me/followers"), // daftar followers user login
    getFollowing: () => request("/api/me/following"), // daftar following user login

    // 🔹 Stories
    getStories: () => request("/api/stories"),
    getMyStories: () => request("/api/me/stories"),
    createStory: (image_url, caption = "") =>
      request("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url, caption }),
      }),

    // 🔹 User info
    getCurrentUser: () => request("/api/me"),
    getMe: () => request("/api/me"),
  };
})();

export default API;
