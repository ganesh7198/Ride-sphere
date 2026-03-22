import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, API_PATHS } from "../utils/Apipath";

function UserRides() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}${API_PATHS.RIDE.CREATED_BY_USER}`, {
        withCredentials: true,
      })
      .then((res) => setRides(res.data.rides))
      .catch(console.log);
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Completed Rides</h3>

      {rides.map((ride) => (
        <div key={ride._id} className="bg-white p-3 rounded shadow mb-2">
          <p className="font-medium">{ride.tittle}</p>
          <p className="text-sm text-gray-500">
            {ride.startLocation.address} → {ride.destination.address}
          </p>
        </div>
      ))}
    </div>
  );
}

export default UserRides;
