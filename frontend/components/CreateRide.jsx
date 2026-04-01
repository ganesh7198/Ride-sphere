import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/Apipath";

function CreateRide() {
  const [form, setForm] = useState({
    tittle: "",
    startLocationAddress: "",
    endLocationAddress: "",
    maxRiders: "",
    rideType: "",
    description: "",
    rideDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post(`${BASE_URL}/ride/create`, form, {
        withCredentials: true,
      });

      if (data.success) {
        alert("Ride created successfully 🚀");

    
        setForm({
          tittle: "",
          startLocationAddress: "",
          endLocationAddress: "",
          maxRiders: "",
          rideType: "",
          description: "",
          rideDate: "",
        });
      }
    } catch (error) {
      console.error(error);
      alert("Error creating ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-xl p-6 space-y-4"
    >
      <h2 className="text-xl font-bold">Create Ride</h2>

      <input
        name="tittle"
        value={form.tittle}
        onChange={handleChange}
        placeholder="Ride Title"
        className="w-full border p-2 rounded"
      />

      <input
        name="startLocationAddress"
        value={form.startLocationAddress}
        onChange={handleChange}
        placeholder="Start Location"
        className="w-full border p-2 rounded"
      />

      
      <input
        name="endLocationAddress"
        value={form.endLocationAddress}
        onChange={handleChange}
        placeholder="Destination"
        className="w-full border p-2 rounded"
      />

       <input
        name="rideType"
        value={form.rideType}
        onChange={handleChange}
        placeholder="Ride Type (Adventure, City...)"
        className="w-full border p-2 rounded"
      />

     
      <input
        type="number"
        name="maxRiders"
        value={form.maxRiders}
        onChange={handleChange}
        placeholder="Max Riders"
        className="w-full border p-2 rounded"
      />

      
      <input
        type="date"
        name="rideDate"
        value={form.rideDate}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full border p-2 rounded"
      />

     
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded"
      >
        {loading ? "Creating..." : "Create Ride"}
      </button>
    </form>
  );
}

export default CreateRide;
