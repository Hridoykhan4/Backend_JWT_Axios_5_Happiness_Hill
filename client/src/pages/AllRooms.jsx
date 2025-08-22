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
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (error || isError) {
    console.error("Something went wrong:", error);
    ("Oops! An error occurred. Please try again.");
    return (
      <div className="text-red-600 font-semibold text-center">
        Failed to load data
      </div>
    );
  }

  return (
    <section className="py-10">
      <div className="grid grid-cols-1 py-10 overflow-hidden sm:grid-cols-2 md:grid-cols-3 gap-5">
        {rooms.map((room) => (
          <Room room={room} key={room._id}></Room>
        ))}
      </div>
    </section>
  );
};

export default AllRooms;
