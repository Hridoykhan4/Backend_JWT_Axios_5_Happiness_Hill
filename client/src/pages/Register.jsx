import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import useScrollToTop from "../hooks/useScrollToTop";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import useAuthValue from "../hooks/useAuthValue";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const Register = () => {
  useScrollToTop();
  const [error, setError] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signInWithGoogle, setUser, createUser, updateUserProfile } =
    useAuthValue();

  /* Sign In with Google */
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const res = await signInWithGoogle();
      setUser(res.user);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* Register with Email */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const photo = form.photo.value;
    const email = form.email.value;
    const password = form.password.value;

    setError({});
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLoading(false);
      return setError((prev) => ({
        ...prev,
        emailError: "Invalid email format",
      }));
    }

    if (password.length < 6) {
      setLoading(false);
      return setError((prev) => ({
        ...prev,
        passError: "Password must be at least 6 characters long",
      }));
    }

    if (!/\d/.test(password)) {
      setLoading(false);
      return setError((prev) => ({
        ...prev,
        passError: "Password must include at least one number",
      }));
    }

    try {
      const res = await createUser(email, password);
      await updateUserProfile(name, photo);
      setUser({
        ...res.user,
        photoURL: photo,
        displayName: name,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center py-10 min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
          Create an Account
        </h2>

        {/* Google Sign-In */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center justify-center w-full gap-3 border rounded-lg py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <FcGoogle size={24} />
              Continue with Google
            </>
          )}
        </motion.button>

        <div className="my-6 flex items-center gap-3">
          <hr className="flex-1 border-gray-300 dark:border-gray-700" />
          <span className="text-gray-500 dark:text-gray-400 text-sm">OR</span>
          <hr className="flex-1 border-gray-300 dark:border-gray-700" />
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Photo URL
            </label>
            <input
              type="url"
              name="photo"
              placeholder="Enter photo URL"
              required
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                error.emailError ? "border-red-500" : ""
              } dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none`}
            />
            {error.emailError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {error.emailError}
              </motion.p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                error.passError ? "border-red-500" : ""
              } dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none`}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              className="dark:text-white text-black right-2 absolute top-8"
              type="button"
            >
              {showPass ? <EyeOff /> : <Eye />}
            </button>
            {error.passError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {error.passError}
              </motion.p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md hover:shadow-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Register"
            )}
          </motion.button>
        </form>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </section>
  );
};

export default Register;
