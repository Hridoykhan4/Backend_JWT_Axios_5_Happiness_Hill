// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import useAuthValue from "../hooks/useAuthValue";
import { useState } from "react";

const MyProfile = () => {
  const { user, loading } = useAuthValue();
  
  // Tab control
  const [profileInfo, setProfileInfo] = useState("profile-info");

  // Custom Info state (gender, age, birthday, address)
  const [customInfo, setCustomInfo] = useState({
    gender: "",
    age: "",
    birthday: "",
    address: "",
  });

  const handleCustomInfo = (e) => {
    e.preventDefault();
    console.log(customInfo)
  };

  if (loading) return <LoadingSpinner />;

  // Handle form changes
  const handleChange = (e) => {
    setCustomInfo({
      ...customInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-2xl mx-auto py-10 p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl"
    >
      {/* Tabs */}
      <div className="text-center py-4 space-x-6">
        <button
          onClick={() => setProfileInfo("profile-info")}
          className={`dark:text-white text-black font-semibold text-lg ${
            profileInfo === "profile-info"
              ? "underline decoration-violet-500"
              : ""
          }`}
        >
          My Profile
        </button>
        <button
          onClick={() => setProfileInfo("my-info")}
          className={`dark:text-white text-black font-semibold text-lg ${
            profileInfo === "my-info" ? "underline decoration-violet-500" : ""
          }`}
        >
          My Info
        </button>
      </div>

      {/* Profile Info Section */}
      {profileInfo === "profile-info" && (
        <>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <img
              src={user?.photoURL || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-violet-500 shadow-lg object-cover"
            />
            <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
              {user?.displayName || "User Name"}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          </motion.div>

          {/* Extra Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <div className="p-4 bg-green-50 dark:bg-green-900 rounded-2xl shadow-md text-center">
              <p className="text-gray-500 dark:text-gray-300">Email Verified</p>
              <p className="font-semibold text-lg">
                {user?.emailVerified ? "Yes ✅" : "No ❌"}
              </p>
            </div>

            {/* Custom Info Display */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-2xl shadow-md text-center">
              <p className="text-gray-500 dark:text-gray-300">Gender</p>
              <p className="font-semibold text-lg">
                {customInfo.gender || "N/A"}
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-2xl shadow-md text-center">
              <p className="text-gray-500 dark:text-gray-300">Age</p>
              <p className="font-semibold text-lg">{customInfo.age || "N/A"}</p>
            </div>
            <div className="p-4 bg-pink-50 dark:bg-pink-900 rounded-2xl shadow-md text-center">
              <p className="text-gray-500 dark:text-gray-300">Birthday</p>
              <p className="font-semibold text-lg">
                {customInfo.birthday || "N/A"}
              </p>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900 rounded-2xl shadow-md text-center">
              <p className="text-gray-500 dark:text-gray-300">Address</p>
              <p className="font-semibold text-lg">
                {customInfo.address || "N/A"}
              </p>
            </div>
          </motion.div>
        </>
      )}

      {/* My Info Form Section */}
      {profileInfo === "my-info" && (
        <motion.form
          onSubmit={handleCustomInfo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-8 space-y-6"
        >
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <select
              name="gender"
              required
              value={customInfo.gender}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male ♂️</option>
              <option value="Female">Female ♀️</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Age
            </label>
            <input
              required
              type="number"
              name="age"
              value={customInfo.age}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Birthday
            </label>
            <input
              required

              type="date"
              name="birthday"
              value={customInfo.birthday}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Address
            </label>
            <textarea
              required
              name="address"
              value={customInfo.address}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            ></textarea>
          </div>
          <div className="text-center">
            <button className="font-semibold dark:bg-white p-3 rounded-md bg-green-600">
              Submit
            </button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
};

export default MyProfile;
