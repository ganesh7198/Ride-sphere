import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
});

// 🔥 Routing Component
function Routing({ start, end }) {
  const map = useMap();

  useEffect(() => {
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      lineOptions: {
        styles: [{ color: "blue", weight: 4 }],
      },
      show: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, start, end]);

  return null;
}

// 🔄 Reset Button
function ResetButton({ center, zoom }) {
  const map = useMap();

  return (
    <button
      onClick={() => map.setView(center, zoom)}
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: 1000,
        background: "#f59e0b",
        color: "white",
        padding: "6px 10px",
        borderRadius: "6px",
        fontSize: "12px",
      }}
    >
      Reset
    </button>
  );
}

function RideMap({ ride }) {
  if (!ride) return null;

  const start = [
    ride.startLocation.location.coordinates[1],
    ride.startLocation.location.coordinates[0],
  ];

  const end = [
    ride.destination.location.coordinates[1],
    ride.destination.location.coordinates[0],
  ];

  const center = start;
  const zoom = 10;

  return (
    <div style={{ position: "relative", zIndex: 0 }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{
          height: "250px",
          width: "100%",
          borderRadius: "12px",
          zIndex: 0, 
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={start} />
        <Marker position={end} />

        {/* ✅ REAL ROAD ROUTE */}
        <Routing start={start} end={end} />

        {/* 🔄 Reset Button */}
        <ResetButton center={center} zoom={zoom} />
      </MapContainer>
    </div>
  );
}

export default RideMap;
