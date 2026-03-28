import { useEffect, useState, useMemo } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:2000/api/v1";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (let i = 0; i < intervals.length; i++) {
      const interval = Math.floor(seconds / intervals[i].seconds);
      if (interval >= 1) {
        return `${interval} ${intervals[i].label}${
          interval > 1 ? "s" : ""
        } ago`;
      }
    }

    return "just now";
  };
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/notification/all`, {
        withCredentials: true,
      });
      setNotifications(res.data.notifications);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);


  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/notification/delete/${id}`, {
        withCredentials: true,
      });

      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const groupedNotifications = useMemo(() => {
    const grouped = {};

    notifications.forEach((n) => {
      const key = `${n.type}-${n.sender._id}-${n.ride?._id || ""}`;

      if (!grouped[key]) {
        grouped[key] = { ...n, count: 1 };
      } else {
        grouped[key].count += 1;
      }
    });

    return Object.values(grouped);
  }, [notifications]);

  const getMessage = (n) => {
    if (n.type === "like_the_post") {
      return `${n.sender.username} liked your post ${
        n.count > 1 ? `${n.count} times` : ""
      }`;
    }

    if (n.type === "ride_join") {
      return `${n.sender.username} joined your ride "${n.ride?.tittle}"`;
    }

    if (n.type === "ride_leave") {
      return `${n.sender.username} left your ride "${n.ride?.tittle}"`;
    }

    return "New notification";
  };

  return (
    <div className="max-w-xl mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : groupedNotifications.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No notifications</p>
      ) : (
        <div className="space-y-3">
          {groupedNotifications.map((n) => (
            <div
              key={n._id}
              className={`flex items-start gap-3 p-4 rounded-2xl border shadow-sm hover:shadow-md transition ${
                !n.isRead ? "bg-blue-50 border-blue-200" : "bg-white"
              }`}
            >
              <img
                src={n.sender.profileImg || "https://via.placeholder.com/40"}
                alt="user"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {getMessage(n)}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {timeAgo(n.createdAt)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(n._id)}
                className="text-red-500 text-xs hover:underline"
              >
                Delete
              </button>
              {!n.isRead && (
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;
