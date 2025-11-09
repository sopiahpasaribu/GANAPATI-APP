const API = (function(){
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
  async function request(path, opts={}){
    const headers = opts.headers || {};
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const res = await fetch(base + path, {...opts, headers});
    const data = await res.json().catch(()=> ({}));
    if (!res.ok) throw {status: res.status, data};
    return data;
  }
  return {
    register: (u,p) => request('/api/register', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username:u,password:p})}),
    login: (u,p) => request('/api/login', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username:u,password:p})}),
    createPost: (content) => request('/api/posts', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({content})}),
    getFeed: (page,limit) => request(`/api/feed?page=${page}&limit=${limit}`),
    getUsers: () => request('/api/users'),
    follow: (id) => request(`/api/follow/${id}`, {method:'POST'}),
    unfollow: (id) => request(`/api/follow/${id}`, {method:'DELETE'}),


     // ✅ Tambahan baru
    getCurrentUser: () => request('/api/me'),         // ambil data user login
    getMyPosts: () => request('/api/me/posts'),       // ambil posting user login
    logout: () => { localStorage.removeItem('token'); } // hapus token lokal
  }
})();
export default API;
