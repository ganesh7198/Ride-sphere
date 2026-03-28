import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiArrowUp, FiUser, FiMessageCircle } from "react-icons/fi";

const BASE_URL = "http://localhost:2000/api/v1";

function DetailedDiscussion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const commentEndRef = useRef(null);

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  const fetchDiscussion = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/discussion/singlediscussion/${id}`,
        { withCredentials: true }
      );
      setDiscussion(data.discussion);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ AUTO SCROLL TO NEW COMMENT
  useEffect(() => {
    commentEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [discussion?.comment]);

  // ✅ CHECK IF USER UPVOTED
  const isUpvoted = discussion?.upvotes?.includes(user?._id);

  // ✅ UPVOTE
  const handleUpvote = async () => {
    if (!user) return alert("Login required");

    try {
      const { data } = await axios.post(
        `${BASE_URL}/discussion/${id}/upvote`,
        {},
        { withCredentials: true }
      );

      setDiscussion((prev) => ({
        ...prev,
        upvotes: data.upvotes,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ COMMENT
  const handleComment = async () => {
    if (!text.trim()) return;
    if (!user) return alert("Login required");

    setSubmitting(true);

    try {
      const { data } = await axios.post(
        `${BASE_URL}/discussion/${id}/comment`, // ✅ FIXED URL
        { text },
        { withCredentials: true }
      );

      // instant UI update
      setDiscussion((prev) => ({
        ...prev,
        comment: [...prev.comment, data.comment],
      }));

      setText("");
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-10 w-10 border-2 border-orange-500 border-b-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!discussion) {
    return <p className="text-center mt-10">Discussion not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* DISCUSSION */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex gap-3">
          {/* UPVOTE */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleUpvote}
              className={`transition ${
                isUpvoted
                  ? "text-orange-500"
                  : "text-gray-400 hover:text-orange-500"
              }`}
            >
              <FiArrowUp size={24} />
            </button>
            <span className="font-bold">
              {discussion.upvotes?.length || 0}
            </span>
          </div>

          {/* CONTENT */}
          <div className="flex-1">
            {/* USER */}
            <div
              onClick={() =>
                navigate(`/home/profile/${discussion.creator._id}`)
              }
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-orange-500"
            >
              {discussion.creator?.profileImg ? (
                <img
                  src={discussion.creator.profileImg}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <FiUser />
              )}
              <span>{discussion.creator?.username}</span>
            </div>

            {/* TITLE */}
            <h1 className="text-xl font-bold mt-2">
              {discussion.title}
            </h1>

            {/* DESCRIPTION */}
            {discussion.description && (
              <p className="text-gray-600 mt-2">
                {discussion.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* COMMENT INPUT */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 border px-3 py-2 rounded-lg"
          />
          <button
            onClick={handleComment}
            disabled={submitting}
            className="bg-orange-500 text-white px-4 rounded-lg disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>

      {/* COMMENTS */}
      <div className="space-y-4">
        <h2 className="font-semibold text-gray-700 flex items-center gap-2">
          <FiMessageCircle />
          {discussion.comment?.length || 0} Comments
        </h2>

        {discussion.comment?.map((c) => (
          <div
            key={c._id}
            className="bg-white p-4 rounded-lg shadow-sm transition hover:shadow-md"
          >
            {/* USER */}
            <div
              onClick={() => navigate(`/home/profile/${c.user._id}`)}
              className="flex items-center gap-2 cursor-pointer mb-2"
            >
              {c.user?.profileImg ? (
                <img
                  src={c.user.profileImg}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <FiUser />
              )}
              <span className="text-sm font-medium hover:text-orange-500">
               {c.user?.username}
              </span>
            </div>

            {/* TEXT */}
            <p className="text-gray-700 text-sm">{c.text}</p>
          </div>
        ))}

        {/* scroll target */}
        <div ref={commentEndRef} />
      </div>
    </div>
  );
}

export default DetailedDiscussion;