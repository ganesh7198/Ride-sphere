import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { BASE_URL, API_PATHS } from "../utils/Apipath";
import { socket } from "../src/socket";
import { AuthContext } from "../context/AuthContext";

import {  FiSend, FiX } from "react-icons/fi";

function DetailedRideCard() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const [joining, setJoining] = useState(false);

  // 🔥 Fetch Ride
  useEffect(() => {
    fetchRide();
  }, [id]);

  const fetchRide = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}${API_PATHS.RIDE.GET_SINGLE(id)}`,
        { withCredentials: true }
      );

      setRide(data.ride);

      // ✅ Load old messages
      setMessages(data.ride.comments || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SOCKET
  useEffect(() => {
    if (!ride?._id) return;

    socket.emit("joinRide", ride._id);

    socket.on("newMessage", (data) => {
      setMessages((prev) => {
        const exists = prev.find(
          (msg) =>
            msg.text === data.message.text && msg.userId === data.message.userId
        );
        if (exists) return prev;

        return [...prev, data.message];
      });
    });

    return () => socket.off("newMessage");
  }, [ride]);

  // 🔥 SEND MESSAGE
  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      await axios.post(
        `${BASE_URL}/ride/comment/${ride._id}`,
        { text },
        { withCredentials: true }
      );

      setText("");
    } catch (error) {
      console.error(error);
    }
  };
  const handleLeaveRide = async () => {
    try {
      setJoining(true);

      const { data } = await axios.post(
        `${BASE_URL}${API_PATHS.RIDE.LEAVE(ride._id)}`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        // ✅ remove user from joinedRiders
        setRide((prev) => ({
          ...prev,
          joinedRiders: prev.joinedRiders.filter((r) => r._id !== user._id),
        }));
      }
    } catch (error) {
      console.error("Leave error:", error);
    } finally {
      setJoining(false);
    }
  };

  // 🔥 JOIN RIDE
  const handleJoinRide = async () => {
    try {
      setJoining(true);

      const { data } = await axios.post(
        `${BASE_URL}${API_PATHS.RIDE.JOIN(ride._id)}`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
        setRide((prev) => ({
          ...prev,
          joinedRiders: [...prev.joinedRiders, user],
        }));
      }
    } catch (error) {
      console.error("Join error:", error);
    } finally {
      setJoining(false);
    }
  };

  // 🔥 CHECK JOINED
  const isJoined = ride?.joinedRiders?.some((r) => r._id === user?._id);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!ride) return <div className="text-center mt-10">Ride not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 flex gap-6">
      {/* LEFT SIDE */}
      <div className={showChat ? "flex-1" : "w-full"}>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <img src={ride.rideImage} className="w-full h-64 object-cover" />

          <div className="p-4 space-y-3">
            <h1 className="text-xl font-bold">{ride.tittle}</h1>

            <p className="text-gray-600">
              {ride.startLocation?.address} → {ride.destination?.address}
            </p>

            <div className="flex gap-4 text-sm text-gray-500">
              <span>📏 {ride.distanceInKm?.toFixed(1)} km</span>
              <span>⏱ {Math.round(ride.estimatedDuration)} mins</span>
              <span>
                👥 {ride.joinedRiders?.length}/{ride.maxRiders}
              </span>
            </div>

            <p className="text-gray-500">
              📅 {new Date(ride.rideDate).toDateString()}
            </p>

            <p>{ride.description}</p>

            {/* 🔥 BUTTONS */}
            <div className="flex gap-3">
              {/* JOIN BUTTON */}
              <button
                onClick={isJoined ? handleLeaveRide : handleJoinRide}
                disabled={joining}
                className={`flex-1 px-4 py-2 rounded transition
    ${
      isJoined
        ? "bg-red-500 hover:bg-red-600 text-white"
        : "bg-amber-500 hover:bg-amber-600 text-white"
    }`}
              >
                {joining
                  ? "Please wait..."
                  : isJoined
                  ? "Leave Ride"
                  : "Join Ride"}
              </button>

              {/* CHAT BUTTON */}
              <button
                onClick={() => setShowChat(!showChat)}
                className="flex-1 border px-4 py-2 rounded"
              >
                {showChat ? "Close Chat" : "Open Chat"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT CHAT */}
      {showChat && (
        <div className="w-96">
          <div className="bg-white h-[80vh] flex flex-col rounded-xl shadow">
            {/* HEADER */}
            <div className="flex justify-between p-3 border-b">
              <span>Ride Chat</span>
              <button onClick={() => setShowChat(false)}>
                <FiX />
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((msg, i) => (
                <div key={i} className="bg-gray-100 p-2 rounded">
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs text-gray-400">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString()
                      : ""}
                  </p>
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className="p-3 border-t flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type message..."
                className="flex-1 border px-3 py-1 rounded"
              />

              <button
                onClick={sendMessage}
                className="bg-amber-500 text-white px-3 rounded"
              >
                <FiSend />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailedRideCard;
