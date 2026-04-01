import { useState } from "react";
import RidesSection from "../components/RideSection";
import AllPost from "../components/AllPost";
import AllDisccussion from "../components/AllDisccussion";

function HomePage() {
  const [activeTab, setActiveTab] = useState("rides");

  return (
  <div>
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
      {activeTab == "discussions" && <AllDisccussion></AllDisccussion>}
    </div>
  );
}

export default HomePage;
