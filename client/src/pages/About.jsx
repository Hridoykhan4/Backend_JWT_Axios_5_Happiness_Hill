// eslint-disable-next-line no-unused-vars
import { easeInOut, motion } from "framer-motion";
import useScrollToTop from "../hooks/useScrollToTop";
const About = () => {
  useScrollToTop();
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeInOut, delay: 0.4 }}
      className="relative bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 px-6 lg:px-20"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
            Welcome to{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Happiness Hill
            </span>
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Nestled in the heart of{" "}
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Kaptai, Rangamati Hill Tracts
            </span>
            , <strong>Happiness Hill</strong> is a sanctuary of peace and
            natural beauty. Surrounded by lush hills, serene lake views, and
            refreshing breezes, our hotel is the perfect escape from the busy
            city life.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Whether you’re here for a quiet retreat, a family vacation, or an
            adventurous exploration of the Chittagong Hill Tracts, Happiness
            Hill offers a warm welcome with modern comfort and local charm.
          </p>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li>✅ Cozy and comfortable rooms</li>
            <li>✅ Stunning views of Kaptai Lake</li>
            <li>✅ Authentic local & international cuisine</li>
            <li>✅ Friendly hospitality with a homely touch</li>
          </ul>
          <p className="text-indigo-600 font-semibold dark:text-indigo-400">
            Experience nature, comfort, and happiness—all in one place. 🌿
          </p>
        </div>

        {/* Right Image */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Happiness Hill Hotel"
            className="rounded-2xl shadow-lg w-full h-[400px] object-cover"
          />
          <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              “Your happiness is our destination.”
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default About;
