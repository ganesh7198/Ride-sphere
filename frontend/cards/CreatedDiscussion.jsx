import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/Apipath";
import { FiMessageCircle, FiThumbsUp, FiThumbsDown } from "react-icons/fi";

function CreatedDiscussion() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCommentsId, setOpenCommentsId] = useState(null);

  const fetchDiscussions = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/discussion/user/discussion`,
        { withCredentials: true }
      );

      setDiscussions(data.discussions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const handleDelete = async (discussionId) => {
    try {
      await axios.delete(`${BASE_URL}/discussion/${discussionId}`, {
        withCredentials: true,
      });

      setDiscussions((prev) => prev.filter((d) => d._id !== discussionId));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {discussions.map((d) => (
        <div
          key={d._id}
          className="bg-white shadow rounded-xl p-4 space-y-3"
        >
         
          <h1 className="text-lg font-bold">{d.title}</h1>

      
          <p className="text-gray-600">{d.description}</p>

      
          {d.img && (
            <img
              src={d.img}
              alt="discussion"
              className="w-full h-60 object-cover rounded"
            />
          )}

          <div className="flex items-center gap-6 text-gray-500 text-sm">

            
            <div className="flex items-center gap-1">
              <FiThumbsUp />
              <span>{d.upvotes?.length || 0}</span>
            </div>

          
            <div className="flex items-center gap-1">
              <FiThumbsDown />
              <span>{d.downvotes?.length || 0}</span>
            </div>

            
            <button
              onClick={() =>
                setOpenCommentsId(
                  openCommentsId === d._id ? null : d._id
                )
              }
              className="flex items-center gap-1"
            >
              <FiMessageCircle />
              <span>{d.comment?.length || 0}</span>
            </button>

            <button
              onClick={() => handleDelete(d._id)}
              className="text-red-500 ml-auto"
            >
              Delete
            </button>
          </div>

        
          {openCommentsId === d._id && (
            <div className="border-t pt-3 space-y-2">
              {d.comment?.length > 0 ? (
                d.comment.map((c) => (
                  <div key={c._id} className="bg-gray-100 p-2 rounded">
                    <p className="text-sm">{c.text}</p>
                    <p className="text-xs text-gray-400">
                      User: {c.user}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">
                  No comments yet
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CreatedDiscussion;