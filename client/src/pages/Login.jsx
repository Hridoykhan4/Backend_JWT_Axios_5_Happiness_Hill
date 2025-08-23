import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthValue from "../hooks/useAuthValue";
import useScrollToTop from "../hooks/useScrollToTop";
import { useState } from "react";
import toast from "react-hot-toast";

const Login = () => {
  useScrollToTop();
  const nav = useNavigate();
  const { state } = useLocation();
  const { signInWithGoogle, setUser, signIn } = useAuthValue();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  /* Sign In with Google */
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const res = await signInWithGoogle();
      setUser(res.user);
      toast.success("Signed in successfully ✅");
      nav(state ? state : "/");
    } catch (err) {
      console.error(err);
      toast.error("Google sign-in failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* Sign In with Email */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({});
    setLoading(true);

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    if (!email) {
      setLoading(false);
      return setError((prev) => ({ ...prev, emailError: "Email is required" }));
    }

    if (!password) {
      setLoading(false);
      return setError((prev) => ({
        ...prev,
        passwordError: "Password is required",
      }));
    }

    try {
      const res = await signIn(email, password);
      setUser(res.user);
      toast.success("Welcome back 🎉");
      nav(state ? state : "/");
    } catch (err) {
      console.error(err);
      toast.error("Invalid email or password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 min-h-[calc(100vh-306px)] bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mx-auto mb-4">
          <img
            className="w-auto h-8"
            src="https://merakiui.com/images/logo.svg"
            alt="Logo"
          />
        </div>

        {/* Welcome text */}
        <p className="mt-2 text-xl text-center text-gray-600 dark:text-gray-300">
          Welcome back!
        </p>

        {/* Google login button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex items-center justify-center w-full mt-6 cursor-pointer transition transform hover:scale-105 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="px-4 py-2">
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 40 40">
                <path
                  d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                  fill="#FFC107"
                />
                <path
                  d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                  fill="#FF3D00"
                />
                <path
                  d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                  fill="#4CAF50"
                />
                <path
                  d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                  fill="#1976D2"
                />
              </svg>
            )}
          </div>
          {!loading && (
            <span className="px-4 py-3 font-bold text-gray-700 dark:text-gray-200">
              Sign in with Google
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center justify-between mt-6">
          <span className="w-1/5 border-b border-gray-300 dark:border-gray-500"></span>
          <div className="text-xs text-gray-500 dark:text-gray-400 uppercase text-center">
            or login with email
          </div>
          <span className="w-1/5 border-b border-gray-300 dark:border-gray-500"></span>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={`block w-full px-4 py-2 rounded-lg border outline-none bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 ${
                error.emailError
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } focus:ring-2 focus:ring-blue-400`}
            />
            {error.emailError && (
              <p className="text-red-500 text-sm mt-1">{error.emailError}</p>
            )}
          </div>

          <div className="mt-4">
            <label
              className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={`block w-full px-4 py-2 rounded-lg border outline-none bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 ${
                error.passwordError
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } focus:ring-2 focus:ring-blue-400`}
            />
            {error.passwordError && (
              <p className="text-red-500 text-sm mt-1">{error.passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 mx-auto border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Registration link */}
        <div className="flex items-center justify-center mt-4 text-xs text-gray-500 dark:text-gray-400">
          <span>Don't have an account? </span>
          <Link
            to="/register"
            className="ml-1 underline hover:text-blue-500 dark:hover:text-blue-400"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
