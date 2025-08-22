import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingSpinner from "../components/LoadingSpinner";
import Room from "../components/Room";

const MyPosts = () => {
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
      <div className="grid grid-cols-1 py-10 overflow-hidden sm:grid-cols-2 md:grid-cols-3 gap-5">
        {myPosts.map((room) => (
          <Room room={room} key={room._id}>
            <div className="flex py-5 items-center justify-center gap-4">
              {/* Update Button */}
              <button
                className="px-4 py-2 rounded-lg font-semibold transition-all
            bg-primary text-primary-foreground 
            hover:brightness-110 hover:scale-105
            shadow-md
            dark:bg-primary dark:text-white
            focus:ring-2 focus:ring-primary focus:outline-none"
              >
                Update
              </button>

              {/* Delete Button */}
              <button
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
