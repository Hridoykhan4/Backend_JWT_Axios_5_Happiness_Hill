// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Marquee from "./Marquee";

const CustomerReviews = () => {
  return (
    <section className="py-12 w-[96%] mx-auto">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">
          What Our Customers Say
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm md:text-base max-w-lg mx-auto">
          Real stories from real guests who loved their experience with us.
        </p>
      </motion.div>

      {/* Marquee Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-white/60 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-lg p-4"
      >
        <Marquee />
      </motion.div>
    </section>
  );
};

export default CustomerReviews;
