import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import toast from "react-hot-toast";
export const AddRoom = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  // State to manage all form data
  const [formData, setFormData] = useState({
    title: "",
    propertyType: "Apartment",
    status: "Available",
    availableFrom: "",
    price: "",
    image: "",
    amenities: "",
    ownerInfo: {
      name: "Hridoy Khan",
      email: "hridoykhan148385@gmail.com",
      photo:
        "https://lh3.googleusercontent.com/a/ACg8ocKyl10F6nY22XSEeVV221cHtKjsA6FjKq1Gx1I7Rd_A5AOCmqd-zg=s96-c",
    },
    features: {
      bedRoom: "",
      bathRoom: "",
      kitchen: "",
      livingRoom: "",
      squareFeet: "",
      parking: "",
      furnished: false,
      hasBalcony: false,
      hasPool: false,
      hasGarden: false,
      hasElevator: false,
      hasAirConditioning: false,
      hasWifi: false,
      currency: "BDT",
    },
  });

  // Handle all input changes, including nested objects and checkboxes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("ownerInfo")) {
      const ownerKey = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        ownerInfo: {
          ...prevData.ownerInfo,
          [ownerKey]: value,
        },
      }));
    } else if (name.startsWith("features")) {
      const featuresKey = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        features: {
          ...prevData.features,
          [featuresKey]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create a final object matching the user's requested structure
    const finalData = {
      ...formData,
      features: {
        ...formData.features,
        // Convert boolean features to strings if needed
        furnished: formData.features.furnished,
        hasBalcony: formData.features.hasBalcony,
        hasPool: formData.features.hasPool,
        hasGarden: formData.features.hasGarden,
        hasElevator: formData.features.hasElevator,
        hasAirConditioning: formData.features.hasAirConditioning,
        hasWifi: formData.features.hasWifi,
      },
      // Split amenities string into an array
      amenities: formData.amenities.split(",").map((item) => item.trim()),
      // Set price to a number
      price: Number(formData.price),
    };
    await mutateAsync(finalData);
  };

  const { mutateAsync } = useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosSecure.post("/room", formData);
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("New Room Added");
      queryClient.invalidateQueries({
        queryKey: ["allRooms", "my-posts", "featureRooms"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Animation variants for the form container
  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for individual form items
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto py-8 bg-white dark:text-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 text-indigo-600 dark:text-indigo-400">
        Add New Room
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section: Basic Room Details */}
        <motion.div
          className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-xl"
          variants={sectionVariants}
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Basic Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div className="flex flex-col" variants={itemVariants}>
              <label htmlFor="title" className="text-sm font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Standard 3 Bedroom Suite"
                required
              />
            </motion.div>
            <motion.div className="flex flex-col" variants={itemVariants}>
              <label
                htmlFor="availableFrom"
                className="text-sm font-medium mb-1"
              >
                Available From
              </label>
              <input
                type="date"
                id="availableFrom"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </motion.div>
            <motion.div className="flex flex-col" variants={itemVariants}>
              <label htmlFor="price" className="text-sm font-medium mb-1">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 8000"
                required
              />
            </motion.div>
            <motion.div className="flex flex-col" variants={itemVariants}>
              <label htmlFor="image" className="text-sm font-medium mb-1">
                Image URL
              </label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., https://example.com/image.jpg"
                required
              />
            </motion.div>
            <motion.div className="flex flex-col" variants={itemVariants}>
              <label htmlFor="amenities" className="text-sm font-medium mb-1">
                Amenities
              </label>
              <input
                type="text"
                id="amenities"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 24/7 Security, CCTV, Community Hall"
              />
            </motion.div>
            <motion.div className="flex flex-col" variants={itemVariants}>
              <label
                htmlFor="propertyType"
                className="text-sm font-medium mb-1"
              >
                Property Type
              </label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="Apartment">Apartment</option>
              </select>
            </motion.div>
            <motion.div className="flex flex-col" variants={itemVariants}>
              <label htmlFor="status" className="text-sm font-medium mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="Available">Available</option>
              </select>
            </motion.div>
            <motion.div className="flex flex-col" variants={itemVariants}>
              <label htmlFor="currency" className="text-sm font-medium mb-1">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.features.currency}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="BDT">BDT</option>
              </select>
            </motion.div>
          </div>
        </motion.div>

        {/* Section: Features */}
        <motion.div
          className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-xl"
          variants={sectionVariants}
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Room Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div className="flex flex-col" variants={itemVariants}>
              <label htmlFor="bedRoom" className="text-sm font-medium mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                id="bedRoom"
                name="features.bedRoom"
                value={formData.features.bedRoom}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 3"
                required
              />
            </motion.div>
            <motion.div className="flex flex-col" variants={itemVariants}>
              <label htmlFor="bathRoom" className="text-sm font-medium mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                id="bathRoom"
                name="features.bathRoom"
                value={formData.features.bathRoom}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 2"
                required
              />
            </motion.div>
            <motion.div className="flex flex-col" variants={itemVariants}>
              <label htmlFor="kitchen" className="text-sm font-medium mb-1">
                Kitchens
              </label>
              <input
                type="number"
                id="kitchen"
                name="features.kitchen"
                value={formData.features.kitchen}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 1"
                required
              />
            </motion.div>
            <motion.div className="flex flex-col" variants={itemVariants}>
              <label htmlFor="livingRoom" className="text-sm font-medium mb-1">
                Living Rooms
              </label>
              <input
                type="number"
                id="livingRoom"
                name="features.livingRoom"
                value={formData.features.livingRoom}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 1"
                required
              />
            </motion.div>
            <motion.div className="flex flex-col" variants={itemVariants}>
              <label htmlFor="squareFeet" className="text-sm font-medium mb-1">
                Square Feet
              </label>
              <input
                type="text"
                id="squareFeet"
                name="features.squareFeet"
                value={formData.features.squareFeet}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 1700"
                required
              />
            </motion.div>
            <motion.div className="flex flex-col" variants={itemVariants}>
              <label htmlFor="parking" className="text-sm font-medium mb-1">
                Parking
              </label>
              <input
                type="text"
                id="parking"
                name="features.parking"
                value={formData.features.parking}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Basement"
              />
            </motion.div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
              Additional Features
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { name: "furnished", label: "Furnished" },
                { name: "hasBalcony", label: "Balcony" },
                { name: "hasPool", label: "Pool" },
                { name: "hasGarden", label: "Garden" },
                { name: "hasElevator", label: "Elevator" },
                { name: "hasAirConditioning", label: "A/C" },
                { name: "hasWifi", label: "Wi-Fi" },
              ].map((feature) => (
                <motion.div
                  key={feature.name}
                  className="flex items-center"
                  variants={itemVariants}
                >
                  <input
                    type="checkbox"
                    id={`feature-${feature.name}`}
                    name={`features.${feature.name}`}
                    checked={formData.features[feature.name]}
                    onChange={handleChange}
                    className="h-5 w-5 rounded-md text-indigo-600 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`feature-${feature.name}`}
                    className="ml-2 text-sm font-medium"
                  >
                    {feature.label}
                  </label>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Section: Owner Info (Pre-filled) */}
        <motion.div
          className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-xl"
          variants={sectionVariants}
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Owner Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div className="flex flex-col" variants={itemVariants}>
              <label htmlFor="ownerName" className="text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="ownerName"
                readOnly
                name="ownerInfo.name"
                value={formData.ownerInfo.name}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </motion.div>
            <motion.div className="flex flex-col" variants={itemVariants}>
              <label htmlFor="ownerEmail" className="text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="ownerEmail"
                readOnly
                name="ownerInfo.email"
                value={formData.ownerInfo.email}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </motion.div>
            <motion.div
              className="flex flex-col md:col-span-2"
              variants={itemVariants}
            >
              <label htmlFor="ownerPhoto" className="text-sm font-medium mb-1">
                Photo URL
              </label>
              <input
                type="text"
                readOnly
                id="ownerPhoto"
                name="ownerInfo.photo"
                value={formData.ownerInfo.photo}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          className="w-full flex items-center justify-center py-3 px-6 text-base font-semibold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-5 h-5 mr-2 -ml-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            ></path>
          </svg>
          Add Room
        </motion.button>
      </form>
    </motion.div>
  );
};
