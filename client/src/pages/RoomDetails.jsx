import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useState } from "react";
import BookingModal from "../components/BookingModal";
import useAuthValue from "../hooks/useAuthValue";
import useScrollToTop from "../hooks/useScrollToTop";
import { User, Mail, ShieldCheck, Home } from "lucide-react";
import RatingReview from "../components/RatingReview";

const RoomDetails = () => {
  useScrollToTop();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [isBookingOpen, setBookingOpen] = useState(false);
  const [isReviewOpen, setReviewOpen] = useState(false);
  const { user } = useAuthValue();
  const [rating, setRating] = useState(0);

  const { mutateAsync } = useMutation({
    mutationFn: async (reviewData) => {
      const { data } = await axiosSecure.post(`/review`, reviewData);
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries(["reviews"]);
      setReviewOpen(false);
    },
  });

  const {
    data: room = {},
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["roomDetails", id],
    queryFn: async () => {
      const { data } = await axiosSecure(`/rooms/${id}`);
      return data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingSpinner />;

  if (error || isError) {
    console.error("Something went wrong:", error);
    return (
      <div className="text-red-600 font-semibold text-center mt-10">
        ❌ Failed to load data
      </div>
    );
  }

  const {
    title,
    description,
    status,
    availableFrom,
    price,
    currency,
    image,
    amenities = [],
    ownerInfo,
  } = room;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      return alert("Share rating");
    }
    const review = e.target.review.value;
    const reviewData = { review, rating };
    await mutateAsync(reviewData);
  };

  return (
    <section className="max-w-6xl dark:text-white mx-auto px-4 py-10 space-y-8">
      {/* Hero with overlay */}
      <div className="relative w-full h-96 md:h-[400px] overflow-hidden rounded-2xl shadow-lg">
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
          <p className="text-xl font-semibold text-yellow-300 mt-2">
            💰 {price.toLocaleString()} {currency}
          </p>
        </div>
      </div>

      {/* Info + Owner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 md:p-10 space-y-6"
      >
        <p className="text-gray-600 dark:text-gray-300">{description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  status === "Available"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {status}
              </span>
            </p>
            <p>
              <span className="font-semibold">Available From:</span>{" "}
              {new Date(availableFrom).toLocaleDateString()}
            </p>
          </div>

          {/* Owner Info */}
          {ownerInfo && (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-100 dark:bg-gray-700 shadow-sm">
              <img
                referrerPolicy="no-referrer"
                src={ownerInfo.photo}
                alt={ownerInfo.name}
                className="w-14 h-14 rounded-full border-2 border-indigo-500"
              />
              <div>
                <p className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100">
                  <User size={16} /> {ownerInfo.name}
                </p>
                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                  <Mail size={14} /> {ownerInfo.email}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck size={18} /> Amenities
          </h3>
          <motion.ul
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {amenities.map((a, i) => (
              <motion.li
                key={i}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium shadow-sm flex items-center gap-2"
              >
                <Home size={14} /> {a}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Action Buttons */}
        {user && user?.email !== ownerInfo?.email && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <motion.button
              onClick={() => setBookingOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-xl transition duration-300"
            >
              Booking Now
            </motion.button>

            <motion.button
              onClick={() => setReviewOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold shadow-md hover:shadow-xl transition duration-300"
            >
              Set Review
            </motion.button>
          </div>
        )}

        {/* Modals */}
        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setBookingOpen(false)}
          room={{
            title: room?.title,
            price: room?.price,
            currency: room?.currency,
            availableFrom,
            room_id: room._id,
          }}
        />

        {isReviewOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <motion.form
              onSubmit={handleReviewSubmit}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-md"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                ✍️ Write a Review
              </h3>
              <textarea
                name="review"
                rows="4"
                required
                placeholder="Share your experience..."
                className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-gray-200"
              ></textarea>

              <div className="my-3">
                <RatingReview
                  rating={rating}
                  setRating={setRating}
                ></RatingReview>
              </div>

              <div className="flex justify-end mt-4 gap-3">
                <button
                  onClick={() => setReviewOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-red-600 !dark:bg-green-500"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
                  Submit
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default RoomDetails;
