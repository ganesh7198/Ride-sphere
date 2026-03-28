import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FiMessageCircle,
  FiUser,
  FiClock,
} from "react-icons/fi";

const BASE_URL = "http://localhost:2000/api/v1";

function AllDiscussion() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscussions();
  },[]);

  const fetchDiscussions = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/discussion/all`, {
        withCredentials: true,
      });

      setDiscussions(data.discussions);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (let key in intervals) {
      const val = Math.floor(seconds / intervals[key]);
      if (val >= 1) return `${val} ${key}${val > 1 ? "s" : ""} ago`;
    }
    return "just now";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-10 w-10 border-2 border-orange-500 border-b-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-4">
      {discussions.map((d) => {
        

        return (
          <div key={d._id} className="bg-white rounded-lg shadow-sm flex">
           
            {/* CONTENT */}
            <div
              onClick={() => navigate(`discussion/${d._id}`)}
              className="flex-1 p-4 cursor-pointer"
            >
              {/* USER */}
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/home/profile/${d.creator._id}`);
                  }}
                  className="flex items-center gap-1 cursor-pointer hover:text-orange-500"
                >
                  {d.creator?.profileImg ? (
                    <img
                      src={d.creator.profileImg}
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <FiUser size={12} />
                  )}
                  <span className="font-medium">{d.creator?.username}</span>
                </div>

                <span>•</span>

                <div className="flex items-center gap-1">
                  <FiClock size={10} />
                  {timeAgo(d.createdAt)}
                </div>
              </div>

              {/* TITLE */}
              <h2 className="font-semibold text-gray-900 mb-1">{d.title}</h2>

              {/* DESCRIPTION */}
              {d.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {d.description}
                </p>
              )}

              {/* COMMENTS */}
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <FiMessageCircle size={14} />
                {d.comment?.length || 0} comments
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AllDiscussion;
