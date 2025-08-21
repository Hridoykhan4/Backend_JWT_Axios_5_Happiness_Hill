import { Link } from "react-router-dom";

import { AlertCircle } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="text-center p-8 rounded-2xl shadow-lg bg-gray-900/70 backdrop-blur-md border border-gray-700">
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-6xl font-bold mb-4 animate-pulse">404</h1>
        <p className="text-lg mb-6 text-gray-300 animate-bounce">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <Link
          to="/"
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
