import { Star } from "lucide-react";

const RatingReview = ({ rating, setRating }) => {
  return (
    <div className="flex justify-center items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          onClick={() => setRating(star)}
          className={` text-xl font-semibold ${
            rating >= star ? "text-yellow-600" : "text-gray-600"
          }`}
        >
          <Star></Star>
        </span>
      ))}
    </div>
  );
};

export default RatingReview;
