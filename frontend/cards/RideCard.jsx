import { useNavigate } from "react-router-dom";

function RideCard({ ride }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/ride/${ride._id}`)}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition"
    >
      {/* 🖼️ Image */}
      <div className="h-48 w-full">
        <img
          src={ride.rideImage}
          alt="ride"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 📄 Content */}
      <div className="p-4 space-y-3">
        {/* 👤 Creator Info */}
        <div className="flex items-center gap-3">
          <img
            src={ride.createdBy?.profileImg || "/default-avatar.png"}
            alt="user"
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-sm font-medium">
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

        {/* 🏍 Ride Type + Status */}
        <div className="flex gap-2">
          <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded">
            {ride.rideType}
          </span>
         
        </div>
      </div>
    </div>
  );
}

export default RideCard;
