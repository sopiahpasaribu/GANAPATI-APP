import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [follows, setFollows] = useState([]); // ✅ tambah state follow list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const me = await API.getCurrentUser();
        const myPosts = await API.getMyPosts();
        const myFollows = await API.getMyFollows?.(); // ✅ pastikan API ini ada (opsional)
        setUser(me);
        setPosts(myPosts);
        if (myFollows) setFollows(myFollows);
      } catch (err) {
        console.error("Failed to load profile:", err);
        if (err.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load profile data.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [navigate]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      {user && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-300 pb-6 mb-6">
          {/* Avatar & Info */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
              <p className="text-gray-500 text-sm">
                Joined {new Date(user.created_at).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mt-1 text-sm">
                {posts.length} posts • {follows.length} following
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Follow Section */}
      {follows.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Following
          </h2>
          <div className="flex flex-wrap gap-3">
            {follows.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-2 bg-white shadow-sm border border-gray-200 px-3 py-2 rounded-full hover:bg-gray-50 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                  {f.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 text-sm">{f.username}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Your Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500">You haven’t posted anything yet.</p>
        ) : (
          <div className="grid gap-4">
            {posts.map((p) => (
              <div
                key={p.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
              >
                <p className="text-gray-800">{p.content}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(p.createdat).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
