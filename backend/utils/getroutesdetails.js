import axios from 'axios'
export const getRouteDetails = async (startLng, startLat, endLng, endLat) => {
  const response = await axios.get(
    `http://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}`,
    {
      params: {
        overview: false,
      },
    }
  );

  if (!response.data.routes.length) {
    throw new Error("Route not found");
  }

  const route = response.data.routes[0];

  return {
    distanceInKm: route.distance / 1000, 
    durationInMinutes: route.duration / 60, 
  };
};