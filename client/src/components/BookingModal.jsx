import { useEffect, useState } from "react";
import useAuthValue from "../hooks/useAuthValue";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";

const BookingModal = ({ isOpen, onClose, room }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuthValue();
  const [formData, setFormData] = useState({
    name: user?.displayName,
    email: user?.email,
    phone: "",
    date: "",
  });

  useEffect(() => {
    (formData.name = user?.displayName), (formData.email = user?.email);
  }, [user, formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  Post a request for a room
  const { mutateAsync } = useMutation({
    mutationFn: async (bookingData) => {
      const { data } = await axiosSecure.post("/room-request", bookingData);
      return data;
    },
    onSuccess: (data) => {
      alert("Success");
      console.log(data);
    },
    onError: (error) => {
      if (error?.response?.data?.message || error?.message) {
        alert(error?.response?.data?.message);
      }
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
      },
    };
    if (bookData.customerInfo.bookingDate < room.availableFrom) {
      return alert("Date must be higher than available from date");
    }

    await mutateAsync(bookData);
    // onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Book This Room</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full input input-bordered rounded-lg p-3 border"
            type="text"
            readOnly
            value={room?.title}
          />

          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            readOnly
            className="w-full input input-bordered rounded-lg p-3 border"
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            readOnly
            className="w-full input input-bordered rounded-lg p-3 border"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full input input-bordered rounded-lg p-3 border"
            required
          />
          <input
            type="date"
            name="date"
            min={new Date().toISOString().split("T")[0]}
            value={formData.date}
            onChange={handleChange}
            className="w-full input input-bordered rounded-lg p-3 border"
            required
          />
          <p className="text-gray-600 text-sm">
            💰 Price:{" "}
            <span className="font-semibold text-purple-600">
              {room?.price} {room?.currency}
            </span>
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-xl transition"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default BookingModal;
