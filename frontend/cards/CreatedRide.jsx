import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/Apipath";
import { socket } from "../src/socket";
import { AuthContext } from "../context/AuthContext";
import RideMap from "../components/RideMap";
import { FiSend, FiX } from "react-icons/fi";

function CreatedRide() {
  const { user } = useContext(AuthContext);

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeChatRideId, setActiveChatRideId] = useState(null);
  const [messages, setMessages] = useState({});
  const [text, setText] = useState("");

  const [editingRideId, setEditingRideId] = useState(null);
  const [editForm, setEditForm] = useState({});

 
  const fetchRides = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/ride/user/created`, {
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

    

    socket.on("newMessage", (data) => {
      setMessages((prev) => {
        const rideMsgs = prev[activeChatRideId] || [];

        return {
          ...prev,
          [activeChatRideId]: [...rideMsgs, data.message],
        };
      });
    });

    return () => socket.off("newMessage");
  }, [activeChatRideId]);

  
  const sendMessage = async () => {
    if (!text.trim()) return;

    await axios.post(
      `${BASE_URL}/ride/comment/${activeChatRideId}`,
      { text },
      { withCredentials: true }
    );

    setText("");
  };


  const handleDelete = async (rideId) => {
    try {
      await axios.delete(`${BASE_URL}/ride/delete/${rideId}`, {
        withCredentials: true,
      });

      setRides((prev) => prev.filter((r) => r._id !== rideId));
    } catch (err) {
      console.error(err);
    }
  };


  const handleEdit = (ride) => {
    setEditingRideId(ride._id);
    setEditForm({
      tittle: ride.tittle,
      description: ride.description,
      maxRiders: ride.maxRiders,
      rideType: ride.rideType,
      rideDate: ride.rideDate.slice(0, 10),
    });
  };

  
  const handleUpdate = async (rideId) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/ride/update/${rideId}`,
        editForm,
        { withCredentials: true }
      );

      setRides((prev) => prev.map((r) => (r._id === rideId ? data.ride : r)));

      setEditingRideId(null);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {rides.map((ride) => (
        <div key={ride._id} className="flex gap-4">
      
          <div className="flex-1 bg-white rounded-xl shadow overflow-hidden">
            <RideMap ride={ride} />

            <div className="p-4 space-y-3">
              {editingRideId === ride._id ? (
                <>
                  <input
                    value={editForm.tittle}
                    onChange={(e) =>
                      setEditForm({ ...editForm, tittle: e.target.value })
                    }
                    className="border p-2 w-full"
                  />

                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="border p-2 w-full"
                  />

                  <input
                    type="number"
                    value={editForm.maxRiders}
                    onChange={(e) =>
                      setEditForm({ ...editForm, maxRiders: e.target.value })
                    }
                    className="border p-2 w-full"
                  />

                  <button
                    onClick={() => handleUpdate(ride._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h1 className="text-xl font-bold">{ride.tittle}</h1>

                  <p className="text-gray-600">
                    {ride.startLocation?.address} → {ride.destination?.address}
                  </p>

                  <p>{ride.description}</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(ride)}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(ride._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() =>
                        setActiveChatRideId(
                          activeChatRideId === ride._id ? null : ride._id
                        )
                      }
                      className="border px-4 py-2 rounded"
                    >
                      Chat
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

         
          {activeChatRideId === ride._id && (
            <div className="w-96 bg-white rounded-xl shadow flex flex-col h-[500px]">
              <div className="flex justify-between p-3 border-b">
                <span>Ride Chat</span>
                <button onClick={() => setActiveChatRideId(null)}>
                  <FiX />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {(messages[ride._id] || []).map((msg, i) => (
                  <div key={i} className="bg-gray-100 p-2 rounded">
                    <p className="text-sm">{msg.text}</p>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
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
      ))}
    </div>
  );
}

export default CreatedRide;
