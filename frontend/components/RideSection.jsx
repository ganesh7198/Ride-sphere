import { memo, useEffect, useState } from "react";
import axios from "axios";
import { API_PATHS, BASE_URL } from "../utils/Apipath";
import RideCard from '../cards/RideCard'

function RidesSection() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingRides();
  }, []);

  const fetchUpcomingRides = async () => {
    try {
      const data = await axios.get(
        `${BASE_URL}${API_PATHS.RIDE.GET_ALL}`,
        { withCredentials: true }
      );
      console.log(data.data.ride)
      setRides(data.data.ride || []);
    } catch (error) {
      console.error("Error fetching upcoming rides:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading rides...</div>;
  }

  if (rides.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-500">
        No upcoming rides 🚀 <br />
        Create your first ride!
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upcoming Rides</h2>

      <div className="space-y-4 -z-10">
        {rides.map((ride) => (
          <RideCard key={ride._id} ride={ride} />
        ))}
      </div>
    </div>
  );
}

export default memo(RidesSection);
