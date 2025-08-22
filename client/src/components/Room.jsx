import { easeOut, motion } from "framer-motion";
import { Link } from "react-router-dom";

const Room = ({ room , children}) => {
  const MotionLink = motion.create(Link);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 15,
        duration: 2,
        ease: easeOut,
        delay: 0.3,
      }}
      className="bg-white dark:bg-zinc-900 shadow-lg rounded-3xl overflow-hidden max-w-sm mx-auto border border-gray-200 dark:border-zinc-700 hover:border-violet-500 transition-colors duration-300 group"
    >
      {/* Room Image */}
       <motion.img
        src={room.image}
        alt={room.title}
        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Room Info */}
      <div className="p-6 flex flex-col justify-between min-h-[250px]">
        <div>
          <h2 className="text-2xl font-['Playfair_Display'] font-semibold text-gray-800 dark:text-white mb-2 tracking-wide">
            {room.title}
          </h2>
          <p className="text-violet-600 dark:text-violet-400 text-lg font-medium">
            {room.currency} {room.price.toLocaleString()}
          </p>

          {/* Features Preview */}
          <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-600 dark:text-zinc-400">
            <span className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-zinc-500">🛏</span>
              {room.features.bedRoom} Beds
            </span>
            <span className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-zinc-500">🛁</span>
              {room.features.bathRoom} Baths
            </span>
            <span className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-zinc-500">🚗</span>
              {room.features.parking} Parking
            </span>
            <span className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-zinc-500">📐</span>
              {room.features.squareFeet} sqft
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <MotionLink
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          to={`/rooms/${room._id}`}
          className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          View Details
        </MotionLink>
        {children}
      </div>
    </motion.div>
  );
};

export default Room;
