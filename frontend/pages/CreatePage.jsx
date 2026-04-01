import { useState } from "react";
import CreateRide from "../components/CreateRide";
import CreatePost from "../components/CreatePost";
import CreateDiscussion from "../components/CreateDiscussion";

function CreatePage() {
  const [activeTab, setActiveTab] = useState("ride");

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Create</h1>

      {/* 🔥 Tabs */}
      <div className="flex gap-4 border-b mb-6">
        {["ride", "post", "discussion"].map((tab) => (
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

      {/* 🔥 Content */}
      <div>
        {activeTab === "ride" && (
          <div>
            <h2 className="text-lg font-semibold">Create Ride</h2>
            <CreateRide></CreateRide>
          </div>
        )}

        {activeTab === "post" && (
          <div>
            <h2 className="text-lg font-semibold">Create Post</h2>
            <CreatePost></CreatePost>
          </div>
        )}

        {activeTab === "discussion" && (
          <div>
            <h2 className="text-lg font-semibold">Create Discussion</h2>
       <CreateDiscussion></CreateDiscussion>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatePage;
