import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function MyProfile() {
  const { user } = useContext(AuthContext);
  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* 🔹 Profile Header */}
      <div className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* 🖼 Profile Image */}
        <img
          src={
            user.profileImg ||
            `https://ui-avatars.com/api/?name=${user.username}&background=random`
          }
          alt="profile"
          className="h-28 w-28 rounded-full object-cover border"
        />

        {/* 👤 Info */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          {/* Username */}
          <h2 className="text-2xl font-semibold">{user.username}</h2>

          {/* Stats */}
          <div className="flex justify-center md:justify-start gap-6 text-sm">
            <span>
              <strong>{user.posts?.length || 0}</strong> posts
            </span>
            <span>
              <strong>{user.followers?.length || 0}</strong> followers
            </span>
            <span>
              <strong>{user.following?.length || 0}</strong> following
            </span>
          </div>

          {/* Bio */}
          <div>
            <p className="font-medium">{user.fullName}</p>
            <p className="text-gray-500 text-sm">{user.bio}</p>
          </div>

          {/* ✏️ Edit Button */}
          <button className="mt-2 px-4 py-1.5 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 transition">
            Edit Profile
          </button>
        </div>
      </div>

      {/* 🔹 Sections */}

      {/* 📸 Posts */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Posts</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* Replace with real posts later */}
          <div className="bg-gray-200 h-32 rounded"></div>
          <div className="bg-gray-200 h-32 rounded"></div>
          <div className="bg-gray-200 h-32 rounded"></div>
        </div>
      </div>

      {/* 💬 Discussions */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Discussions</h3>
        <div className="bg-white p-3 rounded shadow">
          <p className="text-sm text-gray-500">
            Your discussions will appear here...
          </p>
        </div>
      </div>

      {/* 🏁 Completed Rides */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Completed Rides</h3>
        <div className="bg-white p-3 rounded shadow">
          <p className="text-sm text-gray-500">
            Your completed rides will appear here...
          </p>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
