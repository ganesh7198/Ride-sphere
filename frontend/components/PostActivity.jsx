import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:2000/api/v1";

function PostActivity() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingPostId, setEditingPostId] = useState(null);
  const [editText, setEditText] = useState("");

  // 🔥 Fetch posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/post/allpostbyuser`, {
        withCredentials: true,
      });
      setPosts(res.data.userPost);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // 🔥 Delete
  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await axios.delete(`${BASE_URL}/post/delete/${postId}`, {
        withCredentials: true,
      });

      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 Start Edit
  const handleEditClick = (post) => {
    setEditingPostId(post._id);
    setEditText(post.text); // ✅ FIXED
  };

  // 🔥 Update
  const handleUpdate = async (postId) => {
    try {
      await axios.post(
        `${BASE_URL}/post/updatepost/${postId}`,
        { text: editText },
        { withCredentials: true }
      );

      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, text: editText } : p))
      );

      setEditingPostId(null);
      setEditText("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="space-y-5">
      {loading ? (
        <p className="text-gray-500">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 text-center">No posts found</p>
      ) : (
        posts.map((post) => {
          const isEditing = editingPostId === post._id;

          return (
            <div
              key={post._id}
              className={`p-4 border rounded-2xl shadow-sm transition ${
                isEditing ? "border-blue-500 bg-blue-50" : "bg-white"
              }`}
            >
              {/* 🖼️ Image Preview */}
              {post.img && (
                <img
                  src={post.img}
                  alt="post"
                  className="w-full h-60 object-cover rounded-lg mb-3"
                />
              )}

              {/* 📝 Text */}
              <p className="text-gray-800">{post.text}</p>

              {/* ❤️ Likes + 💬 Comments */}
              <div className="flex gap-4 text-sm text-gray-500 mt-2">
                <span>❤️ {post.likes.length} likes</span>
                <span>💬 {post.comment.length} comments</span>
              </div>

              {/* 🔘 Buttons */}
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleEditClick(post)}
                  className="text-blue-500 text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>

              {/* ✏️ Edit Section */}
              {isEditing && (
                <div className="mt-4 border-t pt-3">
                  <p className="text-xs text-blue-600 mb-1">
                    Editing this post
                  </p>

                  {/* show image while editing */}
                  <div className="max-h-100 overflow-hidden relative">
                    <img
                      src={post.img}
                      className="w-full max-h-[400px] object-contain bg-gray-100 rounded mb-2"
                    />
                    <button className="absolute bottom-2 right-2 bg-black text-white px-2 py-1 text-xs rounded">
                      View Full
                    </button>
                  </div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full border p-2 rounded mb-2"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(post._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingPostId(null)}
                      className="text-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default PostActivity;
