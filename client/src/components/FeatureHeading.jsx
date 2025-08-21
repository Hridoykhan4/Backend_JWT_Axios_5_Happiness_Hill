"use client";

// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// --- BouncyText Component ---
const BouncyText = ({ text = "Bouncy Animation" }) => {
  return (
    <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-center text-gray-800 dark:text-gray-100 tracking-tight">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [0, -25, 0],
            opacity: [0, 1, 1],
            transition: {
              delay: i * 0.08, 
              duration: 0.6,
              repeat: Infinity, 
              repeatDelay: 2,
              ease: "easeInOut",
            },
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </h2>
  );
};

// --- BouncyView Wrapper ---
const BouncyView = () => {
  return (
    <div className="flex flex-col items-center justify-center font-sans p-6 md:p-12 bg-gradient-to-r from-pink-50 via-white to-pink-50 dark:from-gray-900 dark:via-neutral-900 dark:to-gray-900 rounded-3xl shadow-xl">
      <BouncyText text="Feature Rooms" />
      <p className="mt-4 text-center text-gray-600 dark:text-gray-300 max-w-xl text-lg md:text-xl">
        Explore our exclusive feature rooms, designed for comfort, luxury, and a
        memorable stay.
      </p>
    </div>
  );
};

export default BouncyView;
