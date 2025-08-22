import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/LoadingSpinner";
import Room from "../components/Room";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import useScrollToTop from "../hooks/useScrollToTop";

const MyPosts = () => {
  useScrollToTop();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosSecure.delete(`/rooms/${id}`);
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries(["my-posts"]);
    },
  });

  const axiosSecure = useAxiosSecure();
  const {
    data: myPosts = [],
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["my-posts"],
    queryFn: async () => {
      const { data } = await axiosSecure(
        "/my-posted-rooms/hridoykhan148385@gmail.com"
      );
      return data;
    },
  });

  const confirmDelete = async (id) => {
    await mutateAsync(id);
  };

  const handleDelete = (id) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible
            ? "animate-in fade-in slide-in-from-top-5"
            : "animate-out fade-out"
        } max-w-sm w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 
         shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center gap-3`}
      >
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-red-600 dark:text-red-400">
            Action Required
          </span>
          <p className="text-sm">Are you sure you want to delete this?</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              confirmDelete(id);
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 rounded-lg text-white bg-red-600 hover:bg-red-700 transition"
          >
            Delete
          </button>

          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 
                     hover:bg-gray-100 dark:hover:bg-gray-800 "
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  if (isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (error || isError) {
    console.error("Something went wrong:", error);
    ("Oops! An error occurred. Please try again.");
    return (
      <div className="text-red-600 font-semibold text-center">
        Failed to load data
      </div>
    );
  }
  return (
    <section className="py-10">
      <div className="grid grid-cols-1  overflow-hidden sm:grid-cols-2 md:grid-cols-3 gap-5">
        {myPosts.map((room) => (
          <Room room={room} key={room._id}>
            <div className="flex py-5 items-center justify-center gap-4">
              {/* Update Button */}
              <Link
                to={`/update-room/${room._id}`}
                className="px-4 py-2 rounded-lg font-semibold transition-all
            bg-primary text-primary-foreground 
            hover:brightness-110 hover:scale-105
            shadow-md
            dark:bg-primary dark:text-white
            focus:ring-2 focus:ring-primary focus:outline-none"
              >
                Update
              </Link>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(room._id)}
                className="px-4 py-2 rounded-lg font-semibold transition-all
            bg-destructive text-destructive-foreground 
            hover:brightness-110 hover:scale-105
            shadow-md
            dark:bg-destructive dark:text-white
            focus:ring-2 focus:ring-destructive focus:outline-none"
              >
                Delete
              </button>
            </div>
          </Room>
        ))}
      </div>
    </section>
  );
};

export default MyPosts;
