import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/Apipath";

function CreateDiscussion() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImg(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required ❗");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (img) {
      formData.append("img", img);
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${BASE_URL}/discussion/create`,
        formData,
        {
          withCredentials: true,
        }
      );

      alert("Discussion created successfully ✅");

      // reset
      setTitle("");
      setDescription("");
      setImg(null);
      setPreview(null);
    } catch (error) {
      console.error(error);
      alert("Error creating discussion ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <input
        type="text"
        placeholder="Enter discussion title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {/* Description */}
      <textarea
        placeholder="Write your thoughts..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {/* Image Upload */}
      <input type="file" onChange={handleImageChange} />

      {/* Preview */}
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-full h-48 object-cover rounded"
        />
      )}

      {/* Button */}
      <button
        type="submit"
        className="bg-purple-500 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Creating..." : "Create Discussion"}
      </button>
    </form>
  );
}

export default CreateDiscussion;
