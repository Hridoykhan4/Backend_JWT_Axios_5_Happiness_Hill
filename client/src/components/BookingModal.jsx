import { useEffect, useState } from "react";
import useAuthValue from "../hooks/useAuthValue";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BookingModal = ({ isOpen, onClose, room }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuthValue();
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    date: "",
  });

  // Sync user info when auth changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      name: user?.displayName || "",
      email: user?.email || "",
    }));
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Mutation
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async (bookingData) => {
      const { data } = await axiosSecure.post("/room-request", bookingData);
      return data;
    },
    onSuccess: (data) => {
      toast.success("✅ Booking request sent successfully!");
      console.log(data);
      onClose();
      nav("/my-booking-rooms");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "❌ Something went wrong!"
      );

      nav("/all-rooms");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookData = {
      customerInfo: {
        name: formData.name,
        email: formData.email,
        bookingDate: new Date(formData.date).toISOString(),
        phone: formData?.phone,
      },
      roomInfo: {
        title: room?.title,
        roomId: room?.room_id,
        price: room?.price,
        currency: room?.currency,
        availableFrom: room?.availableFrom,
        ownerEmail: 'hridoykhan148385@gmail.com'
      },
    };

    if (bookData.customerInfo.bookingDate < room.availableFrom) {
      return toast.error("⚠️ Date must be after available from date!");
    }

    await mutateAsync(bookData);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative"
      >
        <h2 className="text-2xl font-bold text-center mb-5 text-gray-900 dark:text-white">
          🛎️ Book This Room
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full input input-bordered rounded-lg p-3 border dark:bg-gray-800"
            type="text"
            readOnly
            value={room?.title}
          />

          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            readOnly
            className="w-full input input-bordered rounded-lg p-3 border dark:bg-gray-800"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            readOnly
            className="w-full input input-bordered rounded-lg p-3 border dark:bg-gray-800"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full input input-bordered rounded-lg p-3 border dark:bg-gray-800"
            required
          />
          <input
            type="date"
            name="date"
            min={new Date().toISOString().split("T")[0]}
            value={formData.date}
            onChange={handleChange}
            className="w-full input input-bordered rounded-lg p-3 border dark:bg-gray-800"
            required
          />

          <p className="text-gray-700 dark:text-gray-300 text-sm">
            💰 Price:{" "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              {room?.price} {room?.currency}
            </span>
          </p>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-xl transition disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default BookingModal;
