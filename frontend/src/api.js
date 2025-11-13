const API = (function () {
  const base = import.meta.env.VITE_API_BASE || "http://localhost:4000";

  async function request(path, opts = {}) {
    const headers = opts.headers || {};
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = "Bearer " + token;

    if (opts.body && typeof opts.body === "object" && !(opts.body instanceof FormData)) {
      opts.body = JSON.stringify(opts.body);
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(base + path, { ...opts, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw { status: res.status, data };
    return data;
  }

  return {
    //  Auth
    register: (u, p) =>
      request("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { username: u, password: p },
      }),

    login: (u, p) =>
      request("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { username: u, password: p },
      }),

    logout: () => {
      localStorage.removeItem("token");
    },

    //  Post
    createPost: (content, image_url = null) =>
      request("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { content, image_url },
      }),

    getFeed: (page, limit) => request(`/api/feed?page=${page}&limit=${limit}`),

    // Tambahan agar tanggal selalu tersedia
    getPostsByUserId: async (id) => {
      const data = await request(`/api/users/${id}/posts`);
      return Array.isArray(data)
        ? data.map((p) => ({
            ...p,
            created_at: p.created_at || p.createdAt || p.date || null,
          }))
        : data;
    },

    getMyPosts: async () => {
      const data = await request("/api/me/posts");
      return Array.isArray(data)
        ? data.map((p) => ({
            ...p,
            created_at: p.created_at || p.createdAt || p.date || null,
          }))
        : data;
    },

    //  Tambahan baru — Edit & Hapus Post
    updatePost: (id, data) =>
      request(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: data,
      }),

    deletePost: (id) =>
      request(`/api/posts/${id}`, {
        method: "DELETE",
      }),

    //  Users
    getUsers: () => request("/api/users"),
    searchUsers: (username) =>
      request(`/api/users/search?username=${encodeURIComponent(username)}`),
    getUserById: (id) => request(`/api/users/${id}`),

    //  Follow system
    follow: (id) => request(`/api/follow/${id}`, { method: "POST" }),
    unfollow: (id) => request(`/api/follow/${id}`, { method: "DELETE" }),

    //  Tambahan baru:
    getFollowers: () => request("/api/me/followers"),
    getFollowing: () => request("/api/me/following"),

    //  Stories
    getStories: () => request("/api/stories"),
    getMyStories: () => request("/api/me/stories"),
    createStory: (image_url, caption = "") =>
      request("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { image_url, caption },
      }),

    //  Edit & Hapus Story 
    updateStory: (id, data) =>
      request(`/api/stories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: { caption: data.caption },
      }),

    deleteStory: (id) =>
      request(`/api/stories/${id}`, {
        method: "DELETE",
      }),

    //  User info
    getCurrentUser: () => request("/api/me"),
    getMe: () => request("/api/me"),
  };
})();

export default API;