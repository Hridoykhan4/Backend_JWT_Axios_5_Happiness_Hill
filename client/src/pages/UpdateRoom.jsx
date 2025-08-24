import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const UpdateRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Fetch room details
  const { data: room, isLoading } = useQuery({
    queryKey: ["room", id],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/rooms/${id}`
      );
      return data;
    },
  });

  // ✅ Mutation for updating
  const mutation = useMutation({
    mutationFn: async (updatedRoom) => {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/rooms/${id}`,
        updatedRoom
      );
      return data;
    },
    onSuccess: (data) => {
      if(data.modifiedCount){
        toast.success('Room data has updated')
      }
      queryClient.invalidateQueries(["room", id]);
      queryClient.invalidateQueries(["my-posts"]);
      queryClient.invalidateQueries(["featureRooms"]);
      queryClient.invalidateQueries(["allRooms"]);

      navigate("/my-posts");
    },
  });

  // ✅ Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedRoom = {
      title: form.title.value,
      propertyType: form.propertyType.value,
      status: form.status.value,
      price: Number(form.price.value),
      currency: form.currency.value,
      availableFrom: form.availableFrom.value,
      image: form.image.value,
      features: {
        bedRoom: Number(form.bedRoom.value),
        bathRoom: Number(form.bathRoom.value),
        kitchen: Number(form.kitchen.value),
        livingRoom: Number(form.livingRoom.value),
        squareFeet: form.squareFeet.value,
        parking: form.parking.value,
        furnished: form.furnished.checked,
        hasBalcony: form.hasBalcony.checked,
        hasElevator: form.hasElevator.checked,
        hasAirConditioning: form.hasAirConditioning.checked,
        hasWifi: form.hasWifi.checked,
      },
      amenities: form.amenities.value.split(",").map((a) => a.trim()),
    };

    mutation.mutate(updatedRoom);
  };

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <motion.div
      className="max-w-4xl mx-auto p-8 bg-white dark:bg-gray-800 dark:text-white shadow-xl rounded-xl"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-2xl font-bold mb-6 text-center">
        Update Room: {room?.title}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block font-semibold mb-2">Title</label>
          <input
            type="text"
            name="title"
            defaultValue={room?.title}
            className="w-full border p-3 rounded-lg"
            required
          />
        </div>

        {/* Property Type + Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2">Property Type</label>
            <input
              type="text"
              name="propertyType"
              defaultValue={room?.propertyType}
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Status</label>
            <select
              name="status"
              defaultValue={room?.status}
              className="w-full border p-3 rounded-lg"
            >
              <option>Available</option>
              <option>Unavailable</option>
            </select>
          </div>
        </div>

        {/* Price + Currency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-2">Price</label>
            <input
              type="number"
              name="price"
              defaultValue={room?.price}
              className="w-full border p-3 rounded-lg"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Currency</label>
            <input
              type="text"
              name="currency"
              defaultValue={room?.currency}
              className="w-full border p-3 rounded-lg"
            />
          </div>
        </div>

        {/* Available Date */}
        <div>
          <label className="block font-semibold mb-2">Available From</label>
          <input
            type="date"
            name="availableFrom"
            defaultValue={room?.availableFrom?.split("T")[0]}
            min={new Date().toISOString().split("T")[0]}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block font-semibold mb-2">Image URL</label>
          <input
            type="text"
            name="image"
            defaultValue={room?.image}
            className="w-full border p-3 rounded-lg"
          />
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(room?.features || {}).map(([key, val]) => (
            <div key={key}>
              <label className="block capitalize font-semibold mb-1">
                {key}
              </label>
              {typeof val === "boolean" ? (
                <input
                  type="checkbox"
                  name={key}
                  defaultChecked={val}
                  className="w-5 h-5"
                />
              ) : (
                <input
                  type="text"
                  name={key}
                  defaultValue={val}
                  className="w-full border p-2 rounded-lg"
                />
              )}
            </div>
          ))}
        </div>

        {/* Amenities */}
        <div>
          <label className="block font-semibold mb-2">Amenities</label>
          <input
            type="text"
            name="amenities"
            defaultValue={room?.amenities?.join(", ")}
            className="w-full border p-3 rounded-lg"
          />
          <p className="text-sm text-gray-500">Separate by commas</p>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-xl transition"
          >
            {mutation.isLoading ? "Updating..." : "Update Room"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default UpdateRoom;
