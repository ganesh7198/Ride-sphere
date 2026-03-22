import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, API_PATHS } from "../utils/Apipath";

function UserDiscussions() {
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}${API_PATHS.DISCUSSION.USER_DISCUSSIONS}`, {
        withCredentials: true,
      })
      .then((res) => setDiscussions(res.data.discussions))
      .catch(console.log);
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Discussions</h3>

      {discussions.map((d) => (
        <div key={d._id} className="bg-white p-3 rounded shadow mb-2">
          <p className="font-medium">{d.title}</p>
          <p className="text-sm text-gray-500">{d.description}</p>
        </div>
      ))}
    </div>
  );
}

export default UserDiscussions;
