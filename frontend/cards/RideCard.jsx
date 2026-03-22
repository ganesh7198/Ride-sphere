import { useNavigate } from "react-router-dom";
import RideMap from "../components/RideMap";

function RideCard({ ride }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
      {/* 🗺️ Map */}
      <RideMap ride={ride} />

      {/* 📄 Content */}
      <div className="p-4 space-y-3">
        {/* 👤 Creator Info */}
        <div className="flex items-center gap-3">
          <img
            src={
              ride.createdBy?.profileImg ||
              "https://api.dicebear.com/7.x/initials/svg?seed=User"
            }
            alt="user"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span
            className="text-sm font-medium cursor-pointer hover:underline"
            onClick={() => navigate(`/home/profile/${ride.createdBy?._id}`)}
          >
            {ride.createdBy?.username || "Unknown User"}
          </span>
        </div>

        {/* 🏷 Title */}
        <h2 className="text-lg font-semibold">{ride.tittle}</h2>

        {/* 📍 Route */}
        <p className="text-sm text-gray-600">
          {ride.startLocation?.address} → {ride.destination?.address}
        </p>

        {/* 📏 Distance + ⏱ Time */}
        <div className="flex justify-between text-sm text-gray-500">
          <span>📏 {ride.distanceInKm?.toFixed(1)} km</span>
          <span>⏱ {Math.round(ride.estimatedDuration)} mins</span>
        </div>

        {/* 👥 Riders */}
        <p className="text-sm">
          👥 {ride.joinedRiders?.length}/{ride.maxRiders} riders
        </p>

        {/* 📅 Date */}
        <p className="text-sm text-gray-500">
          📅 {new Date(ride.rideDate).toDateString()}
        </p>

        {/* 🏍 Ride Type */}
        <div className="flex justify-between items-center">
          <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded">
            {ride.rideType}
          </span>

          {/* 🔥 Button */}
          <button
            onClick={() => navigate(`/home/ride/${ride._id}`)}
            className="bg-amber-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-amber-600 transition"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default RideCard;
