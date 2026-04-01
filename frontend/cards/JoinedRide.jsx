import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { BASE_URL, API_PATHS } from "../utils/Apipath";
import { socket } from "../src/socket";
import { AuthContext } from "../context/AuthContext";
import RideMap from "../components/RideMap";
import { FiSend, FiX } from "react-icons/fi";

function JoinedRide() {
  const { user } = useContext(AuthContext);

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeChatRideId, setActiveChatRideId] = useState(null);
  const [messages, setMessages] = useState({});
  const [text, setText] = useState("");

  const [joining, setJoining] = useState(false);

  
  const fetchRides = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/ride/user/joined`, {
        withCredentials: true,
      });

      setRides(data.rides);

      const msgMap = {};
      data.rides.forEach((r) => {
        msgMap[r._id] = r.comments || [];
      });
      setMessages(msgMap);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  useEffect(() => {
    if (!activeChatRideId) return;

    socket.emit("joinRide", activeChatRideId);

    socket.on("newMessage", (data) => {
      setMessages((prev) => {
        const rideMsgs = prev[activeChatRideId] || [];

        const exists = rideMsgs.find(
          (msg) =>
            msg.text === data.message.text && msg.userId === data.message.userId
        );

        if (exists) return prev;

        return {
          ...prev,
          [activeChatRideId]: [...rideMsgs, data.message],
        };
      });
    });

    return () => socket.off("newMessage");
  }, [activeChatRideId]);

  const sendMessage = async () => {
    if (!text.trim() || !activeChatRideId) return;

    try {
      await axios.post(
        `${BASE_URL}/ride/comment/${activeChatRideId}`,
        { text },
        { withCredentials: true }
      );

      setText("");
    } catch (error) {
      console.error(error);
    }
  };

  
  const handleLeaveRide = async (rideId) => {
    try {
      setJoining(true);

      const { data } = await axios.post(
        `${BASE_URL}${API_PATHS.RIDE.LEAVE(rideId)}`,
        {},
        { withCredentials: true }
      );

      if (data.success) {
   
        setRides((prev) => prev.filter((r) => r._id !== rideId));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (rides.length === 0)
    return <div className="text-center mt-10">No joined rides</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {rides.map((ride) => (
        <div
          key={ride._id}
          className="bg-white rounded-xl shadow overflow-hidden"
        >
      
          <RideMap ride={ride} />

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

            <div className="flex gap-3">
              <button
                onClick={() => handleLeaveRide(ride._id)}
                disabled={joining}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                {joining ? "Please wait..." : "Leave Ride"}
              </button>

              <button
                onClick={() =>
                  setActiveChatRideId(
                    activeChatRideId === ride._id ? null : ride._id
                  )
                }
                className="flex-1 border px-4 py-2 rounded"
              >
                {activeChatRideId === ride._id ? "Close Chat" : "Open Chat"}
              </button>
            </div>

            {activeChatRideId === ride._id && (
              <div className="mt-4 border rounded-lg flex flex-col h-80">
                <div className="flex justify-between p-2 border-b">
                  <span>Ride Chat</span>
                  <button onClick={() => setActiveChatRideId(null)}>
                    <FiX />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {(messages[ride._id] || []).map((msg, i) => (
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

                <div className="p-2 border-t flex gap-2">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 border px-2 py-1 rounded"
                  />

                  <button
                    onClick={sendMessage}
                    className="bg-amber-500 text-white px-3 rounded"
                  >
                    <FiSend />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default JoinedRide;
