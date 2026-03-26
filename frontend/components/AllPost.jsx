import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/Apipath";
import { AuthContext } from "../context/AuthContext";
import { FiHeart, FiMessageCircle } from "react-icons/fi";

function AllPost() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch all posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/post/allpost`, {
        withCredentials: true,
      });

      const fixed = data.posts.map((p) => ({
        ...p,
        comments: p.comment || [],
        likes: p.likes || [],
      }));

      setPosts(fixed);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ❤️ Like / Unlike
  const handleLike = async (e, postId) => {
    e.stopPropagation(); // 🚫 prevent navigation

    const post = posts.find((p) => p._id === postId);
   const isLiked = post.likes.some(
     (like) =>
       like?._id?.toString() === user?._id?.toString() ||
       like?.toString() === user?._id?.toString()
   );

    // 🔥 instant UI update
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              likes: isLiked
                ? p.likes.filter((id) => id !== user._id)
                : [...p.likes, user._id],
            }
          : p
      )
    );

    try {
      await axios.post(
        `${BASE_URL}/post/likepost/${postId}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {posts.map((post) => {
       const isLiked = post.likes.some(
         (like) =>
           like?._id?.toString() === user?._id?.toString() ||
           like?.toString() === user?._id?.toString()
       );

        return (
          <div
            key={post._id}
            onClick={() => navigate(`post/${post._id}`)}
            className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-md transition"
          >
            {/* USER */}
            <div className="flex items-center gap-2 mb-2">
              <img
                src={post.user?.profileImg || "/default-avatar.png"}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">{post.user?.username}</span>
            </div>

            {/* TEXT */}
            <p className="text-sm mb-2">{post.text}</p>

            {/* IMAGE */}
            {post.img && (
              <img
                src={post.img}
                className="w-full max-h-[400px] object-contain bg-gray-100 rounded mb-2"
              />
            )}

            {/* ACTIONS */}
            <div className="flex gap-4">
              <button
                onClick={(e) => handleLike(e, post._id)}
                className={`flex items-center gap-1 ${
                  isLiked ? "text-red-500" : "text-gray-600"
                }`}
              >
                <FiHeart className={isLiked ? "fill-red-500" : ""} />
                {post.likes.length}
              </button>

              <div className="flex items-center gap-1 text-gray-600">
                <FiMessageCircle />
                {post.comments.length}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AllPost;
