import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../utils/Apipath";
import { AuthContext } from "../context/AuthContext";
import {
  FiHeart,
  FiMessageCircle,
  FiX,
  FiTrash2,
  FiSend,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

function PostSection() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [likingPostId, setLikingPostId] = useState(null);
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/post/getsinglepost/${id}`,
          { withCredentials: true }
        );

        const post = data.post;

        const fixedPost = {
          ...post,
          comments: post.comment || post.comments || [],
          likes: post.likes || [],
        };

        setPosts([fixedPost]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async (postId) => {
    if (likingPostId === postId) return;

    const originalPosts = [...posts];

    setPosts((prev) =>
      prev.map((p) => {
        if (p._id === postId) {
          const isLiked = p.likes.some(
            (like) =>
              like?._id?.toString() === user?._id?.toString() ||
              like?.toString() === user?._id?.toString()
          );
          return {
            ...p,
            likes: isLiked
              ? p.likes.filter((id) => id?.toString() !== user?._id?.toString())
              : [...p.likes, user._id],
          };
        }
        return p;
      })
    );

    try {
      setLikingPostId(postId);
      await axios.post(
        `${BASE_URL}/post/likepost/${postId}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
      setPosts(originalPosts);
    } finally {
      setLikingPostId(null);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) return;

    const tempId = Date.now();

    const tempComment = {
      _id: tempId,
      text: commentText,
      user: {
        _id: user._id,
        username: user.username,
        profileImg: user.profileImg,
      },
      createdAt: new Date(),
    };

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, comments: [...p.comments, tempComment] } : p
      )
    );

    setCommentText("");

    try {
      const { data } = await axios.post(
        `${BASE_URL}/post/comment/${postId}`,
        { text: tempComment.text },
        { withCredentials: true }
      );

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                comments: p.comments.map((c) =>
                  c._id === tempId ? data.comment : c
                ),
              }
            : p
        )
      );
    } catch (err) {
      console.log(err);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                comments: p.comments.filter((c) => c._id !== tempId),
              }
            : p
        )
      );
    }
  };

  const handleDelete = async (postId, commentId) => {
    const originalPosts = [...posts];

    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId
          ? {
              ...p,
              comments: p.comments.filter((c) => c._id !== commentId),
            }
          : p
      )
    );

    try {
      await axios.delete(
        `${BASE_URL}/post/deletecomment/${postId}/${commentId}`,
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
      setPosts(originalPosts);
    }
  };

  const handleUserClick = (userId, e) => {
    e.stopPropagation();
    if (userId) {
      navigate(`/home/profile/${userId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {posts.map((post) => {
        const isLiked = post.likes?.some(
          (like) =>
            like?._id?.toString() === user?._id?.toString() ||
            like?.toString() === user?._id?.toString()
        );

        const showComments = activeCommentPost === post._id;

        return (
          <div key={post._id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={(e) => handleUserClick(post.user?._id, e)}
                className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
              >
                <img
                  src={post.user?.profileImg || "/default-avatar.png"}
                  className="w-10 h-10 rounded-full object-cover border"
                  alt={post.user?.username}
                />
                <span className="font-medium text-gray-900 hover:underline">
                  {post.user?.username}
                </span>
              </button>
            </div>

            <p className="mt-2 text-gray-800 text-sm">{post.text}</p>

            {post.img && (
              <img
                src={post.img}
                className="mt-2 w-full max-h-96 object-contain bg-gray-50 rounded"
                alt=""
              />
            )}

            <div className="flex gap-4 mt-3">
              <button
                onClick={() => handleLike(post._id)}
                className="flex items-center gap-1 transition"
              >
                <FiHeart
                  size={18}
                  className={
                    isLiked ? "text-red-500 fill-red-500" : "text-gray-600"
                  }
                />
                <span className="text-sm text-gray-600">
                  {post.likes.length}
                </span>
              </button>

              <button
                onClick={() =>
                  setActiveCommentPost(showComments ? null : post._id)
                }
                className="flex items-center gap-1 transition"
              >
                <FiMessageCircle size={18} className="text-gray-600" />
                <span className="text-sm text-gray-600">
                  {post.comments.length}
                </span>
              </button>
            </div>

            {/* COMMENTS SECTION */}
            <AnimatePresence>
              {showComments && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 border-t pt-3"
                >
                  {/* Comments List */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {post.comments.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-2">
                        No comments yet
                      </p>
                    ) : (
                      post.comments.map((c) => {
                        const userData = c.user || {};
                        const userId = userData._id || c.user;
                        const isOwner =
                          userId?.toString() === user?._id?.toString();
                        const commentDate = c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : null;

                        return (
                          <div
                            key={c._id}
                            className="flex justify-between items-start gap-2"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {!isOwner && userId ? (
                                  <button
                                    onClick={(e) => handleUserClick(userId, e)}
                                    className="flex items-center gap-2 hover:opacity-80 transition"
                                  >
                                    <img
                                      src={
                                        userData.profileImg ||
                                        "/default-avatar.png"
                                      }
                                      className="w-6 h-6 rounded-full object-cover"
                                      alt={userData.username}
                                    />
                                    <span className="text-xs font-semibold text-gray-700 hover:underline">
                                      {userData.username || "User"}
                                    </span>
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={
                                        userData.profileImg ||
                                        "/default-avatar.png"
                                      }
                                      className="w-6 h-6 rounded-full object-cover"
                                      alt={userData.username}
                                    />
                                    <span
                                      onClick={(e) =>
                                        handleUserClick(userId, e)
                                      }
                                      className="text-xs font-semibold text-gray-700"
                                    >
                                      {isOwner
                                        ? "You"
                                        : userData.username || "User"}
                                    </span>
                                  </div>
                                )}
                                {commentDate && (
                                  <span className="text-xs text-gray-400">
                                    {commentDate}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-800">{c.text}</p>
                            </div>

                            {isOwner && (
                              <button
                                onClick={() => handleDelete(post._id, c._id)}
                                className="text-red-400 hover:text-red-600 transition"
                                title="Delete comment"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleComment(post._id)
                      }
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Write a comment..."
                    />
                    <button
                      onClick={() => handleComment(post._id)}
                      disabled={!commentText.trim()}
                      className={`px-3 rounded-lg transition ${
                        !commentText.trim()
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-amber-500 hover:bg-amber-600 text-white"
                      }`}
                    >
                      <FiSend size={16} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default PostSection;
