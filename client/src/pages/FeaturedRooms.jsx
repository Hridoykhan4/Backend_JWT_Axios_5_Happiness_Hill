import { useQuery } from "@tanstack/react-query";
import FeatureHeading from "../components/FeatureHeading";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import Room from "../components/Room";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturedRooms = () => {
  const {
    data: rooms = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["featureRooms"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/rooms?featuredRooms=featured`
      );
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
      <div className="flex flex-col items-center justify-center min-h-[40vh]">
        <p className="text-red-600 font-semibold mb-4">
          Oops! Failed to load featured rooms.
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

  return (
    <section className="w-[95%] mx-auto relative">
      <FeatureHeading />

      {/* Featured Rooms Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 py-12 sm:grid-cols-2 md:grid-cols-3 gap-8"
      >
        {rooms.map((room, idx) => (
          <motion.div
            key={room._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            viewport={{ once: true }}
          >
            <Room room={room} />
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Button */}
      {rooms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/all-rooms"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold 
            bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 
            text-white shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 
            transition-all duration-300 group"
          >
            <span>See All Rooms</span>
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      )}
    </section>
  );
};

export default FeaturedRooms;
