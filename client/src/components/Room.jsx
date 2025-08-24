import { easeOut, motion } from "framer-motion";
import { Link } from "react-router-dom";

// Use motion.create() instead of motion()
const MotionLink = motion.create(Link);

const Room = ({ room, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{
        type: "spring",
        stiffness: 120,
        damping: 18,
        ease: easeOut,
        duration: 0.6,
        delay: 0.2,
      }}
      className="bg-white/90 dark:bg-zinc-900/80 backdrop-blur-md shadow-xl hover:shadow-2xl rounded-3xl overflow-hidden max-w-sm mx-auto border border-gray-200 dark:border-zinc-800 hover:border-violet-500/70 transition-all duration-500 group"
    >
      {/* Room Image */}
      <div className="relative overflow-hidden">
        <motion.img
          src={room.image}
          alt={room.title}
          className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-zinc-800/90 px-4 py-1 rounded-full text-violet-600 dark:text-violet-400 font-semibold text-sm shadow-md">
          {room.currency} {room.price.toLocaleString()}
        </div>
      </div>

      {/* Room Info */}
      <div className="p-6 flex flex-col justify-between min-h-[260px]">
        <div>
          <h2 className="text-2xl font-['Playfair_Display'] font-bold text-gray-900 dark:text-white mb-3 tracking-wide group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300">
            {room.title}
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-600 dark:text-zinc-400">
            <span className="flex items-center gap-2">
              <span className="text-lg">🛏</span>
              {room.features.bedRoom} Beds
            </span>
            <span className="flex items-center gap-2">
              <span className="text-lg">🛁</span>
              {room.features.bathRoom} Baths
            </span>
            <span className="flex items-center gap-2">
              <span className="text-lg">🚗</span>
              {room.features.parking} Parking
            </span>
            <span className="flex items-center gap-2">
              <span className="text-lg">📐</span>
              {room.features.squareFeet} sqft
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <MotionLink
            whileHover={{ scale: 1.05, boxShadow: "0px 8px 24px rgba(139,92,246,0.4)" }}
            whileTap={{ scale: 0.95 }}
            to={`/rooms/${room._id}`}
            className="block w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300 text-center"
          >
            View Details
          </MotionLink>
          {children && <div className="pt-2">{children}</div>}
        </div>
      </div>
    </motion.div>
  );
};

export default Room;
