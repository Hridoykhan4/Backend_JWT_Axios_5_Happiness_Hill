import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState } from "react";
import BookingModal from "../components/BookingModal";
import useAuthValue from "../hooks/useAuthValue";

const RoomDetails = () => {
  const axiosSecure = useAxiosSecure();
  const { id } = useParams();
  const [isBookingOpen, setBookingOpen] = useState(false);
  const { user } = useAuthValue();
  const {
    data: room = {},
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["roomDetails", id],
    queryFn: async () => {
      const { data } = await axiosSecure(`/rooms/${id}`);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });


  if (isLoading) return <LoadingSpinner />;

  if (error || isError) {
    console.error("Something went wrong:", error);
    return (
      <div className="text-red-600 font-semibold text-center mt-10">
        ❌ Failed to load data
      </div>
    );
  }

  const {
    title,
    description,
    status,
    availableFrom,
    price,
    currency,
    image,
    amenities = [],
  } = room;

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6"
      >
        {title}
      </motion.h1>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.img
          src={image}
          className="w-full h-72 object-cover rounded-xl shadow-md hover:shadow-2xl transition duration-300"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        />
      </div>

      {/* Info Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 md:p-10 space-y-4">
        <p className="text-gray-600 dark:text-gray-300">{description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status === "Available"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {status}
              </span>
            </p>
            <p>
              <span className="font-semibold">Available From:</span>{" "}
              {new Date(availableFrom).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xl font-semibold text-purple-600">
              💰 {price.toLocaleString()} {currency}
            </p>
          </div>
        </div>

        {/* Amenities */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Amenities</h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {amenities.map((a, i) => (
              <motion.li
                key={i}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium shadow-sm"
              >
                {a}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Action Buttons */}
        {user && user?.email !== room?.ownerInfo?.email && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <motion.button
              onClick={() => setBookingOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-xl transition duration-300"
            >
              Booking Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold shadow-md hover:shadow-xl transition duration-300"
            >
              Set Review
            </motion.button>
          </div>
        )}

        {/* Modals Start */}
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setBookingOpen(false)}
          room={{
            title: room?.title,
            price: room?.price,
            currency: room?.currency,
            availableFrom,
            room_id: room._id
          }}
        />

        {/* Modals End */}
      </div>
    </section>
  );
};

export default RoomDetails;
