import { useState } from "react";
import RidesSection from "../components/RideSection";
import PostSection from "../components/PostSection";
import AllPost from "../components/AllPost";

function HomePage() {
  const [activeTab, setActiveTab] = useState("rides");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Simple Tabs */}
      <div className="flex gap-6 border-b border-gray-200">
        {["rides", "posts", "discussions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab == "rides" && <RidesSection></RidesSection>}
      {activeTab == "posts" && <AllPost ></AllPost>}
      {activeTab == "discussions" && <h1>discussion</h1>}
    </div>
  );
}

export default HomePage;
