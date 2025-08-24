import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import Room from "../components/Room";
import useScrollToTop from "../hooks/useScrollToTop";

const AllRooms = () => {
  useScrollToTop();

  const {
    data: rooms = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allRooms"],
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/rooms`);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    console.error("Something went wrong:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-red-600 font-semibold mb-4">
          Oops! Failed to load rooms. Please try again.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-gray-600 dark:text-gray-400 text-lg">
        No rooms available at the moment.
      </div>
    );
  }

  return (
    <section className="py-12 w-[96%] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-9">
        {rooms.map((room) => (
          <Room room={room} key={room._id} />
        ))}
      </div>
    </section>
  );
};

export default AllRooms;
