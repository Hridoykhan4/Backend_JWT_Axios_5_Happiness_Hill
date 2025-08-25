import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import Room from "../components/Room";
import useScrollToTop from "../hooks/useScrollToTop";
import { useState } from "react";

const AllRooms = () => {
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const [handleSearch, setHandleSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filters, setFilters] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  useScrollToTop();

  // Count Query
  const { data: countRoom = 0 } = useQuery({
    queryKey: ["countRoom", handleSearch, filters],
    queryFn: async () => {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/roomCount?searchText=${handleSearch}&minPrice=${
          filters.min
        }&maxPrice=${filters.max}`
      );
      return data.count;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const numberOfPages = Math.ceil(countRoom / pageSize);

  // Rooms Query
  const {
    data: rooms = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "allRooms",
      currentPage,
      pageSize,
      sortBy,
      handleSearch,
      filters,
    ],
    queryFn: async () => {
      const { data } = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/rooms?page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&searchText=${handleSearch}&minPrice=${
          filters.min
        }&maxPrice=${filters.max}`
      );
      return data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Handlers
  const handleSearchText = () => {
    setHandleSearch(search);
    setCurrentPage(1);
  };

  const handleApply = () => {
    setFilters({ min: minPrice, max: maxPrice });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({ min: "", max: "" });
    setSearch("");
    setHandleSearch("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");
    setCurrentPage(1);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <p className="text-red-600 font-semibold mb-4">
          Oops! Failed to load rooms. Please try again.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );

  if (rooms.length === 0)
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-gray-600 dark:text-gray-400 text-lg">
        No rooms available at the moment.
      </div>
    );

  return (
    <section className="py-12 w-[96%] mx-auto">
      {/* Sort */}
      <div className="pb-5 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <select
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1);
          }}
          value={sortBy}
          className="p-2 border rounded-md dark:bg-gray-800 dark:text-white"
        >
          <option value="">Sort By</option>
          <option value="priceHighToLow">Price (High → Low)</option>
          <option value="priceLowToHigh">Price (Low → High)</option>
        </select>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Reset Filters
        </button>
      </div>

      {/* Search */}
      <div className="flex justify-center pb-7">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Rooms by Title"
            className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                 dark:bg-gray-900 dark:text-white shadow-sm"
          />
          <button
            onClick={handleSearchText}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 
                 text-white px-4 py-1.5 rounded-full font-medium shadow-md"
          >
            Search
          </button>
        </div>
      </div>

      {/* Price Range */}
      <div className="flex mb-5 flex-wrap gap-3 items-center w-full md:w-1/2">
        <span className="text-gray-700 dark:text-gray-300 font-medium">
          Price:
        </span>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Min"
          className="w-20 px-2 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        />
        <span className="text-gray-700 dark:text-gray-300">-</span>
        <input
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          type="number"
          placeholder="Max"
          className="w-20 px-2 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
        />
        <button
          onClick={handleApply}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Apply
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rooms.map((room) => (
          <Room room={room} key={room._id} />
        ))}
      </div>

      {/* Pagination */}
      {numberOfPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 pt-5">
          <button
            className="px-4 py-2 rounded-lg border font-semibold 
               text-gray-700 dark:text-gray-200 
               border-gray-300 dark:border-gray-600 
               hover:bg-gray-200 dark:hover:bg-gray-700 
               disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          {[...Array(numberOfPages).keys()].map((i) => (
            <button
              key={i}
              className={`px-3 py-2 rounded-lg font-semibold border 
                ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-4 py-2 rounded-lg border font-semibold 
               text-gray-700 dark:text-gray-200 
               border-gray-300 dark:border-gray-600 
               hover:bg-gray-200 dark:hover:bg-gray-700 
               disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === numberOfPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default AllRooms;
