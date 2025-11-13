import React, { useEffect, useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import StorySection from "../components/StorySection";
import PostSection from "../components/PostSection";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [count, setCount] = useState(0);
  const [storyImage, setStoryImage] = useState("");
  const [storyCaption, setStoryCaption] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState("");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

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

  // === POST ===
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

  async function handleDeletePost(id) {
    if (!window.confirm("Yakin ingin hapus post ini?")) return;
    try {
      await API.deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setSelectedItem(null);
    } catch {
      alert("Gagal menghapus post.");
    }
  }

  async function handleUpdatePost(e) {
    e.preventDefault();
    try {
      await API.updatePost(selectedItem.id, {
        content: editContent,
        image_url: editImage || null,
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === selectedItem.id
            ? { ...p, content: editContent, image_url: editImage }
            : p
        )
      );
      setEditMode(false);
      setSelectedItem(null);
    } catch {
      alert("Gagal update post.");
    }
  }

  // === STORY ===
  async function submitStory(e) {
    e.preventDefault();
    if (!storyImage.trim()) return setError("Story harus punya gambar");
    try {
      await API.createStory(storyImage, storyCaption || "");
      const updatedStories = await API.getMyStories();
      setStories(updatedStories);
      setStoryImage("");
      setStoryCaption("");
    } catch (err) {
      setError(err.data?.error || "Gagal membuat story");
    }
  }

  // === FOLLOW / UNFOLLOW (untuk popup) ===
  async function handleToggleFollow(targetId, isCurrentlyFollowing) {
    try {
      if (isCurrentlyFollowing) {
        await API.unfollow(targetId);
      } else {
        await API.follow(targetId);
      }
      const updatedFollowers = await API.getFollowers();
      const updatedFollowing = await API.getFollowing();
      setFollowers(updatedFollowers);
      setFollowing(updatedFollowing);
    } catch (err) {
      console.error("Gagal ubah status follow:", err);
    }
  }

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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* === PROFILE HEADER === */}
        {user && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-semibold text-gray-800">
                  {user.username}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Joined{" "}
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <div className="flex justify-center sm:justify-start gap-10 mt-4">
                  <div>
                    <span className="font-bold">{posts.length}</span>
                    <div className="text-sm text-gray-500">Posts</div>
                  </div>
                  <div
                    className="cursor-pointer hover:text-pink-500"
                    onClick={() => setShowFollowers(true)}
                  >
                    <span className="font-bold">{followers.length}</span>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                  <div
                    className="cursor-pointer hover:text-pink-500"
                    onClick={() => setShowFollowing(true)}
                  >
                    <span className="font-bold">{following.length}</span>
                    <div className="text-sm text-gray-500">Following</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === COMPONENTS === */}
        <StorySection
          storyImage={storyImage}
          setStoryImage={setStoryImage}
          storyCaption={storyCaption}
          setStoryCaption={setStoryCaption}
          stories={stories}
          setStories={setStories}
          setSelectedItem={setSelectedItem}
          setSelectedType={setSelectedType}
          submitStory={submitStory}
        />

        <PostSection
          posts={posts}
          setPosts={setPosts}
          content={content}
          setContent={setContent}
          image={image}
          setImage={setImage}
          count={count}
          setCount={setCount}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          editMode={editMode}
          setEditMode={setEditMode}
          editContent={editContent}
          setEditContent={setEditContent}
          editImage={editImage}
          setEditImage={setEditImage}
          submitPost={submitPost}
          handleDeletePost={handleDeletePost}
          handleUpdatePost={handleUpdatePost}
        />

        {/* === MODAL FOLLOWERS === */}
        {showFollowers && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-80 max-h-[80vh] overflow-y-auto shadow-lg relative">
              <button
                onClick={() => setShowFollowers(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-lg font-semibold mb-4 text-center">
                Followers
              </h2>
              {followers.length > 0 ? (
                followers.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between border-b border-gray-100 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-400 to-yellow-400 flex items-center justify-center text-white font-semibold">
                        {f.username.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-gray-700">{f.username}</p>
                    </div>
                    <button
                      onClick={() => handleToggleFollow(f.id, true)}
                      className="text-xs px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                    >
                      Unfollow
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm">
                  Belum ada followers.
                </p>
              )}
            </div>
          </div>
        )}

        {/* === MODAL FOLLOWING === */}
        {showFollowing && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-80 max-h-[80vh] overflow-y-auto shadow-lg relative">
              <button
                onClick={() => setShowFollowing(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-lg font-semibold mb-4 text-center">
                Following
              </h2>
              {following.length > 0 ? (
                following.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between border-b border-gray-100 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                        {f.username.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-gray-700">{f.username}</p>
                    </div>
                    <button
                      onClick={() => handleToggleFollow(f.id, true)}
                      className="text-xs px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
                    >
                      Unfollow
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm">
                  Belum mengikuti siapa pun.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
