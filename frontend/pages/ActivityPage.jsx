import { useState } from "react";
import PostActivity from "../components/PostActivity";
import RideActivity from "../components/RideActivity";
import CreatedDiscussion from "../cards/CreatedDiscussion";

function ActivityPage() {
  const [activeTab, setActiveTab] = useState("Posts");

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Activity</h1>

      <div className="flex gap-4 border-b mb-6">
        {["Posts", "Rides" ,"Discussion"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "Posts" && <PostActivity></PostActivity>}
        {activeTab === "Rides" && <RideActivity></RideActivity>}
        {activeTab==="Discussion" && <CreatedDiscussion></CreatedDiscussion>}
      </div>
    </div>
  );
}

export default ActivityPage;
