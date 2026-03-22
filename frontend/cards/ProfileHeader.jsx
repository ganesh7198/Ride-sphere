import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { BASE_URL, API_PATHS } from "../utils/Apipath";
import { AuthContext } from "../context/AuthContext";

function ProfileHeader({ userId }) {
  // State for storing user profile data
  const [user, setUser] = useState(null);
  // State for tracking if current logged-in user is following this profile
  const [isFollowing, setIsFollowing] = useState(false);
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  // State for edit form data
  const [editData, setEditData] = useState({
    fullName: "",
    bio: "",
    profileImg: "",
  });

  // Get logged in user from context
  const { user: loggedInUser } = useContext(AuthContext);

  // Fetch user profile when userId changes
  useEffect(() => {
    fetchUser();
  }, [userId]);

  // Function to fetch user profile data
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}${API_PATHS.AUTH.USER_PROFILE(userId)}`,
        { withCredentials: true }
      );

      const profileUser = res.data.user;
      setUser(profileUser);

      // Initialize edit form data
      setEditData({
        fullName: profileUser.fullName || "",
        bio: profileUser.bio || "",
        profileImg: profileUser.profileImg || "",
      });

      // Check if logged in user is following this profile
      if (profileUser.followers?.includes(loggedInUser?._id)) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Handle follow/unfollow
  const handleFollow = async () => {
    try {
      if (isFollowing) {
        // Unfollow API call
        await axios.post(
          `${BASE_URL}${API_PATHS.AUTH.UNFOLLOW(userId)}`,
          {},
          { withCredentials: true }
        );
        setIsFollowing(false);
        // Update local state
        setUser((prev) => ({
          ...prev,
          followers: prev.followers.filter((id) => id !== loggedInUser?._id),
        }));
      } else {
        // Follow API call
        await axios.post(
          `${BASE_URL}${API_PATHS.AUTH.FOLLOW(userId)}`,
          {},
          { withCredentials: true }
        );
        setIsFollowing(true);
        // Update local state
        setUser((prev) => ({
          ...prev,
          followers: [...prev.followers, loggedInUser?._id],
        }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Handle edit profile update
  const handleUpdateProfile = async () => {
    try {
      const res = await axios.put(
        `${BASE_URL}${API_PATHS.AUTH.UPDATE_PROFILE}`,
        editData,
        { withCredentials: true }
      );

      // Update user state with new data
      setUser(res.data.user);
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle input changes in edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Loading state
  if (!user)
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );

  // Check if viewing own profile
  const isOwnProfile = loggedInUser?._id === user._id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header - Instagram Style */}
      <div className="flex gap-8 md:gap-16 items-center">
        {/* Profile Image Section */}
        <div className="flex-shrink-0">
          {isEditing ? (
            // Edit mode - show image upload
            <div className="relative">
              <img
                src={editData.profileImg || "https://api.dicebear.com/7.x/initials/svg?seed=User"}
                alt="profile"
                className="w-20 h-20 md:w-36 md:h-36 rounded-full object-cover border-2 border-gray-200"
              />
              <button className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          ) : (
            // View mode - show profile image
            <img
              src={user.profileImg || "/default-avatar.png"}
              alt={user.username}
              className="w-20 h-20 md:w-36 md:h-36 rounded-full object-cover border-2 border-gray-200"
            />
          )}
        </div>

        {/* Profile Info Section */}
        <div className="flex-1">
          {/* Username and Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {isEditing ? (
              // Edit mode - show input for username? (usually username is not editable)
              <h2 className="text-xl md:text-2xl font-light">
                {user.username}
              </h2>
            ) : (
              <h2 className="text-xl md:text-2xl font-light">
                {user.username}
              </h2>
            )}

            {/* Show Follow button for other profiles */}
            {!isOwnProfile && !isEditing && (
              <button
                onClick={handleFollow}
                className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition ${
                  isFollowing
                    ? "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}

            {/* Show Edit Profile button for own profile */}
            {isOwnProfile && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-1.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 transition"
              >
                Edit Profile
              </button>
            )}

            {/* Show Save/Cancel buttons in edit mode */}
            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateProfile}
                  className="px-5 py-1.5 rounded-lg text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    // Reset edit data to original user data
                    setEditData({
                      fullName: user.fullName || "",
                      bio: user.bio || "",
                      profileImg: user.profileImg || "",
                    });
                  }}
                  className="px-5 py-1.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Stats Section - Shows posts, followers, following counts */}
          <div className="flex gap-6 mb-4">
            <div>
              <span className="font-semibold">{user.posts?.length || 0}</span>
              <span className="text-gray-600 ml-1 text-sm">posts</span>
            </div>
            <div>
              <span className="font-semibold">
                {user.followers?.length || 0}
              </span>
              <span className="text-gray-600 ml-1 text-sm">followers</span>
            </div>
            <div>
              <span className="font-semibold">
                {user.following?.length || 0}
              </span>
              <span className="text-gray-600 ml-1 text-sm">following</span>
            </div>
          </div>

          {/* Name and Bio Section */}
          <div>
            {isEditing ? (
              // Edit mode - form inputs for fullName and bio
              <div className="space-y-2">
                <input
                  type="text"
                  name="fullName"
                  value={editData.fullName}
                  onChange={handleEditChange}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  name="bio"
                  value={editData.bio}
                  onChange={handleEditChange}
                  placeholder="Bio"
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              // View mode - display fullName and bio
              <>
                <p className="font-semibold text-sm">{user.fullName}</p>
                <p className="text-gray-600 text-sm mt-1">{user.bio}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
