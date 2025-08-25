// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import useAuthValue from "../hooks/useAuthValue";
import { useEffect, useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const MyProfile = () => {
  const { user, loading } = useAuthValue();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  // Tab control
  const [profileInfo, setProfileInfo] = useState("profile-info");

  // Custom Info state (gender, age, birthday, address)
  const [customInfo, setCustomInfo] = useState({
    gender: "",
    age: "",
    birthday: "",
    address: "",
  });

  // Query user data
  const {
    isLoading,
    data: realUser = {},
  } = useQuery({
    queryKey: ["real-user", user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure(`/users/${user?.email}`);
      return data;
    },
    enabled: !!user,
  });

  const { gender, age, birthday, address } = realUser || {};

  // Set initial values when data comes
  useEffect(() => {
    if (realUser) {
      setCustomInfo({
        gender: gender || "",
        age: age || "",
        birthday: birthday || "",
        address: address || "",
      });
    }
  }, [realUser, age, address, birthday, gender]);

  // Mutation
  const { mutateAsync } = useMutation({
    mutationFn: async (info) => {
      const { data } = await axiosSecure.put(`/users`, {
        ...info,
        userEmail: user?.email,
      });
      return data;
    },
    onSuccess: (data) => {
      if (data?.modifiedCount > 0 || data?.insertedId) {
        toast.success("Profile Updated Successfully 🎉", {
          style: {
            border: "1px solid #00df9a",
            padding: "10px",
            color: "#00df9a",
          },
          iconTheme: {
            primary: "#00df9a",
            secondary: "white",
          },
        });
      }
      queryClient.invalidateQueries({ queryKey: ["real-user", user.email] });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const handleCustomInfo = async (e) => {
    e.preventDefault();
    await mutateAsync(customInfo);
  };

  // Format Birthday
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";
    return `${day}${suffix} ${month}, ${year}`;
  };

  if (loading || isLoading) return <LoadingSpinner />;

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
      className="max-w-2xl mx-auto py-10 px-6 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl"
    >
      {/* Tabs */}
      <div className="text-center py-4 space-x-6">
        <button
          onClick={() => setProfileInfo("profile-info")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            profileInfo === "profile-info"
              ? "bg-violet-600 text-white"
              : "text-gray-700 dark:text-gray-300 hover:text-violet-600"
          }`}
        >
          My Profile
        </button>
        <button
          onClick={() => setProfileInfo("my-info")}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            profileInfo === "my-info"
              ? "bg-violet-600 text-white"
              : "text-gray-700 dark:text-gray-300 hover:text-violet-600"
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
            {[
              {
                label: "Email Verified",
                value: user?.emailVerified ? "Yes ✅" : "No ❌",
                color: "green",
              },
              { label: "Gender", value: gender || "N/A", color: "yellow" },
              { label: "Age", value: age || "N/A", color: "purple" },
              { label: "Birthday", value: formatDate(birthday), color: "pink" },
              { label: "Address", value: address || "N/A", color: "indigo" },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-4 bg-${item.color}-50 dark:bg-${item.color}-900 rounded-2xl shadow-md text-center`}
              >
                <p className="text-gray-500 dark:text-gray-300">{item.label}</p>
                <p className="font-semibold text-lg">{item.value}</p>
              </div>
            ))}
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
          {/* Gender */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Gender
            </label>
            <select
              name="gender"
              required
              value={customInfo.gender}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male ♂️</option>
              <option value="Female">Female ♀️</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Age
            </label>
            <input
              required
              type="number"
              name="age"
              value={customInfo.age}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Birthday */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Birthday
            </label>
            <input
              required
              type="date"
              name="birthday"
              value={
                customInfo.birthday
                  ? new Date(customInfo.birthday).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Address
            </label>
            <textarea
              required
              name="address"
              defaultValue={address}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 rounded-xl border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button className="px-6 py-3 rounded-xl font-semibold bg-violet-600 text-white hover:bg-violet-700 transition">
              Save Changes
            </button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
};

export default MyProfile;
