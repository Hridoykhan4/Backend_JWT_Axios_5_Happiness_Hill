import { useQuery } from "@tanstack/react-query";
import useAuthValue from "../hooks/useAuthValue";

import LoadingSpinner from "../components/LoadingSpinner";
import useScrollToTop from "../hooks/useScrollToTop";
import useAxiosSecure from "../hooks/useAxiosSecure";

const MyBookingRooms = () => {
  const axiosSecure = useAxiosSecure();
  useScrollToTop();
  const { user } = useAuthValue();

  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["myBookings", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data } = await axiosSecure(`/my-bookings/${user.email}`);
      return data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <LoadingSpinner />;

  if (isError)
    return (
      <div className="text-red-600 font-semibold text-center mt-10">
        Failed to load your bookings: {error.message}
      </div>
    );

  if (!bookings.length)
    return (
      <div className="text-gray-600 dark:text-gray-300 h-screen flex justify-center items-center">
        <h2 className="text-xl font-semibold">You have no bookings yet.</h2>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white tracking-wide">
        My Booked Rooms
      </h2>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-zinc-800"
          >
            {/* Image placeholder if room image exists */}
            {booking.roomInfo.image && (
              <img
                src={booking.roomInfo.image}
                alt={booking.roomInfo.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}

            <div className="p-5 flex flex-col justify-between min-h-[250px]">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {booking.roomInfo.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  Price:{" "}
                  <span className="font-semibold text-purple-600">
                    {booking.roomInfo.price} {booking.roomInfo.currency}
                  </span>
                </p>

                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  Booking Date:{" "}
                  {new Date(
                    booking.customerInfo.bookingDate
                  ).toLocaleDateString()}
                </p>

                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  Phone: {booking.customerInfo.phone}
                </p>

                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  Available From:{" "}
                  {new Date(
                    booking.roomInfo.availableFrom
                  ).toLocaleDateString()}
                </p>

                <p
                  className={`mt-2 font-semibold ${
                    booking?.approved ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {booking?.approved ? "Booked ✅" : "Pending ❌"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookingRooms;
