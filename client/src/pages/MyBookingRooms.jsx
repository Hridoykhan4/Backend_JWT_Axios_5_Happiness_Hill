import { useQuery } from "@tanstack/react-query";
import useAuthValue from "../hooks/useAuthValue";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

const MyBookingRooms = () => {
  const { user } = useAuthValue(); // get current logged-in user

  // Fetch bookings for current user
  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["myBookings", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/my-bookings/${user.email}`
      );
      return data;
    },
    enabled: !!user?.email, // only fetch if email exists
  });

  if (isLoading) return <LoadingSpinner />;

  if (isError)
    return (
      <div className="text-red-600 font-semibold text-center">
        Failed to load your bookings: {error.message}
      </div>
    );

  if (!bookings.length)
    return (
      <div className="text-gray-600 h-screen flex justify-center items-center  ">
        <h2>You have no bookings yet.</h2>
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        My Booked Rooms
      </h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-2xl transition"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {booking.roomInfo.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Price:{" "}
              <span className="font-semibold text-purple-600">
                {booking.roomInfo.price} {booking.roomInfo.currency}
              </span>
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Booking Date:{" "}
              {new Date(booking.customerInfo.bookingDate).toLocaleDateString()}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Phone: {booking.customerInfo.phone}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Available From:{" "}
              {new Date(booking.roomInfo.availableFrom).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookingRooms;
