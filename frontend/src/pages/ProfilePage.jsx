import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [followers, setFollowers] = useState([]); // ✅ followers list
  const [following, setFollowing] = useState([]); // ✅ following list
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const me = await API.getCurrentUser();
        const myPosts = await API.getMyPosts();
        const myStories = await API.getMyStories();
        const myFollowers = await API.getFollowers();
        const myFollowing = await API.getFollowing();

        setUser(me);
        setPosts(myPosts);
        setStories(myStories);
        setFollowers(myFollowers);
        setFollowing(myFollowing);
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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md w-full">
          <p className="text-center text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        {user && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-10">
            <div className="px-6 pb-6 pt-8">
              <div className="flex flex-col sm:flex-row items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>

                <div className="sm:ml-8 mt-4 sm:mt-0 text-center sm:text-left flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-xl font-semibold text-gray-800">
                        {user.username}
                      </h1>
                      <p className="text-gray-500 text-sm mt-1">
                        Joined{" "}
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <button
                      onClick={() => navigate("/edit-profile")}
                      className="mt-3 sm:mt-0 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                    >
                      Edit Profile
                    </button>
                  </div>

                  {/* ✅ Followers / Following clickable */}
                  <div className="flex justify-center sm:justify-start gap-10 mt-5 text-gray-700">
                    <div className="text-center">
                      <div className="font-bold text-lg">{posts.length}</div>
                      <div className="text-sm text-gray-500">Posts</div>
                    </div>

                    <div
                      className="text-center cursor-pointer hover:text-pink-500 transition"
                      onClick={() => setShowFollowers(true)}
                    >
                      <div className="font-bold text-lg">
                        {followers.length ?? 0}
                      </div>
                      <div className="text-sm text-gray-500">Followers</div>
                    </div>

                    <div
                      className="text-center cursor-pointer hover:text-pink-500 transition"
                      onClick={() => setShowFollowing(true)}
                    >
                      <div className="font-bold text-lg">
                        {following.length ?? 0}
                      </div>
                      <div className="text-sm text-gray-500">Following</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ My Stories */}
        {stories.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-10">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">My Stories</h2>
            </div>
            <div className="p-6 flex flex-wrap gap-6 justify-center sm:justify-start">
              {stories.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedItem(s);
                    setSelectedType("story");
                  }}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-500 shadow-md">
                    <img
                      src={s.image_url}
                      alt={s.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {s.caption && (
                    <p className="text-gray-600 text-sm mt-2 text-center truncate w-24">
                      {s.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ Posts Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Posts</h2>
          </div>

          <div className="p-6">
            {posts.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-gray-400 text-lg mb-2">No posts yet</div>
                <p className="text-gray-500 mb-4">
                  You haven't shared anything yet. Start creating your first post.
                </p>
                <button
                  className="px-5 py-2 bg-pink-500 text-white rounded-md text-sm hover:bg-pink-600 transition-all"
                  onClick={() => navigate("/create-post")}
                >
                  Create Post
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedItem(p);
                      setSelectedType("post");
                    }}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    {p.image_url && (
                      <img
                        src={p.image_url}
                        alt="Post"
                        className="w-full h-60 object-cover"
                      />
                    )}
                    <div className="p-4">
                      {p.content && (
                        <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                          {p.content}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {new Date(p.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ✅ Followers Modal */}
        {showFollowers && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setShowFollowers(false)}
          >
            <div
              className="bg-white rounded-2xl w-[90%] sm:w-[400px] max-h-[70vh] overflow-y-auto shadow-2xl relative p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowFollowers(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Followers
              </h3>
              {followers.length === 0 ? (
                <p className="text-gray-500 text-center">No followers yet</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {followers.map((f) => (
                    <li
                      key={f.id}
                      className="py-3 px-2 hover:bg-gray-50 cursor-pointer rounded-md flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 flex items-center justify-center text-white font-medium">
                        {f.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-700 font-medium">
                        {f.username}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* ✅ Following Modal */}
        {showFollowing && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setShowFollowing(false)}
          >
            <div
              className="bg-white rounded-2xl w-[90%] sm:w-[400px] max-h-[70vh] overflow-y-auto shadow-2xl relative p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowFollowing(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Following
              </h3>
              {following.length === 0 ? (
                <p className="text-gray-500 text-center">
                  Not following anyone yet
                </p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {following.map((f) => (
                    <li
                      key={f.id}
                      className="py-3 px-2 hover:bg-gray-50 cursor-pointer rounded-md flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 flex items-center justify-center text-white font-medium">
                        {f.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-700 font-medium">
                        {f.username}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* ✅ Story / Post Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="bg-white rounded-2xl w-[90%] sm:w-[420px] md:w-[460px] overflow-hidden shadow-2xl relative transform scale-95 transition-all duration-200 hover:scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-semibold"
              >
                ✕
              </button>

              {selectedType === "story" ? (
                <div className="flex flex-col items-center p-5">
                  <div className="w-[250px] h-[250px] rounded-xl overflow-hidden shadow-md bg-gray-100">
                    <img
                      src={selectedItem.image_url}
                      alt={selectedItem.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedItem.caption && (
                    <p className="text-gray-700 text-center mt-4 text-sm px-2">
                      {selectedItem.caption}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center p-5">
                  {selectedItem.image_url && (
                    <div className="w-[300px] h-[200px] rounded-xl overflow-hidden shadow-md bg-gray-100 mb-4">
                      <img
                        src={selectedItem.image_url}
                        alt="Post"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {selectedItem.content && (
                    <p className="text-gray-700 mb-3 text-center text-sm leading-relaxed px-3">
                      {selectedItem.content}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 text-right w-full pr-3">
                    {new Date(selectedItem.created_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
