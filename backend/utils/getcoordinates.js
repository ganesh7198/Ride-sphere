import axios from "axios";

 export const getCoordinates = async (address) => {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: address,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "biker-portal-app",
      },
    }
  );

  if (!response.data.length) {
    throw new Error("Location not found");
  }

  const location = response.data[0];

  return {
    address: location.display_name,
    latitude: parseFloat(location.lat),
    longitude: parseFloat(location.lon),
  };
};