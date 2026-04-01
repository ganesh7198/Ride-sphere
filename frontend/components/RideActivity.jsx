import { useState } from "react";
import JoinedRide from "../cards/JoinedRide";
import CreatedRide from "../cards/CreatedRide";

function RideActivity() {
  const [activeTab, setActiveTab] = useState("created");

  return (
    <div className="max-w-2xl mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold mb-4">Ride Activity</h1>

 
      <div className="flex gap-6 border-b mb-6">
        <button
          onClick={() => setActiveTab("created")}
          className={`pb-2 ${
            activeTab === "created"
              ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
              : "text-gray-500"
          }`}
        >
          Created Rides
        </button>

        <button
          onClick={() => setActiveTab("joined")}
          className={`pb-2 ${
            activeTab === "joined"
              ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
              : "text-gray-500"
          }`}
        >
          Joined Rides
        </button>
      </div>
      <div>
        {activeTab === "created" && <CreatedRide></CreatedRide>}
        {activeTab === "joined" && <JoinedRide></JoinedRide>}
      </div>
    </div>
  );
}

export default RideActivity;