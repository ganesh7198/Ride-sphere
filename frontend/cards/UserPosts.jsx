import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, API_PATHS } from "../utils/Apipath";

function UserPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}${API_PATHS.POST.GET_ALL_BY_USER}`, {
        withCredentials: true,
      })
      .then((res) => setPosts(res.data.posts))
      .catch(console.log);
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Posts</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {posts.map((post) => (
          <img
            key={post._id}
            src={post.img}
            className="h-32 w-full object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
}

export default UserPosts;
