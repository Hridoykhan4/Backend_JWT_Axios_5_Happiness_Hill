import { useQuery } from "@tanstack/react-query";
import FeatureHeading from "../components/FeatureHeading";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import Room from "../components/Room";
import { Link } from "react-router-dom";
const FeaturedRooms = () => {
  const {
    data: rooms = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["featureRooms"],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:5000/rooms?featuredRooms=featured`
      );
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
    <section className="w-[96%] mx-auto">
      <FeatureHeading></FeatureHeading>
      <div className="grid grid-cols-1 py-10 overflow-hidden sm:grid-cols-2 md:grid-cols-3 gap-5">
        {rooms.map((room) => (
          <Room room={room} key={room._id}></Room>
        ))}
      </div>

      <div className="text-center pb-10">
        <Link
          to={"/all-rooms"}
          className="px-6 py-3 rounded-xl font-semibold 
      bg-gradient-to-r from-violet-500 to-purple-600 
      text-white shadow-md hover:shadow-xl
      transition-all duration-300
      hover:scale-105 active:scale-95
      dark:from-violet-400 dark:to-purple-500"
        >
          See All Rooms
        </Link>
      </div>
    </section>
  );
};

export default FeaturedRooms;
