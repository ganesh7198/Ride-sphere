import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/Apipath";

function CreatePost() {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("text", text);
    if (img) formData.append("img", img);

    try {
      setLoading(true);

      await axios.post(`${BASE_URL}/post/create`, formData, {
        withCredentials: true,
      });

      alert("Post created ✅");
      setText("");
      setImg(null);
    } catch (err) {
      console.error(err);
      alert("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write something..."
        className="w-full border p-2 rounded"
      />

      <input type="file" onChange={(e) => setImg(e.target.files[0])} />

      <button className="bg-green-500 text-white px-4 py-2 rounded w-full">
        {loading ? "Posting..." : "Create Post"}
      </button>
    </form>
  );
}

export default CreatePost;
