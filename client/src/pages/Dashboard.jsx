import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import useScrollToTop from "../hooks/useScrollToTop";

const Dashboard = () => {
  useScrollToTop();
  const queryClient = useQueryClient();

  // Fetch bookings
  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["dashboard-bookings"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/dashboard-bookings`
      );
      return data;
    },
  });

  // Mutation to approve booking
  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_API_URL}/approve-booking/${id}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["dashboard-bookings"]);
      queryClient.invalidateQueries(["myBookings"]);
    },
  });

  if (isLoading) return <LoadingSpinner />;

  if (isError)
    return (
      <div className="text-red-600 font-semibold text-center mt-10">
        Failed to load bookings: {error.message}
      </div>
    );

  if (!bookings.length)
    return (
      <div className="text-gray-600 dark:text-gray-300 h-screen flex justify-center items-center">
        <h2>No bookings yet.</h2>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">
        📋 Booking Dashboard
      </h1>

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <motion.div
            key={booking._id}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-lg border flex flex-col justify-between"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                {booking.roomInfo.title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                <span className="font-medium">Customer:</span>{" "}
                {booking.customerInfo.name}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                <span className="font-medium">Email:</span>{" "}
                {booking.customerInfo.email}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                <span className="font-medium">Phone:</span>{" "}
                {booking.customerInfo.phone}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                <span className="font-medium">Booking Date:</span>{" "}
                {new Date(
                  booking.customerInfo.bookingDate
                ).toLocaleDateString()}
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-1">
                <span className="font-medium">Price:</span>{" "}
                {booking.roomInfo.price} {booking.roomInfo.currency}
              </p>
            </div>

            {/* Approve / Status Button */}
            <div className="flex gap-3 mt-2">
              {booking.approved ? (
                <span className="px-3 py-1 rounded-full bg-green-500 text-white text-sm font-medium">
                  Approved ✅
                </span>
              ) : (
                <button
                  onClick={() => approveMutation.mutate(booking._id)}
                  className="w-full px-3 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
                >
                  Approve
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
