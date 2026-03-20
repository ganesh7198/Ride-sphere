import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, API_PATHS } from "../utils/Apipath";

function DetailedRideCard() {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error("Error fetching ride:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!ride) {
    return <div className="text-center mt-10">Ride not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl">
  
      <img
        src={ride.rideImage}
        alt="ride"
        className="w-full h-64 object-cover rounded-lg"
      />

    
      <div className="flex items-center gap-3 mt-4">
        <img
          src={ride.createdBy?.profileImg || "/default-avatar.png"}
          className="h-10 w-10 rounded-full"
        />
        <span className="font-semibold">
          {ride.createdBy?.username || "Unknown"}
        </span>
      </div>

      
      <h1 className="text-2xl font-bold mt-4">{ride.tittle}</h1>

     
      <p className="text-gray-600 mt-2">
        {ride.startLocation?.address} → {ride.destination?.address}
      </p>

   
      <div className="flex gap-6 mt-4 text-gray-500">
        <span>📏 {ride.distanceInKm?.toFixed(1)} km</span>
        <span>⏱ {Math.round(ride.estimatedDuration)} mins</span>
        <span>
          👥 {ride.joinedRiders?.length}/{ride.maxRiders}
        </span>
      </div>

     
      <p className="mt-2 text-gray-500">
        📅 {new Date(ride.rideDate).toDateString()}
      </p>

      
      <span className="inline-block mt-3 bg-amber-100 text-amber-600 px-3 py-1 rounded">
        {ride.rideType}
      </span>

   
      <p className="mt-4">{ride.description}</p>

   
      <div className="mt-6 flex gap-4">
        <button className="bg-amber-500 text-white px-4 py-2 rounded">
          Join Ride
        </button>

        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Leave Ride
        </button>
      </div>
    </div>
  );
}

export default DetailedRideCard;
